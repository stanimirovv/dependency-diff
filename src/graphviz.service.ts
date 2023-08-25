import * as graphviz from "graphviz";
import { DiffModule, DiffResponse } from "./report.type";

const existingColor = "grey";

export class GraphvizService {
  public generateDotGraph(diffResponse: DiffResponse) {
    const g = graphviz.digraph("DependencyDiff");
    // generate all nodes
    const uniqueFileNames = this.getAllUniqueFileNames(diffResponse);

    const nodes = uniqueFileNames.reduce(
      (acc: Record<string, graphviz.Node>, fileName: string) => {
        acc[fileName] = g.addNode(fileName);
        return acc;
      },
      {}
    );

    diffResponse.modules.forEach((module) => {
      this.drawEdgesForModule(g, nodes, module);
    });

    return g.to_dot();
  }

  drawEdgesForModule(
    g: graphviz.Graph,
    nodes: Record<string, graphviz.Node>,
    module: DiffModule
  ) {
    // Existing
    module.existingDependencies.forEach((dep) => {
      const e = g.addEdge(nodes[module.source], dep);
      e.set("color", existingColor);
    });

    module.existingDependents.forEach((dep) => {
      const e = g.addEdge(dep, nodes[module.source]);
      e.set("color", existingColor);
    });

    // Removed
    module.removedDependencies.forEach((dep) => {
      const e = g.addEdge(nodes[module.source], dep);
      e.set("color", "red");
    });

    module.removedDependents.forEach((dep) => {
      const e = g.addEdge(dep, nodes[module.source]);
      e.set("color", "red");
    });

    // Added
    module.addedDependencies.forEach((dep) => {
      const e = g.addEdge(nodes[module.source], dep);
      e.set("color", "green");
    });

    module.addedDependents.forEach((dep) => {
      const e = g.addEdge(dep, nodes[module.source]);
      e.set("color", "green");
    });
  }

  getAllUniqueFileNames(report: DiffResponse) {
    const uniqueStrings = [
      ...report.modules.reduce((acc, item) => {
        const combined = [
          ...item.addedDependencies,
          ...item.addedDependents,
          ...item.removedDependencies,
          ...item.removedDependents,
          ...item.existingDependencies,
          ...item.existingDependents,
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
