import { render } from "./ReportRenderer.js";

it("renders empty report as expected", () => {
  const report = {
    changedFragments: new Set([]),
    corruptedMetadataRecords: new Set([]),
    missingFragments: new Set([]),
    newScripts: new Set([]),
    obsoleteFragments: new Set([]),
    pendingDocumentation: new Set([]),
    unchangedFragments: new Set([]),
  };

  expect(render(report, false)).toMatchSnapshot();
  expect(render(report)).toMatchSnapshot();
});

it("renders report as expected", () => {
  const report = {
    changedFragments: new Set([
      {
        descriptiption: "something useful",
        isGlobal: false,
        isRootManifest: false,
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptCode: "echo nothing",
        scriptName: "changed",
      },
    ]),
    corruptedMetadataRecords: new Set([
      {
        descriptiption: "something useful",
        isGlobal: false,
        isRootManifest: false,
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptCode: "echo nothing",
        scriptName: "corrupted",
      },
    ]),
    missingFragments: new Set([
      {
        descriptiption: "something useful",
        isGlobal: false,
        isRootManifest: false,
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptCode: "echo nothing",
        scriptName: "missing",
      },
    ]),
    newScripts: new Set([
      {
        descriptiption: "something useful",
        isGlobal: false,
        isRootManifest: false,
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptCode: "echo nothing",
        scriptName: "new",
      },
    ]),
    obsoleteFragments: new Set([
      {
        descriptionMarkdown: "something useful",
        filename: ".obsolete.md",
      },
    ]),
    pendingDocumentation: new Set([
      {
        descriptiption: "something useful",
        isGlobal: false,
        isRootManifest: false,
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptCode: "echo nothing",
        scriptName: "pending",
      },
    ]),
    unchangedFragments: new Set([
      {
        descriptiption: "something useful",
        isGlobal: false,
        isRootManifest: false,
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptCode: "echo nothing",
        scriptName: "unchanged",
      },
    ]),
  };

  expect(render(report, false)).toMatchSnapshot();
  expect(render(report)).toMatchSnapshot();
});
