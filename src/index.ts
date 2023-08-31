#!/usr/bin/env node

import ArgumentParser from "./argParse.service";
import { DependencyDiffService } from "./dependencyDiff.service";
import { GitTraverseService } from "./gitTraverse.service";
import { GraphvizService } from "./graphviz.service";
import { DiffResponse } from "./report.type";

(async () => {
  let diffResponse: DiffResponse;
  const dependencyDiff = new DependencyDiffService();
  const arg = new ArgumentParser();

  if (arg.shouldGenerateReport(process.argv[2] || "", process.argv[3] || "")) {
    const gts = new GitTraverseService();
    const [reportA, reportB] = await gts.generateReportForBranches(
      process.argv[2],
      process.argv[3],
    );
    diffResponse = dependencyDiff.diff(reportA, reportB);
  } else {
    diffResponse = dependencyDiff.diff(process.argv[2], process.argv[3]);
  }

  // Vizualise report
  if (process.env.JSON) {
    console.log(diffResponse);
  } else {
    const gv = new GraphvizService();
    console.log(gv.generateDotGraph(diffResponse));
  }
})();
