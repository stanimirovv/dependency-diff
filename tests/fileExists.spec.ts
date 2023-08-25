import fileExists from "../src/utils/fileExists";

describe("test fileExists", () => {
  it("unexisting file returns false", () => {
    expect(fileExists("unexistingfile")).toBeFalsy();
  });

  it("existing file returns true", () => {
    expect(fileExists("tests/data/before.json")).toBeTruthy();
  });
});
