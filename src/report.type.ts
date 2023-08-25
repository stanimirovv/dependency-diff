// Format returned from dependency cruiser
export type DependencyModule = {
  modules: Module[];
  summary: Record<string, unknown>;
};

export type Module = {
  source: string;
  dependencies: Dependency[];
  dependents: RelativePath[];
  orphan: boolean;
  valid: boolean;
};

export type Dependency = {
  dynamic: boolean;
  module: string;
  moduleSystem: string;
  exoticallyRequired: boolean;
  resolved: RelativePath;
  coreModule: boolean;
  followable: boolean;
  couldNotResolve: boolean;
  dependencyTypes: string[];
  matchesDoNotFollow: boolean;
  circular: boolean;
  valid: boolean;
};

export type DiffResponse = {
  modules: DiffModule[];
};

//TODO: we probablly don't need dependents and should instead put them as dependencies to their respective module
export type DiffModule = {
  source: string;
  existingDependencies: RelativePath[];

  addedDependencies: RelativePath[];

  removedDependencies: RelativePath[];

  isAdded?: boolean;
  isRemoved?: boolean;
};

type RelativePath = string;
