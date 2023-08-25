#!/usr/bin/env node

import { DependencyDiffService } from "./dependencyDiff.service";
import { GraphvizService } from "./graphviz.service";

// Generate report
const dependencyDiff = new DependencyDiffService();
const diffResponse = dependencyDiff.diff(process.argv[2], process.argv[3]);

// Vizualise report
if (process.env.DOT) {
  const gv = new GraphvizService();
  console.log(gv.generateDotGraph(diffResponse));
} else {
  console.log(diffResponse);
}
