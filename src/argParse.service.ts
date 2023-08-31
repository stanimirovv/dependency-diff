export default class ArgumentParser {
  shouldGenerateReport(firstArgument: string, secondArgument: string) {
    return firstArgument.endsWith(".json") && secondArgument.endsWith(".json");
  }
}
