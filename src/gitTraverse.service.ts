import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

export class GitTraverseService {
  async generateReportForBranches(initialBranch: string, targetBranch: string) {
    const startingBranch = (await this.getCurrentGitBranch()) || "";

    const branchAReport = await this.generateReport(initialBranch);
    this.switchGitBranch(targetBranch);
    const branchBReport = await this.generateReport(targetBranch);

    this.switchGitBranch(startingBranch);
    return [branchAReport, branchBReport];
  }

  private async getCurrentGitBranch() {
    try {
      const { stdout } = await execAsync("git rev-parse --abbrev-ref HEAD");
      return stdout.trim();
    } catch (error) {
      console.error(`Error executing command: ${error}`);
      throw new Error(`Error executing command: ${error}`);
    }
  }

  private async switchGitBranch(branch: string) {
    try {
      await execAsync(`git checkout ${branch}`);
      return true;
    } catch (error) {
      console.error(`Error switching branch: ${error}`);
      throw new Error(`Error switching branch: ${error}`);
    }
  }

  private async generateReport(branch: string) {
    try {
      const reportName = `${branch}-report.json`;
      await execAsync(`npm run depcruise-report > ${reportName} --silent`);

      return reportName;
    } catch (error) {
      console.error(`Error switching branch: ${error}`);
      throw new Error(`Could not generate report for branch: ${branch}`);
    }
  }
}
