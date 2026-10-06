/**
 * A Vitest reporter that names every test which passed only on a retry.
 *
 * CI gives each test one retry (see `test` in vite.config.ts), and the default
 * reporter shows a test that passed on its second try as a plain pass. This
 * prints those tests after the run, so a test that keeps needing its retry is
 * visible in the log instead of hidden by it.
 */
export default class RetriesReporter {
  /** @type {string[]} */
  retried = [];

  /** @param {import('vitest/node').TestCase} testCase */
  onTestCaseResult(testCase) {
    const { retryCount = 0 } = testCase.diagnostic() ?? {};
    if (retryCount > 0 && testCase.result().state === 'passed')
      this.retried.push(
        `${testCase.project.name}  ${testCase.module.relativeModuleId} > ${testCase.fullName}`,
      );
  }

  onTestRunEnd() {
    if (this.retried.length === 0) return;
    console.log(`\nPassed only on a retry (${this.retried.length}):`);
    for (const line of this.retried) console.log(`  ${line}`);
  }
}
