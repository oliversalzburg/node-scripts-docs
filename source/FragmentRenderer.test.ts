import path from "node:path";
import { snapshot, type TestContext, test } from "node:test";
import { isDefaultDescription, makeDocumentation } from "./FragmentRenderer.js";
import type { ScriptStoreEntry } from "./ScriptStore.js";

snapshot.setResolveSnapshotPath((filename) =>
	filename !== undefined
		? `${filename.replace(`${path.sep}output${path.sep}`, `${path.sep}source${path.sep}`)}.snapshot`
		: "",
);

test("identifies pending description", (t: TestContext) => {
	t.assert.strictEqual(isDefaultDescription("_documentation pending_"), true);
	t.assert.strictEqual(isDefaultDescription("Some description"), false);
});

test("renders fragment with existing description", (t: TestContext) => {
	const meta: ScriptStoreEntry = {
		description:
			"Build the latest sources and then use the build output to execute your command. Parameters are passed through by `npm exec`.",
		isGlobal: true,
		isRootManifest: true,
		manifestPath: "package.json",
		projectName: "node-scripts-docs",
		scriptCode: "npm exec -- nsd-debug --include-locals",
		scriptName: "docs:scripts",
	};
	const fragment = makeDocumentation(meta, meta.description);
	t.assert.snapshot(fragment);
});

test("renders fragment without description", (t: TestContext) => {
	const meta: ScriptStoreEntry = {
		isGlobal: true,
		isRootManifest: true,
		manifestPath: "package.json",
		projectName: "node-scripts-docs",
		scriptCode: "npm exec -- nsd-debug --include-locals",
		scriptName: "docs:scripts",
	};
	const fragment = makeDocumentation(meta, meta.description);
	t.assert.snapshot(fragment);
});
