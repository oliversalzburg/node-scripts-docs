import path from "node:path";
import { type TestContext, test } from "node:test";
import { loadFragments } from "./FragmentScanner.js";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION } from "./FragmentStore.js";
import { ScriptScanner } from "./ScriptScanner.js";
import { StoreAugmenter } from "./StoreAugmenter.js";

test("augments a store with descriptions from fragments", async (t: TestContext) => {
	const storeFragments = await loadFragments(
		path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
	);

	const scannerScripts = new ScriptScanner("test/fixtures/default");
	await scannerScripts.loadManifests();
	const storeScripts = await scannerScripts.loadScripts();

	t.assert.strictEqual(storeScripts.scripts[0].description, undefined);
	const augmenter = new StoreAugmenter(storeScripts);
	augmenter.augment(storeFragments);
	t.assert.strictEqual(
		storeScripts.scripts[0].description,
		"Build the TypeScript sources.",
	);
});
