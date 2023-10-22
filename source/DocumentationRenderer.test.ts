import path from "node:path";
import { DocumentationRenderer } from "./DocumentationRenderer.js";
import { FragmentScanner } from "./FragmentScanner.js";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION } from "./FragmentStore.js";
import { ScriptScanner } from "./ScriptScanner.js";
import { StoreAugmenter } from "./StoreAugmenter.js";

it("renders a script store as expected", async () => {
  const storeFragments = await FragmentScanner.loadFragments(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
  );

  const scannerScripts = new ScriptScanner("test/fixtures/default");
  await scannerScripts.loadManifests();
  const storeScripts = await scannerScripts.loadScripts();

  const augmenter = new StoreAugmenter(storeScripts);
  augmenter.augment(storeFragments);

  const renderer = new DocumentationRenderer(storeScripts);
  expect(renderer.render()).toMatchSnapshot();
  expect(renderer.render(true)).toMatchSnapshot();
});
