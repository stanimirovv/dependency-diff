import * as graphviz from "graphviz";
import { DiffModule, DiffResponse } from "./report.type";

const existingColor = "grey";
const newColor = "green";
const removedColor = "red";

type canDrawEdges = "existingDependencies" | "removedDependencies" | "addedDependencies";

export class GraphvizService {
  public generateDotGraph(diffResponse: DiffResponse) {
    const g = graphviz.digraph("DependencyDiff");
    // generate all nodes
    const uniqueFileNames = this.getAllUniqueFileNames(diffResponse);

    const nodes = uniqueFileNames.reduce((acc: Record<string, graphviz.Node>, fileName: string) => {
      acc[fileName] = g.addNode(fileName);
      // TODO: add highlight for added removed to the node
      const module = diffResponse.modules.filter((module) => module.source === fileName)[0];
      if (module?.isAdded) {
        acc[fileName].set("color", newColor);
      } else if (module?.isRemoved) {
        acc[fileName].set("color", removedColor);
      }
      return acc;
    }, {});

    diffResponse.modules.forEach((module) => {
      this.drawEdgesForModule(g, nodes, module);
    });

    return g.to_dot();
  }

  drawEdgesForModule(g: graphviz.Graph, nodes: Record<string, graphviz.Node>, module: DiffModule) {
    this.drawEdgeForDependencies(g, nodes, module, existingColor, "existingDependencies");
    this.drawEdgeForDependencies(g, nodes, module, removedColor, "removedDependencies");
    this.drawEdgeForDependencies(g, nodes, module, newColor, "addedDependencies");
  }

  drawEdgeForDependencies(
    g: graphviz.Graph,
    nodes: Record<string, graphviz.Node>,
    module: DiffModule,
    color: string,
    key: canDrawEdges,
  ) {
    module[key].forEach((dep) => {
      const e = g.addEdge(nodes[module.source], dep);
      e.set("color", color);
    });
  }

  drawEdgeForDependents(
    g: graphviz.Graph,
    nodes: Record<string, graphviz.Node>,
    module: DiffModule,
    color: string,
    key: canDrawEdges,
  ) {
    module[key].forEach((dep) => {
      const e = g.addEdge(dep, nodes[module.source]);
      e.set("color", color);
    });
  }

  getAllUniqueFileNames(report: DiffResponse) {
    const uniqueStrings = [
      ...report.modules.reduce((acc, item) => {
        const combined = [
          ...item.addedDependencies,
          ...item.removedDependencies,
          ...item.existingDependencies,
          item.source,
        ];

        for (const str of combined) {
          acc.add(str);
        }

        return acc;
      }, new Set<string>()),
    ];

    return uniqueStrings;
  }
}
