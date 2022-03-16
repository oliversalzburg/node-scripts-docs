import path from "path";
import { FragmentScanner } from "./FragmentScanner";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION } from "./FragmentStore";
import { ScriptScanner } from "./ScriptScanner";
import { StoreAugmenter } from "./StoreAugmenter";

it("augments a store with descriptions from fragments", async () => {
  const storeFragments = await FragmentScanner.loadFragments(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION)
  );

  const scannerScripts = new ScriptScanner("test/fixtures/default");
  await scannerScripts.loadManifests();
  const storeScripts = await scannerScripts.loadScripts();

  expect(storeScripts.scripts[0].description).toBeUndefined();
  const augmenter = new StoreAugmenter(storeScripts);
  augmenter.augment(storeFragments);
  expect(storeScripts.scripts[0].description).toStrictEqual("Build the TypeScript sources.");
});
