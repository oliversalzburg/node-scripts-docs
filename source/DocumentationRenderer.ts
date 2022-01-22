import fs from "fs/promises";
import path from "path";
import { FragmentRenderer } from "./FragmentRenderer";
import { FragmentStore } from "./FragmentStore";
import { ScriptStore } from "./ScriptStore";

export class DocumentationRenderer {
  private metadata: ScriptStore;

  constructor(metadata: ScriptStore) {
    this.metadata = metadata;
  }

  render(includeLocalScripts = false) {
    let fullDocument = "# Full reference\n\n";
    for (const scriptMeta of this.metadata.scripts) {
      if (!scriptMeta.isGlobal && !includeLocalScripts) {
        continue;
      }

      const scriptDocs = FragmentRenderer.makeDocumentation(scriptMeta, scriptMeta.description);
      fullDocument += scriptDocs + "\n";
    }
    return fullDocument;
  }

  async renderFragments(rootDirectory: string, includeLocalScripts = false) {
    for (const scriptMeta of this.metadata.scripts) {
      if (!scriptMeta.isGlobal && !includeLocalScripts) {
        continue;
      }

      //const description = fragmentStore.getExistingDescription(scriptMeta.scriptName);

      const scriptDocs = FragmentRenderer.makeDocumentation(scriptMeta, scriptMeta.description);
      const fragmentFilename = FragmentStore.scriptToFragmentFilename(scriptMeta.scriptName);
      const fragmentPath = path.resolve(rootDirectory, fragmentFilename);
      await fs.writeFile(fragmentPath, scriptDocs);
    }
  }

  asFragmentStore(rootDirectory: string, includeLocalScripts = false) {
    const fragmentStore = new FragmentStore(rootDirectory);
    for (const scriptMeta of this.metadata.scripts) {
      if (!scriptMeta.isGlobal && !includeLocalScripts) {
        continue;
      }

      fragmentStore.addScript(scriptMeta.scriptName, scriptMeta.description);
    }
    return fragmentStore;
  }
}
