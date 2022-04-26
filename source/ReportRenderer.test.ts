import { ReportRenderer } from "./ReportRenderer";

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

  expect(ReportRenderer.render(report, false)).toMatchSnapshot();
  expect(ReportRenderer.render(report)).toMatchSnapshot();
});

it("renders report as expected", () => {
  const report = {
    changedFragments: new Set([
      {
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptName: "changed",
        scriptCode: "echo nothing",
        isGlobal: false,
        isRootManifest: false,
        descriptiption: "something useful",
      },
    ]),
    corruptedMetadataRecords: new Set([
      {
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptName: "corrupted",
        scriptCode: "echo nothing",
        isGlobal: false,
        isRootManifest: false,
        descriptiption: "something useful",
      },
    ]),
    missingFragments: new Set([
      {
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptName: "missing",
        scriptCode: "echo nothing",
        isGlobal: false,
        isRootManifest: false,
        descriptiption: "something useful",
      },
    ]),
    newScripts: new Set([
      {
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptName: "new",
        scriptCode: "echo nothing",
        isGlobal: false,
        isRootManifest: false,
        descriptiption: "something useful",
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
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptName: "pending",
        scriptCode: "echo nothing",
        isGlobal: false,
        isRootManifest: false,
        descriptiption: "something useful",
      },
    ]),
    unchangedFragments: new Set([
      {
        manifestPath: "test/fixtures/default/package.json",
        projectName: "default",
        scriptName: "unchanged",
        scriptCode: "echo nothing",
        isGlobal: false,
        isRootManifest: false,
        descriptiption: "something useful",
      },
    ]),
  };

  expect(ReportRenderer.render(report, false)).toMatchSnapshot();
  expect(ReportRenderer.render(report)).toMatchSnapshot();
});
