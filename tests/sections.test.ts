import type { Section } from "../src/state/types";
import { rippleResizeSections, insertSectionAtBoundary } from "../src/state/sections";
import { MIN_SECTION_SEC } from "../src/model/repair";
import { assertClose, assertCondition, assertEqual, test } from "./testUtils";

const makeSections = (): Section[] => [
  { id: "s1", name: "A", colorId: "slate_01", startSec: 0, endSec: 8, notes: "", tags: [] },
  { id: "s2", name: "B", colorId: "navy_01", startSec: 8, endSec: 16, notes: "", tags: [] },
  { id: "s3", name: "C", colorId: "maroon_01", startSec: 16, endSec: 24, notes: "", tags: [] },
];

test("ripple resize keeps gapless ordering and min duration", () => {
  const next = rippleResizeSections(makeSections(), "s1", 6);
  assertEqual(next[0].endSec, 6);
  assertEqual(next[1].startSec, 6);
  assertEqual(next[1].endSec, 14);
  assertEqual(next[2].startSec, 14);
  assertEqual(next[2].endSec, 22);
  assertCondition(next.every((s, idx) => idx === 0 ? s.startSec === 0 : s.startSec === next[idx - 1].endSec), "Sections must be gapless");
});

test("ripple resize enforces MIN_SECTION_SEC", () => {
  const next = rippleResizeSections(makeSections(), "s1", 0.01);
  assertClose(next[0].endSec, MIN_SECTION_SEC);
  assertCondition(next[1].startSec === next[0].endSec, "Second section should start at first end");
});

test("insert section steals time from the right and stays gapless", () => {
  const next = insertSectionAtBoundary(makeSections(), 0, 4, "s-insert", "New", "forest_01");
  const inserted = next[1];
  assertEqual(inserted.startSec, 8);
  assertEqual(inserted.endSec, 12);
  assertCondition(next.every((s, idx) => idx === 0 ? s.startSec === 0 : s.startSec === next[idx - 1].endSec), "Gapless after insert");
});

test("insert section extends tail if insufficient time to steal", () => {
  const base: Section[] = [
    { id: "s1", name: "A", colorId: "slate_01", startSec: 0, endSec: 2, notes: "", tags: [] },
    { id: "s2", name: "B", colorId: "navy_01", startSec: 2, endSec: 2 + MIN_SECTION_SEC, notes: "", tags: [] },
  ];
  const next = insertSectionAtBoundary(base, 0, 5, "s-insert", "New", "forest_01");
  assertCondition(next[next.length - 1].endSec > base[base.length - 1].endSec, "Tail should extend to fit insert");
  assertCondition(next.every((s, idx) => idx === 0 ? s.startSec === 0 : s.startSec === next[idx - 1].endSec), "Gapless after tail extend");
});
