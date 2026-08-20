import path from "node:path";
import { snapshot, type TestContext, test } from "node:test";
import { ScriptScanner } from "./ScriptScanner.js";

snapshot.setResolveSnapshotPath((filename) =>
	filename !== undefined
		? `${filename.replace(`${path.sep}output${path.sep}`, `${path.sep}source${path.sep}`)}.snapshot`
		: "",
);

test("finds existing manifests (simple project)", async (t: TestContext) => {
	const scanner = new ScriptScanner("test/fixtures/default");
	const manifests = await scanner.findManifests();
	t.assert.deepStrictEqual(manifests, ["package.json"]);
});

test("finds existing manifests (monorepo)", async (t: TestContext) => {
	const scanner = new ScriptScanner("test/fixtures/monorepo");
	const manifests = await scanner.findManifests();
	t.assert.deepStrictEqual(manifests, [
		"packages/some-project/package.json",
		"package.json",
	]);
});

test("loads existing manifests (simple project)", async (t: TestContext) => {
	const scanner = new ScriptScanner("test/fixtures/default");
	await scanner.loadManifests();
	const store = await scanner.loadScripts();
	t.assert.snapshot(store.scripts);
});

test("loads existing manifests (monorepo)", async (t: TestContext) => {
	const scanner = new ScriptScanner("test/fixtures/monorepo");
	await scanner.loadManifests();
	const store = await scanner.loadScripts();
	t.assert.snapshot(store.scripts);
});

test("signals file can be loaded", async (t: TestContext) => {
	t.assert.strictEqual(
		await ScriptScanner.canLoad("test/fixtures/default/package.json"),
		true,
	);
	t.assert.strictEqual(await ScriptScanner.canLoad("invalid"), false);
});
