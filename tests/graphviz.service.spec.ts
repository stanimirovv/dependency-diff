import { GraphvizService } from "../src/graphviz.service";
import { DiffResponse } from "../src/report.type";

describe("test graphviz.service", () => {
  it("123test valid graph generation based off report", () => {
    const gv = new GraphvizService();

    const report: DiffResponse = {
      modules: [
        {
          source: "lib/base64.ts",
          addedDependencies: [],
          addedDependents: [],
          existingDependencies: ["asd", "dzhe"],
          existingDependents: [],
          removedDependencies: [],
          removedDependents: [],
        },
        {
          source: "lib/extractPrice.ts",
          addedDependencies: ["lib/isValidUrl.ts"],
          addedDependents: ["asd"],
          existingDependencies: [],
          existingDependents: [],
          removedDependencies: ["lib/extractPrice/avanti.ts"],
          removedDependents: ["dzhe"],
        },
      ],
    };
    const dot = gv.generateDotGraph(report).replaceAll("\n", "");
    console.log("DOT", dot);
    expect(dot).toEqual(
      `digraph DependencyDiff {  "asd";  "dzhe";  "lib/base64.ts";  "lib/isValidUrl.ts";  "lib/extractPrice/avanti.ts";  "lib/extractPrice.ts";  "lib/base64.ts" -> "asd" [ color = "grey" ];  "lib/base64.ts" -> "dzhe" [ color = "grey" ];  "lib/extractPrice.ts" -> "lib/extractPrice/avanti.ts" [ color = "red" ];  "dzhe" -> "lib/extractPrice.ts" [ color = "red" ];  "lib/extractPrice.ts" -> "lib/isValidUrl.ts" [ color = "green" ];  "asd" -> "lib/extractPrice.ts" [ color = "green" ];}`
    );
  });
});
