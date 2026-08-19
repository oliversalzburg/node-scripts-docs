import path from "node:path";
import { snapshot, type TestContext, test } from "node:test";
import { loadFragments } from "./FragmentScanner.js";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION } from "./FragmentStore.js";

snapshot.setResolveSnapshotPath((filename) =>
	filename !== undefined
		? `${filename.replace("/output/", "/source/")}.snapshot`
		: "",
);

test("loads existing fragments as expected", async (t: TestContext) => {
	const fragmentStore = await loadFragments(
		path.join("test/fixtures/default", DOCS_FRAGMENTS_DEFAULT_LOCATION),
	);
	t.assert.snapshot(fragmentStore.fragments);
});
