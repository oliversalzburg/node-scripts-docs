import path from "node:path";
import { type TestContext, test } from "node:test";
import { DOCUMENTATION_PENDING_DEFAULT } from "./FragmentRenderer.js";
import {
	DOCS_FRAGMENTS_DEFAULT_LOCATION,
	FragmentStore,
} from "./FragmentStore.js";
import { ScriptStore } from "./ScriptStore.js";
import { StoreAugmenter } from "./StoreAugmenter.js";
import { Validator } from "./Validator.js";

test("detects changed fragment", (t: TestContext) => {
	const storeFragments = new FragmentStore(
		path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
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
		description: "previous description",
		isGlobal: false,
		isRootManifest: true,
		manifestPath: "package.json",
		projectName: "default",
		scriptCode: "tsc",
		scriptName: "build",
	});

	const validator = new Validator(
		storeScriptsCached,
		storeScripts,
		storeFragments,
	);
	const report = validator.generateReport(true);
	t.assert.strictEqual(report.changedFragments.size, 1);
	t.assert.strictEqual(report.corruptedMetadataRecords.size, 0);
	t.assert.strictEqual(report.missingFragments.size, 0);
	t.assert.strictEqual(report.newScripts.size, 0);
	t.assert.strictEqual(report.obsoleteFragments.size, 0);
	t.assert.strictEqual(report.pendingDocumentation.size, 0);
	t.assert.strictEqual(report.unchangedFragments.size, 0);

	t.assert.strictEqual(
		report.changedFragments.has(storeScripts.scripts[0]),
		true,
	);
});

test("detects new script", (t: TestContext) => {
	const storeFragments = new FragmentStore(
		path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
	);

	const storeScripts = new ScriptStore("test/fixtures/default");
	storeScripts.add("package.json", "default", "build", "tsc", false);

	const augmenter = new StoreAugmenter(storeScripts);
	augmenter.augment(storeFragments);

	const storeScriptsCached = new ScriptStore("test/fixtures/default");

	const validator = new Validator(
		storeScriptsCached,
		storeScripts,
		storeFragments,
	);
	const report = validator.generateReport(true);
	t.assert.strictEqual(report.changedFragments.size, 0);
	t.assert.strictEqual(report.corruptedMetadataRecords.size, 0);
	t.assert.strictEqual(report.missingFragments.size, 0);
	t.assert.strictEqual(report.newScripts.size, 1);
	t.assert.strictEqual(report.obsoleteFragments.size, 0);
	t.assert.strictEqual(report.pendingDocumentation.size, 0);
	t.assert.strictEqual(report.unchangedFragments.size, 0);

	t.assert.strictEqual(report.newScripts.has(storeScripts.scripts[0]), true);
});

test("detects missing fragment", (t: TestContext) => {
	const storeFragments = new FragmentStore(
		path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
	);

	const storeScripts = new ScriptStore("test/fixtures/default");
	storeScripts.add("package.json", "default", "build", "tsc", false);

	const augmenter = new StoreAugmenter(storeScripts);
	augmenter.augment(storeFragments);

	const storeScriptsCached = new ScriptStore("test/fixtures/default");
	storeScriptsCached.scripts.push({
		isGlobal: false,
		isRootManifest: true,
		manifestPath: "package.json",
		projectName: "default",
		scriptCode: "tsc",
		scriptName: "build",
	});

	const validator = new Validator(
		storeScriptsCached,
		storeScripts,
		storeFragments,
	);
	const report = validator.generateReport(true);
	t.assert.strictEqual(report.changedFragments.size, 0);
	t.assert.strictEqual(report.corruptedMetadataRecords.size, 0);
	t.assert.strictEqual(report.missingFragments.size, 1);
	t.assert.strictEqual(report.newScripts.size, 0);
	t.assert.strictEqual(report.obsoleteFragments.size, 0);
	t.assert.strictEqual(report.pendingDocumentation.size, 0);
	t.assert.strictEqual(report.unchangedFragments.size, 0);

	t.assert.strictEqual(
		report.missingFragments.has(storeScripts.scripts[0]),
		true,
	);
});

