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
    isGlobal: true,
    isRootManifest: true,
    manifestPath: "package.json",
    projectName: "node-scripts-docs",
    scriptCode: "npm exec -- nsd-debug --include-locals",
    scriptName: "docs:scripts",
  };
  const fragment = makeDocumentation(meta, meta.description);
  expect(fragment).toMatchSnapshot();
});

it("renders fragment without description", () => {
  const meta: ScriptStoreEntry = {
    isGlobal: true,
    isRootManifest: true,
    manifestPath: "package.json",
    projectName: "node-scripts-docs",
    scriptCode: "npm exec -- nsd-debug --include-locals",
    scriptName: "docs:scripts",
  };
  const fragment = makeDocumentation(meta, meta.description);
  expect(fragment).toMatchSnapshot();
});
