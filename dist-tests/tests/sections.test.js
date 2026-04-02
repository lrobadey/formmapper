"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sections_1 = require("../src/state/sections");
const repair_1 = require("../src/model/repair");
const testUtils_1 = require("./testUtils");
const makeSections = () => [
    { id: "s1", name: "A", colorId: "slate_01", startSec: 0, endSec: 8, notes: "", tags: [] },
    { id: "s2", name: "B", colorId: "navy_01", startSec: 8, endSec: 16, notes: "", tags: [] },
    { id: "s3", name: "C", colorId: "maroon_01", startSec: 16, endSec: 24, notes: "", tags: [] },
];
(0, testUtils_1.test)("ripple resize keeps gapless ordering and min duration", () => {
    const next = (0, sections_1.rippleResizeSections)(makeSections(), "s1", 6);
    (0, testUtils_1.assertEqual)(next[0].endSec, 6);
    (0, testUtils_1.assertEqual)(next[1].startSec, 6);
    (0, testUtils_1.assertEqual)(next[1].endSec, 14);
    (0, testUtils_1.assertEqual)(next[2].startSec, 14);
    (0, testUtils_1.assertEqual)(next[2].endSec, 22);
    (0, testUtils_1.assertCondition)(next.every((s, idx) => idx === 0 ? s.startSec === 0 : s.startSec === next[idx - 1].endSec), "Sections must be gapless");
});
(0, testUtils_1.test)("ripple resize enforces MIN_SECTION_SEC", () => {
    const next = (0, sections_1.rippleResizeSections)(makeSections(), "s1", 0.01);
    (0, testUtils_1.assertClose)(next[0].endSec, repair_1.MIN_SECTION_SEC);
    (0, testUtils_1.assertCondition)(next[1].startSec === next[0].endSec, "Second section should start at first end");
});
(0, testUtils_1.test)("insert section steals time from the right and stays gapless", () => {
    const next = (0, sections_1.insertSectionAtBoundary)(makeSections(), 0, 4, "s-insert", "New", "forest_01");
    const inserted = next[1];
    (0, testUtils_1.assertEqual)(inserted.startSec, 8);
    (0, testUtils_1.assertEqual)(inserted.endSec, 12);
    (0, testUtils_1.assertCondition)(next.every((s, idx) => idx === 0 ? s.startSec === 0 : s.startSec === next[idx - 1].endSec), "Gapless after insert");
});
(0, testUtils_1.test)("insert section extends tail if insufficient time to steal", () => {
    const base = [
        { id: "s1", name: "A", colorId: "slate_01", startSec: 0, endSec: 2, notes: "", tags: [] },
        { id: "s2", name: "B", colorId: "navy_01", startSec: 2, endSec: 2 + repair_1.MIN_SECTION_SEC, notes: "", tags: [] },
    ];
    const next = (0, sections_1.insertSectionAtBoundary)(base, 0, 5, "s-insert", "New", "forest_01");
    (0, testUtils_1.assertCondition)(next[next.length - 1].endSec > base[base.length - 1].endSec, "Tail should extend to fit insert");
    (0, testUtils_1.assertCondition)(next.every((s, idx) => idx === 0 ? s.startSec === 0 : s.startSec === next[idx - 1].endSec), "Gapless after tail extend");
});
