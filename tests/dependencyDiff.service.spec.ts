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

  it("test there is removed module", () => {
    const depDiff = new DependencyDiffService();
    const response = depDiff.diff(
      "./tests/data/after.json",
      "./tests/data/after_added_module.json",
    );

    expect(response.modules.length).toBe(11);
    expect(response.modules[0].source).toBe("lib/base64.ts");
    expect(response.modules[0].isRemoved).toBeTruthy();
  });

  it("test there is added module", () => {
    const depDiff = new DependencyDiffService();
    const response = depDiff.diff(
      "./tests/data/after.json",
      "./tests/data/after_removed_module.json",
    );

    expect(response.modules.length).toBe(12);

    // Check for removed modules is done last, so this is the last element
    expect(response.modules[11].isAdded).toBeTruthy();
  });

  it("test changes in dependencies and dependents", () => {
    const depDiff = new DependencyDiffService();
    const response = depDiff.diff("./tests/data/before_mini.json", "./tests/data/after_mini.json");

    expect(response.modules.length).toBe(2);
    expect(response.modules).toEqual([
      {
        source: "lib/base64.ts",
        addedDependencies: [],
        existingDependencies: [],
        removedDependencies: [],
      },
      {
        source: "lib/extractPrice.ts",
        addedDependencies: ["lib/isValidUrl.ts"],
        existingDependencies: [
          "lib/extractPrice/drinklink.ts",
          "lib/extractPrice/emag.ts",
          "lib/extractPrice/ozone.ts",
          "lib/log.ts",
        ],
        removedDependencies: ["lib/extractPrice/avanti.ts"],
      },
    ]);
  });

  it("test full scenario including new deps, removed deps and new connections", () => {
    const depDiff = new DependencyDiffService();
    const response = depDiff.diff(
      "./tests/data/before_removed_dep.json",
      "./tests/data/after_removed_dep.json",
    );

    expect(response.modules.length).toBe(12);
    expect(response.modules).toEqual([
      {
        source: "lib/base64.ts",
        addedDependencies: [],
        existingDependencies: [],
        removedDependencies: [],
      },
      {
        source: "lib/extractPrice.ts",
        addedDependencies: [],
        existingDependencies: [
          "lib/extractPrice/avanti.ts",
          "lib/extractPrice/drinklink.ts",
          "lib/extractPrice/ozone.ts",
          "lib/isValidUrl.ts",
          "lib/log.ts",
        ],
        removedDependencies: ["lib/extractPrice/emag.ts"],
      },
      {
        source: "lib/extractPrice/avanti.ts",
        addedDependencies: [],
        existingDependencies: ["lib/log.ts"],
        removedDependencies: [],
      },
      {
        source: "lib/log.ts",
        addedDependencies: [],
        existingDependencies: [],
        removedDependencies: [],
      },
      {
        source: "lib/extractPrice/drinklink.ts",
        addedDependencies: [],
        existingDependencies: ["lib/log.ts"],
        removedDependencies: [],
      },
      {
        source: "lib/extractPrice/emag.ts",
        addedDependencies: [],
        existingDependencies: [],
        removedDependencies: ["lib/log.ts"],
        isRemoved: true,
      },
      {
        source: "lib/extractPrice/ozone.ts",
        addedDependencies: [],
        existingDependencies: [],
        removedDependencies: ["lib/log.ts"],
      },
      {
        source: "lib/isValidUrl.ts",
        addedDependencies: [],
        existingDependencies: [],
        removedDependencies: [],
      },
      {
        source: "lib/isValidEmail.ts",
        addedDependencies: [],
        existingDependencies: [],
        removedDependencies: [],
      },
      {
        source: "lib/prismaClient.ts",
        addedDependencies: [],
        existingDependencies: [],
        removedDependencies: [],
      },
      {
        source: "lib/sendMail.ts",
        addedDependencies: [],
        existingDependencies: ["lib/log.ts"],
        removedDependencies: [],
      },
      {
        source: "lib/extractPrice/phony.ts",
        addedDependencies: ["lib/log.ts"],
        existingDependencies: [],
        removedDependencies: [],
        isAdded: true,
      },
    ]);
  });
});
