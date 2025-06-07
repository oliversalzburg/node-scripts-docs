import { isDefaultDescription, makeDocumentation } from "./FragmentRenderer.js";
import { ScriptStoreEntry } from "./ScriptStore.js";

it("identifies pending description", () => {
  expect(isDefaultDescription("_documentation pending_")).toBe(true);
  expect(isDefaultDescription("Some description")).toBe(false);
});

it("renders fragment with existing description", () => {
  const meta: ScriptStoreEntry = {
    description:
      "Build the latest sources and then use the build output to execute your command. Parameters are passed through by `npm exec`.",
    manifestPath: "package.json",
    projectName: "node-scripts-docs",
    scriptName: "docs:scripts",
    scriptCode: "npm exec -- nsd-debug --include-locals",
    isGlobal: true,
    isRootManifest: true,
  };
  const fragment = makeDocumentation(meta, meta.description);
  expect(fragment).toMatchSnapshot();
});

it("renders fragment without description", () => {
  const meta: ScriptStoreEntry = {
    manifestPath: "package.json",
    projectName: "node-scripts-docs",
    scriptName: "docs:scripts",
    scriptCode: "npm exec -- nsd-debug --include-locals",
    isGlobal: true,
    isRootManifest: true,
  };
  const fragment = makeDocumentation(meta, meta.description);
  expect(fragment).toMatchSnapshot();
});
