import { ScriptScanner } from "./ScriptScanner";

it("finds existing manifests (simple project)", async () => {
  const scanner = new ScriptScanner("test/fixtures/default");
  const manifests = await scanner.findManifests();
  expect(manifests).toEqual(["package.json"]);
});

it("finds existing manifests (monorepo)", async () => {
  const scanner = new ScriptScanner("test/fixtures/monorepo");
  const manifests = await scanner.findManifests();
  expect(manifests).toEqual(
    expect.arrayContaining(["package.json", "packages/some-project/package.json"])
  );
});

it("loads existing manifests (simple project)", async () => {
  const scanner = new ScriptScanner("test/fixtures/default");
  await scanner.loadManifests();
  const store = await scanner.loadScripts();
  expect(store.scripts).toMatchSnapshot();
});

it("loads existing manifests (monorepo)", async () => {
  const scanner = new ScriptScanner("test/fixtures/monorepo");
  await scanner.loadManifests();
  const store = await scanner.loadScripts();
  expect(store.scripts).toMatchSnapshot();
});

it("signals file can be loaded", async () => {
  expect(await ScriptScanner.canLoad("test/fixtures/default/package.json")).toBe(true);
  expect(await ScriptScanner.canLoad("invalid")).toBe(false);
});
