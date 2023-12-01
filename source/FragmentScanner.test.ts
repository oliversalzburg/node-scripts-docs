import path from "node:path";
import { loadFragments } from "./FragmentScanner.js";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION } from "./FragmentStore.js";

it("loads existing fragments as expected", async () => {
  const fragmentStore = await loadFragments(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
  );
  expect(fragmentStore.fragments).toMatchSnapshot();
});
