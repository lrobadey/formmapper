"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rippleResizeSections = exports.insertSectionAtBoundary = void 0;
const repair_1 = require("../model/repair");
const cloneSections = (sections) => sections.map((s) => ({ ...s }));
const insertSectionAtBoundary = (sections, boundaryIndex, durationSec, id, name, colorId) => {
    if (boundaryIndex < 0 || boundaryIndex >= sections.length)
        return sections;
    const base = cloneSections(sections);
    let insertDuration = Math.max(durationSec, repair_1.MIN_SECTION_SEC);
    const durations = base.map((s) => s.endSec - s.startSec);
    let remaining = insertDuration;
    for (let i = boundaryIndex + 1; i < durations.length; i++) {
        const available = Math.max(durations[i] - repair_1.MIN_SECTION_SEC, 0);
        const steal = Math.min(available, remaining);
        durations[i] -= steal;
        remaining -= steal;
        if (remaining <= 0)
            break;
    }
    if (remaining > 0) {
        if (durations.length > boundaryIndex + 1) {
            durations[durations.length - 1] += remaining; // extend tail if not enough to steal
        }
        else {
            insertDuration += remaining; // extend new section if inserting at end
        }
        remaining = 0;
    }
    const newSection = {
        id,
        name,
        colorId,
        startSec: 0,
        endSec: insertDuration,
        notes: "",
        tags: [],
    };
    const durationsWithInsert = [
        ...durations.slice(0, boundaryIndex + 1),
        insertDuration,
        ...durations.slice(boundaryIndex + 1),
    ];
    const reordered = [...base.slice(0, boundaryIndex + 1), newSection, ...base.slice(boundaryIndex + 1)];
    const finalWithDurations = reordered.map((s, idx) => ({
        ...s,
        startSec: 0,
        endSec: durationsWithInsert[idx] ?? insertDuration,
    }));
    return enforceGapless(finalWithDurations);
};
exports.insertSectionAtBoundary = insertSectionAtBoundary;
const rippleResizeSections = (sections, targetId, newEndSec) => {
    const base = cloneSections(sections);
    const idx = base.findIndex((s) => s.id === targetId);
    if (idx === -1)
        return base;
    const target = base[idx];
    const clampedEnd = Math.max(newEndSec, target.startSec + repair_1.MIN_SECTION_SEC);
    const delta = clampedEnd - target.endSec;
    target.endSec = clampedEnd;
    for (let i = idx + 1; i < base.length; i++) {
        base[i].startSec += delta;
        base[i].endSec += delta;
    }
    if (base[idx + 1]) {
        base[idx + 1].startSec = target.endSec;
    }
    return enforceGapless(base);
};
exports.rippleResizeSections = rippleResizeSections;
const enforceGapless = (sections) => {
    let cursor = 0;
    return sections.map((s, i) => {
        const duration = Math.max(s.endSec - s.startSec, repair_1.MIN_SECTION_SEC);
        const startSec = i === 0 ? 0 : cursor;
        const endSec = startSec + duration;
        cursor = endSec;
        return { ...s, startSec, endSec };
    });
};
