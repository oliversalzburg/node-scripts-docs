import path from "path";
import { DOCUMENTATION_PENDING_DEFAULT } from "./FragmentRenderer";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION, FragmentStore } from "./FragmentStore";
import { ScriptStore } from "./ScriptStore";
import { StoreAugmenter } from "./StoreAugmenter";
import { Validator } from "./Validator";

it("detects changed fragment", async () => {
  const storeFragments = new FragmentStore(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION)
  );
  storeFragments.fragments.set("build", {
    descriptionMarkdown: "Build the TypeScript sources.",
    filename: ".build.md",
  });

  const storeScripts = new ScriptStore("test/fixtures/default");
  storeScripts.add("package.json", "default", "build", "tsc", false);

  const augmenter = new StoreAugmenter(storeScripts);
  augmenter.augment(storeFragments);

  const storeScriptsCached = new ScriptStore("test/fixtures/default");
  storeScriptsCached.scripts.push({
    isGlobal: false,
    manifestPath: "package.json",
    projectName: "default",
    scriptCode: "tsc",
    scriptName: "build",
    description: "previous description",
  });

  const validator = new Validator(storeScriptsCached, storeScripts, storeFragments);
  const report = validator.generateReport(true);
  expect(report.changedFragments.size).toStrictEqual(1);
  expect(report.corruptedMetadataRecords.size).toStrictEqual(0);
  expect(report.missingFragments.size).toStrictEqual(0);
  expect(report.newScripts.size).toStrictEqual(0);
  expect(report.obsoleteFragments.size).toStrictEqual(0);
  expect(report.pendingDocumentation.size).toStrictEqual(0);
  expect(report.unchangedFragments.size).toStrictEqual(0);

  expect(report.changedFragments.has(storeScripts.scripts[0])).toBe(true);
});

it("detects new script", async () => {
  const storeFragments = new FragmentStore(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION)
  );

  const storeScripts = new ScriptStore("test/fixtures/default");
  storeScripts.add("package.json", "default", "build", "tsc", false);

  const augmenter = new StoreAugmenter(storeScripts);
  augmenter.augment(storeFragments);

  const storeScriptsCached = new ScriptStore("test/fixtures/default");

  const validator = new Validator(storeScriptsCached, storeScripts, storeFragments);
  const report = validator.generateReport(true);
  expect(report.changedFragments.size).toStrictEqual(0);
  expect(report.corruptedMetadataRecords.size).toStrictEqual(0);
  expect(report.missingFragments.size).toStrictEqual(0);
  expect(report.newScripts.size).toStrictEqual(1);
  expect(report.obsoleteFragments.size).toStrictEqual(0);
  expect(report.pendingDocumentation.size).toStrictEqual(0);
  expect(report.unchangedFragments.size).toStrictEqual(0);

  expect(report.newScripts.has(storeScripts.scripts[0])).toBe(true);
});

it("detects missing fragment", async () => {
  const storeFragments = new FragmentStore(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION)
  );

  const storeScripts = new ScriptStore("test/fixtures/default");
  storeScripts.add("package.json", "default", "build", "tsc", false);

  const augmenter = new StoreAugmenter(storeScripts);
  augmenter.augment(storeFragments);

  const storeScriptsCached = new ScriptStore("test/fixtures/default");
  storeScriptsCached.scripts.push({
    isGlobal: false,
    manifestPath: "package.json",
    projectName: "default",
    scriptCode: "tsc",
    scriptName: "build",
  });

  const validator = new Validator(storeScriptsCached, storeScripts, storeFragments);
  const report = validator.generateReport(true);
  expect(report.changedFragments.size).toStrictEqual(0);
  expect(report.corruptedMetadataRecords.size).toStrictEqual(0);
  expect(report.missingFragments.size).toStrictEqual(1);
  expect(report.newScripts.size).toStrictEqual(0);
  expect(report.obsoleteFragments.size).toStrictEqual(0);
  expect(report.pendingDocumentation.size).toStrictEqual(0);
  expect(report.unchangedFragments.size).toStrictEqual(0);

  expect(report.missingFragments.has(storeScripts.scripts[0])).toBe(true);
});

it("detects unchanged+pending fragment", async () => {
  const storeFragments = new FragmentStore(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION)
  );
  storeFragments.fragments.set("build", {
    descriptionMarkdown: DOCUMENTATION_PENDING_DEFAULT,
    filename: ".build.md",
  });

  const storeScripts = new ScriptStore("test/fixtures/default");
  storeScripts.add("package.json", "default", "build", "tsc", false);

  const augmenter = new StoreAugmenter(storeScripts);
  augmenter.augment(storeFragments);

  const storeScriptsCached = new ScriptStore("test/fixtures/default");
  storeScriptsCached.scripts.push({
    isGlobal: false,
    manifestPath: "package.json",
    projectName: "default",
    scriptCode: "tsc",
    scriptName: "build",
    description: DOCUMENTATION_PENDING_DEFAULT,
  });

  const validator = new Validator(storeScriptsCached, storeScripts, storeFragments);
  const report = validator.generateReport(true);
  expect(report.changedFragments.size).toStrictEqual(0);
  expect(report.corruptedMetadataRecords.size).toStrictEqual(0);
  expect(report.missingFragments.size).toStrictEqual(0);
  expect(report.newScripts.size).toStrictEqual(0);
  expect(report.obsoleteFragments.size).toStrictEqual(0);
  expect(report.pendingDocumentation.size).toStrictEqual(1);
  expect(report.unchangedFragments.size).toStrictEqual(1);

  expect(report.pendingDocumentation.has(storeScripts.scripts[0])).toBe(true);
  expect(report.unchangedFragments.has(storeScripts.scripts[0])).toBe(true);
});

