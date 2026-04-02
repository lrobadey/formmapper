"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAllTests = exports.assertCondition = exports.assertDeepEqual = exports.assertClose = exports.assertEqual = exports.test = void 0;
const tests = [];
const test = (name, fn) => {
    tests.push({ name, fn });
};
exports.test = test;
const assertEqual = (actual, expected, message) => {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected} but got ${actual}`);
    }
};
exports.assertEqual = assertEqual;
const assertClose = (actual, expected, delta = 1e-6, message) => {
    if (Math.abs(actual - expected) > delta) {
        throw new Error(message || `Expected ${actual} ≈ ${expected}`);
    }
};
exports.assertClose = assertClose;
const assertDeepEqual = (actual, expected, message) => {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) {
        throw new Error(message || `Expected ${b} but got ${a}`);
    }
};
exports.assertDeepEqual = assertDeepEqual;
const assertCondition = (condition, message) => {
    if (!condition) {
        throw new Error(message);
    }
};
exports.assertCondition = assertCondition;
const runAllTests = async () => {
    let passed = 0;
    for (const t of tests) {
        try {
            await t.fn();
            passed += 1;
        }
        catch (err) {
            console.error(`✖ ${t.name}`);
            console.error(err);
            process.exitCode = 1;
            continue;
        }
        console.log(`✔ ${t.name}`);
    }
    console.log(`\n${passed} / ${tests.length} tests passed`);
};
exports.runAllTests = runAllTests;
