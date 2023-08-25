import fs from "fs";

export default function fileExists(filePath: string): boolean {
  try {
    fs.statSync(filePath);
    return true;
  } catch (err) {
    console.error(`File: ${filePath} doesn't exist.`);
    return false;
  }
}