it("detects corrupted metadata", async () => {
  const storeFragments = new FragmentStore(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION)
  );
  storeFragments.fragments.set("build", {
    descriptionMarkdown: "Excellent documentation",
    filename: ".build.md",
  });

  const storeScripts = new ScriptStore("test/fixtures/default");
  storeScripts.add("package.json", "default", "build", "tsc", false);

  const augmenter = new StoreAugmenter(storeScripts);
  augmenter.augment(storeFragments);

  const storeScriptsCached = new ScriptStore("test/fixtures/default");
  storeScriptsCached.scripts.push({
    isGlobal: false,
    manifestPath: "package.json",
    projectName: "default",
    scriptCode: "tsc",
    scriptName: "build",
  });

  const validator = new Validator(storeScriptsCached, storeScripts, storeFragments);
  const report = validator.generateReport(true);
  expect(report.changedFragments.size).toStrictEqual(0);
  expect(report.corruptedMetadataRecords.size).toStrictEqual(1);
  expect(report.missingFragments.size).toStrictEqual(0);
  expect(report.newScripts.size).toStrictEqual(0);
  expect(report.obsoleteFragments.size).toStrictEqual(0);
  expect(report.pendingDocumentation.size).toStrictEqual(0);
  expect(report.unchangedFragments.size).toStrictEqual(0);

  expect(report.corruptedMetadataRecords.has(storeScripts.scripts[0])).toBe(true);
});

it("detects obsolete fragment", async () => {
  const storeFragments = new FragmentStore(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION)
  );
  const fragment = {
    descriptionMarkdown: "Excellent documentation",
    filename: ".build.md",
  };
  storeFragments.fragments.set("build", fragment);

  const storeScripts = new ScriptStore("test/fixtures/default");

  const augmenter = new StoreAugmenter(storeScripts);
  augmenter.augment(storeFragments);

  const storeScriptsCached = new ScriptStore("test/fixtures/default");
  storeScriptsCached.scripts.push({
    isGlobal: false,
    manifestPath: "package.json",
    projectName: "default",
    scriptCode: "tsc",
    scriptName: "build",
  });

  const validator = new Validator(storeScriptsCached, storeScripts, storeFragments);
  const report = validator.generateReport(true);
  expect(report.changedFragments.size).toStrictEqual(0);
  expect(report.corruptedMetadataRecords.size).toStrictEqual(0);
  expect(report.missingFragments.size).toStrictEqual(0);
  expect(report.newScripts.size).toStrictEqual(0);
  expect(report.obsoleteFragments.size).toStrictEqual(1);
  expect(report.pendingDocumentation.size).toStrictEqual(0);
  expect(report.unchangedFragments.size).toStrictEqual(0);

  expect(report.obsoleteFragments.has(fragment)).toBe(true);
});

it("detects obsolete fragment", async () => {
  const storeFragments = new FragmentStore(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION)
  );
  const fragment = {
    descriptionMarkdown: "Excellent documentation",
    filename: ".build.md",
  };
  storeFragments.fragments.set("build", fragment);

  const storeScripts = new ScriptStore("test/fixtures/default");
  storeScripts.add("package.json", "default", "build", "tsc", false);

  const augmenter = new StoreAugmenter(storeScripts);
  augmenter.augment(storeFragments);

  const storeScriptsCached = new ScriptStore("test/fixtures/default");
  storeScriptsCached.scripts.push({
    isGlobal: false,
    manifestPath: "package.json",
    projectName: "default",
    scriptCode: "tsc",
    scriptName: "build",
    description: "Excellent documentation",
  });

  const validator = new Validator(storeScriptsCached, storeScripts, storeFragments);
  const report = validator.generateReport(true);
  expect(report.changedFragments.size).toStrictEqual(0);
  expect(report.corruptedMetadataRecords.size).toStrictEqual(0);
  expect(report.missingFragments.size).toStrictEqual(0);
  expect(report.newScripts.size).toStrictEqual(0);
  expect(report.obsoleteFragments.size).toStrictEqual(0);
  expect(report.pendingDocumentation.size).toStrictEqual(0);
  expect(report.unchangedFragments.size).toStrictEqual(1);

  expect(report.unchangedFragments.has(storeScripts.scripts[0])).toBe(true);
});
