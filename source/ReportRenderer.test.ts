import { snapshot, type TestContext, test } from "node:test";
import { render } from "./ReportRenderer.js";

snapshot.setResolveSnapshotPath((filename) =>
	filename !== undefined
		? `${filename.replace("/output/", "/source/")}.snapshot`
		: "",
);

test("renders empty report as expected", (t: TestContext) => {
	const report = {
		changedFragments: new Set([]),
		corruptedMetadataRecords: new Set([]),
		missingFragments: new Set([]),
		newScripts: new Set([]),
		obsoleteFragments: new Set([]),
		pendingDocumentation: new Set([]),
		unchangedFragments: new Set([]),
	};

	t.assert.snapshot(render(report, false));
	t.assert.snapshot(render(report));
});

test("renders report as expected", (t: TestContext) => {
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

	t.assert.snapshot(render(report, false));
	t.assert.snapshot(render(report));
});
