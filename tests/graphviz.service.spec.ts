import { GraphvizService } from "../src/graphviz.service";
import { DiffResponse } from "../src/report.type";

describe("test graphviz.service", () => {
  it("test valid graph generation based off report", () => {
    const gv = new GraphvizService();

    const report: DiffResponse = {
      modules: [
        {
          source: "lib/base64.ts",
          addedDependencies: [],
          existingDependencies: ["asd", "dzhe"],
          removedDependencies: [],
        },
        {
          source: "lib/extractPrice.ts",
          addedDependencies: ["lib/isValidUrl.ts"],
          existingDependencies: [],
          removedDependencies: ["lib/extractPrice/avanti.ts"],
        },
      ],
    };
    const dot = gv.generateDotGraph(report).replaceAll("\n", "");
    expect(dot).toEqual(
      `digraph DependencyDiff {  "asd";  "dzhe";  "lib/base64.ts";  "lib/isValidUrl.ts";  "lib/extractPrice/avanti.ts";  "lib/extractPrice.ts";  "lib/base64.ts" -> "asd" [ color = "grey" ];  "lib/base64.ts" -> "dzhe" [ color = "grey" ];  "lib/extractPrice.ts" -> "lib/extractPrice/avanti.ts" [ color = "red" ];  "lib/extractPrice.ts" -> "lib/isValidUrl.ts" [ color = "green" ];}`,
    );
  });
});
