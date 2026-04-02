import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createBlankProject } from "../src/state/appState";
import { noSelection } from "../src/state/selection";
import { CurveTab } from "../src/ui/tabs/CurveTab";
import { SectionTab } from "../src/ui/tabs/SectionTab";
import { assertCondition, test } from "./testUtils";

const noopProjectChange = () => {};
const noopSelectionChange = () => {};

test("SectionTab renders a stable empty state for blank projects", () => {
  const markup = renderToStaticMarkup(
    createElement(SectionTab, {
      project: createBlankProject(),
      selection: noSelection,
      onSelectSection: noopSelectionChange,
      onProjectChange: noopProjectChange,
    })
  );

  assertCondition(markup.includes("No sections available."), "SectionTab should render an empty-state message");
});

test("CurveTab renders a stable empty state for blank projects", () => {
  const markup = renderToStaticMarkup(
    createElement(CurveTab, {
      project: createBlankProject(),
      selection: noSelection,
      onSelectionChange: noopSelectionChange,
      onProjectChange: noopProjectChange,
    })
  );

  assertCondition(markup.includes("No curve points."), "CurveTab should render an empty-state message");
});
