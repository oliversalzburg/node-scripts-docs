import path from "path";
import { loadFragments } from "./FragmentScanner.js";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION } from "./FragmentStore.js";
import { ScriptScanner } from "./ScriptScanner.js";
import { StoreAugmenter } from "./StoreAugmenter.js";

it("augments a store with descriptions from fragments", async () => {
  const storeFragments = await loadFragments(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
  );

  const scannerScripts = new ScriptScanner("test/fixtures/default");
  await scannerScripts.loadManifests();
  const storeScripts = await scannerScripts.loadScripts();

  expect(storeScripts.scripts[0].description).toBeUndefined();
  const augmenter = new StoreAugmenter(storeScripts);
  augmenter.augment(storeFragments);
  expect(storeScripts.scripts[0].description).toStrictEqual("Build the TypeScript sources.");
});
