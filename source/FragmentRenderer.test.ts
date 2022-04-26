import { FragmentRenderer } from "./FragmentRenderer";
import { ScriptStoreEntry } from "./ScriptStore";

it("identifies pending description", () => {
  expect(FragmentRenderer.isDefaultDescription("_documentation pending_")).toBe(true);
  expect(FragmentRenderer.isDefaultDescription("Some description")).toBe(false);
});

it("renders fragment with existing description", () => {
  const meta: ScriptStoreEntry = {
    description:
      "Build the latest sources and then use the build output to execute your command. Parameters are passed through by `yarn`.",
    manifestPath: "package.json",
    projectName: "node-scripts-docs",
    scriptName: "docs:scripts",
    scriptCode: "yarn nsd-debug --include-locals",
    isGlobal: true,
    isRootManifest: true,
  };
  const fragment = FragmentRenderer.makeDocumentation(meta, meta.description);
  expect(fragment).toMatchSnapshot();
});

it("renders fragment without description", () => {
  const meta: ScriptStoreEntry = {
    manifestPath: "package.json",
    projectName: "node-scripts-docs",
    scriptName: "docs:scripts",
    scriptCode: "yarn nsd-debug --include-locals",
    isGlobal: true,
    isRootManifest: true,
  };
  const fragment = FragmentRenderer.makeDocumentation(meta, meta.description);
  expect(fragment).toMatchSnapshot();
});
