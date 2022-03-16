import path from "path";
import { FragmentScanner } from "./FragmentScanner";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION } from "./FragmentStore";

it("loads existing fragments as expected", async () => {
  const scanner = new FragmentScanner(
    path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION)
  );
  await scanner.loadFragments();
  expect(scanner.fragments).toMatchSnapshot();
});
