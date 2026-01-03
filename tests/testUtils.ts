type TestFn = () => void | Promise<void>;

interface TestCase {
  name: string;
  fn: TestFn;
}

const tests: TestCase[] = [];

export const test = (name: string, fn: TestFn) => {
  tests.push({ name, fn });
};

export const assertEqual = <T>(actual: T, expected: T, message?: string) => {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
};

export const assertClose = (actual: number, expected: number, delta = 1e-6, message?: string) => {
  if (Math.abs(actual - expected) > delta) {
    throw new Error(message || `Expected ${actual} ≈ ${expected}`);
  }
};

export const assertDeepEqual = (actual: unknown, expected: unknown, message?: string) => {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a !== b) {
    throw new Error(message || `Expected ${b} but got ${a}`);
  }
};

export const assertCondition = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

export const runAllTests = async () => {
  let passed = 0;
  for (const t of tests) {
    try {
      await t.fn();
      passed += 1;
    } catch (err) {
      console.error(`✖ ${t.name}`);
      console.error(err);
      process.exitCode = 1;
      continue;
    }
    console.log(`✔ ${t.name}`);
  }
  console.log(`\n${passed} / ${tests.length} tests passed`);
};
