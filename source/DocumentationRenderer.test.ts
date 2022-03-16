import path from "path";
import { DocumentationRenderer } from "./DocumentationRenderer";
import { FragmentScanner } from "./FragmentScanner";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION } from "./FragmentStore";
import { ScriptScanner } from "./ScriptScanner";
import { StoreAugmenter } from "./StoreAugmenter";

it("renders a script store as expected", async () => {
  const storeFragments = await FragmentScanner.loadFragments(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION)
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
