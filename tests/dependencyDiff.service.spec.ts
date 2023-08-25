import { DependencyDiffService } from "../src/dependencyDiff.service";

describe("test dependencyDiff", () => {
  it("test invalid file path", () => {
    const depDiff = new DependencyDiffService();
    expect.assertions(1);
    try {
      depDiff.diff("tests/data/after1.json", "tests/data/after2.json");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("test nothing has changed", () => {
    const depDiff = new DependencyDiffService();
    const response = depDiff.diff("./tests/data/after.json", "./tests/data/after.json");

    expect(response.modules.length).toBe(11);
  });

  it("test there is new module", () => {
    const depDiff = new DependencyDiffService();
    const response = depDiff.diff(
      "./tests/data/after.json",
      "./tests/data/after_added_module.json",
    );

    expect(response.modules.length).toBe(11);
    expect(response.modules[0].source).toBe("lib/base64.ts");
    expect(response.modules[0].isAdded).toBeTruthy();
  });

  it("test there is removed module", () => {
    const depDiff = new DependencyDiffService();
    const response = depDiff.diff(
      "./tests/data/after.json",
      "./tests/data/after_removed_module.json",
    );

    expect(response.modules.length).toBe(12);

    // Check for removed modules is done last, so this is the last element
    expect(response.modules[11].isRemoved).toBeTruthy();
  });

  it("test changes in dependencies and dependents", () => {
    const depDiff = new DependencyDiffService();
    const response = depDiff.diff("./tests/data/before_mini.json", "./tests/data/after_mini.json");

    expect(response.modules.length).toBe(2);
    expect(response.modules).toEqual([
      {
        source: "lib/base64.ts",
        addedDependencies: [],
        addedDependents: [],
        existingDependencies: [],
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
    ]);
  });
});
