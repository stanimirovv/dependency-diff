import fileExists from "./utils/fileExists";

import {
  DependencyModule,
  DiffModule,
  DiffResponse,
  Module,
} from "./report.type";
import parseDepcruiseReport from "./utils/parseDepCruiseReport";

export class DependencyDiffService {
  public diff(beforePath: string, afterPath: string): DiffResponse {
    if (!fileExists(beforePath) || !fileExists(afterPath)) {
      console.error(`Wrong input data. Please submit 2 valid filePaths.`);
    }

    const beforeReport = parseDepcruiseReport(beforePath);
    const afterReport = parseDepcruiseReport(afterPath);

    return this.diffReports(beforeReport, afterReport);
  }

  private diffReports(
    beforeReport: DependencyModule,
    afterReport: DependencyModule
  ): DiffResponse {
    const diffResponse: DiffResponse = { modules: [] };

    // Check for new Modules
    beforeReport.modules.forEach((module: Module) => {
      const match = afterReport.modules.find((afterModule: Module) => {
        return afterModule.source === module.source;
      });

      // If no match found, entirely new module has been added
      // and must be added to the diff
      if (match === undefined) {
        const newlyAddedModule: DiffModule = {
          source: module.source,
          addedDependencies: module.dependencies.map((d) => d.resolved),
          addedDependents: module.dependents,

          existingDependencies: [],
          existingDependents: [],

          removedDependencies: [],
          removedDependents: [],

          isAdded: true,
        };
        diffResponse.modules.push(newlyAddedModule);
      } else if (match) {
        // If match found, diff the dependents
        const addedDependencies = match.dependencies
          .filter(
            (n) =>
              !module.dependencies.map((d) => d.resolved).includes(n.resolved)
          )
          .map((m) => m.resolved);
        const addedDependents = match.dependents.filter(
          (n) => !module.dependents.includes(n)
        );

        const removedDependencies = module.dependencies
          .filter(
            (n) =>
              !match.dependencies.map((d) => d.resolved).includes(n.resolved)
          )
          .map((m) => m.resolved);

        const removedDependents = module.dependents.filter(
          (n) => !match.dependents.includes(n)
        );

        const existingModule: DiffModule = {
          source: module.source,
          addedDependencies,
          addedDependents,

          existingDependencies: [],
          existingDependents: [],

          removedDependencies,
          removedDependents,
        };
        diffResponse.modules.push(existingModule);
      }

      // If match found, diff dependencies
    });

    // Check for removed modules
    // TODO: extract function
    afterReport.modules.forEach((module: Module) => {
      const match = beforeReport.modules.find((beforeModule: Module) => {
        return beforeModule.source === module.source;
      });

      if (match === undefined) {
        const removedModule: DiffModule = {
          source: module.source,
          addedDependencies: [],
          addedDependents: [],

          existingDependencies: [],
          existingDependents: [],

          removedDependencies: module.dependencies.map((d) => d.resolved),
          removedDependents: module.dependents,
          isRemoved: true,
        };
        diffResponse.modules.push(removedModule);
      }
    });

    return diffResponse;
  }
}
