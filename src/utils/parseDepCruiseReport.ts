import { DependencyModule } from "../report.type";
import fs from "fs";

export default function parseDepcruiseReport(
  depcruiseReportPath: string
): DependencyModule {
  try {
    const beforeFileString = fs.readFileSync(depcruiseReportPath, "utf-8");
    const parsedReport: DependencyModule = JSON.parse(beforeFileString);
    return parsedReport;
  } catch (err: unknown) {
    console.error(`Failed parsing: ${depcruiseReportPath} `);
    throw err;
  }
}
