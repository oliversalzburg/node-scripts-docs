import { FragmentStore } from "./FragmentStore";

it("converts script name to filename as expected", () => {
  expect(FragmentStore.scriptToFragmentFilename("test:coverage")).toStrictEqual(
    ".test$$coverage.md"
  );
});

it("converts filename to script name as expected", () => {
  expect(FragmentStore.fragmentFilenameToScript(".test$$coverage.md")).toStrictEqual(
    "test:coverage"
  );
});

it("returns null for invalid fragment file name conversion", () => {
  expect(FragmentStore.fragmentFilenameToScript("index.md")).toBeNull();
});

it("refuses to load invalid fragment name", async () => {
  const store = new FragmentStore("test/fixtures/default/docs");
  await expect(() => store.loadFragment("invalid-fragment.md")).rejects.toThrow(
    "Unable to interpret fragment file name 'invalid-fragment.md'!"
  );
});

it("refuses to load invalid fragment", async () => {
  const store = new FragmentStore("test/fixtures/default/docs");
  await expect(() => store.loadFragment(".invalid-description.md")).rejects.toThrow(
    "Unable to find description item in documentation fragment at '.invalid-description.md'!"
  );
});

it("reliably detects existence", async () => {
  expect(await FragmentStore.exists("test/fixtures/default")).toBe(true);
  expect(await FragmentStore.exists("invalid")).toBe(false);
});