test("detects unchanged+pending fragment", (t: TestContext) => {
	const storeFragments = new FragmentStore(
		path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
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
		description: DOCUMENTATION_PENDING_DEFAULT,
		isGlobal: false,
		isRootManifest: true,
		manifestPath: "package.json",
		projectName: "default",
		scriptCode: "tsc",
		scriptName: "build",
	});

	const validator = new Validator(
		storeScriptsCached,
		storeScripts,
		storeFragments,
	);
	const report = validator.generateReport(true);
	t.assert.strictEqual(report.changedFragments.size, 0);
	t.assert.strictEqual(report.corruptedMetadataRecords.size, 0);
	t.assert.strictEqual(report.missingFragments.size, 0);
	t.assert.strictEqual(report.newScripts.size, 0);
	t.assert.strictEqual(report.obsoleteFragments.size, 0);
	t.assert.strictEqual(report.pendingDocumentation.size, 1);
	t.assert.strictEqual(report.unchangedFragments.size, 1);

	t.assert.strictEqual(
		report.pendingDocumentation.has(storeScripts.scripts[0]),
		true,
	);
	t.assert.strictEqual(
		report.unchangedFragments.has(storeScripts.scripts[0]),
		true,
	);
});

test("detects corrupted metadata", (t: TestContext) => {
	const storeFragments = new FragmentStore(
		path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
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
		isRootManifest: true,
		manifestPath: "package.json",
		projectName: "default",
		scriptCode: "tsc",
		scriptName: "build",
	});

	const validator = new Validator(
		storeScriptsCached,
		storeScripts,
		storeFragments,
	);
	const report = validator.generateReport(true);
	t.assert.strictEqual(report.changedFragments.size, 0);
	t.assert.strictEqual(report.corruptedMetadataRecords.size, 1);
	t.assert.strictEqual(report.missingFragments.size, 0);
	t.assert.strictEqual(report.newScripts.size, 0);
	t.assert.strictEqual(report.obsoleteFragments.size, 0);
	t.assert.strictEqual(report.pendingDocumentation.size, 0);
	t.assert.strictEqual(report.unchangedFragments.size, 0);

	t.assert.strictEqual(
		report.corruptedMetadataRecords.has(storeScripts.scripts[0]),
		true,
	);
});

test("detects obsolete fragment", (t: TestContext) => {
	const storeFragments = new FragmentStore(
		path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
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
		isRootManifest: true,
		manifestPath: "package.json",
		projectName: "default",
		scriptCode: "tsc",
		scriptName: "build",
	});

	const validator = new Validator(
		storeScriptsCached,
		storeScripts,
		storeFragments,
	);
	const report = validator.generateReport(true);
	t.assert.strictEqual(report.changedFragments.size, 0);
	t.assert.strictEqual(report.corruptedMetadataRecords.size, 0);
	t.assert.strictEqual(report.missingFragments.size, 0);
	t.assert.strictEqual(report.newScripts.size, 0);
	t.assert.strictEqual(report.obsoleteFragments.size, 1);
	t.assert.strictEqual(report.pendingDocumentation.size, 0);
	t.assert.strictEqual(report.unchangedFragments.size, 0);

	t.assert.strictEqual(report.obsoleteFragments.has(fragment), true);
});

test("detects obsolete fragment", (t: TestContext) => {
	const storeFragments = new FragmentStore(
		path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
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
		description: "Excellent documentation",
		isGlobal: false,
		isRootManifest: true,
		manifestPath: "package.json",
		projectName: "default",
		scriptCode: "tsc",
		scriptName: "build",
	});

	const validator = new Validator(
		storeScriptsCached,
		storeScripts,
		storeFragments,
	);
	const report = validator.generateReport(true);
	t.assert.strictEqual(report.changedFragments.size, 0);
	t.assert.strictEqual(report.corruptedMetadataRecords.size, 0);
	t.assert.strictEqual(report.missingFragments.size, 0);
	t.assert.strictEqual(report.newScripts.size, 0);
	t.assert.strictEqual(report.obsoleteFragments.size, 0);
	t.assert.strictEqual(report.pendingDocumentation.size, 0);
	t.assert.strictEqual(report.unchangedFragments.size, 1);

	t.assert.strictEqual(
		report.unchangedFragments.has(storeScripts.scripts[0]),
		true,
	);
});
