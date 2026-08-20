import path from "node:path";
import { snapshot, type TestContext, test } from "node:test";
import { DocumentationRenderer } from "./DocumentationRenderer.js";
import { loadFragments } from "./FragmentScanner.js";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION } from "./FragmentStore.js";
import { ScriptScanner } from "./ScriptScanner.js";
import { StoreAugmenter } from "./StoreAugmenter.js";

snapshot.setResolveSnapshotPath((filename) =>
	filename !== undefined
		? `${filename.replace(`${path.sep}output${path.sep}`, `${path.sep}source${path.sep}`)}.snapshot`
		: "",
);

test("renders a script store as expected", async (t: TestContext) => {
	const storeFragments = await loadFragments(
		path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
	);

	const scannerScripts = new ScriptScanner("test/fixtures/default");
	await scannerScripts.loadManifests();
	const storeScripts = await scannerScripts.loadScripts();

	const augmenter = new StoreAugmenter(storeScripts);
	augmenter.augment(storeFragments);

	const renderer = new DocumentationRenderer(storeScripts);
	t.assert.snapshot(renderer.render());
	t.assert.snapshot(renderer.render(true));
});
