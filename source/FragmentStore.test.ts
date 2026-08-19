import { type TestContext, test } from "node:test";
import { FragmentStore } from "./FragmentStore.js";

test("converts script name to filename as expected", (t: TestContext) => {
	t.assert.strictEqual(
		FragmentStore.scriptToFragmentFilename("test:coverage"),
		".test$$coverage.md",
	);
});

test("converts filename to script name as expected", (t: TestContext) => {
	t.assert.strictEqual(
		FragmentStore.fragmentFilenameToScript(".test$$coverage.md"),
		"test:coverage",
	);
});

test("returns null for invalid fragment file name conversion", (t: TestContext) => {
	t.assert.strictEqual(
		FragmentStore.fragmentFilenameToScript("index.md"),
		null,
	);
});

test("refuses to load invalid fragment name", async (t: TestContext) => {
	const store = new FragmentStore("test/fixtures/default/docs");
	await t.assert.rejects(() => store.loadFragment("invalid-fragment.md"));
});

test("refuses to load invalid fragment", async (t: TestContext) => {
	const store = new FragmentStore("test/fixtures/default/docs");

	await t.assert.rejects(() => store.loadFragment(".invalid-description.md"));
});

test("reliably detects existence", async (t: TestContext) => {
	t.assert.strictEqual(
		await FragmentStore.exists("test/fixtures/default"),
		true,
	);
	t.assert.strictEqual(await FragmentStore.exists("invalid"), false);
});
