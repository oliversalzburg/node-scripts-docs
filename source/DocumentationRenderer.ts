import fs from "node:fs/promises";
import path from "node:path";
import { makeDocumentation } from "./FragmentRenderer.js";
import { FragmentStore } from "./FragmentStore.js";
import { ScriptStore } from "./ScriptStore.js";

/**
 * Renders an entire script store as a single Markdown document.
 */
export class DocumentationRenderer {
  private metadata: ScriptStore;

  /**
   * Constructs a new documentation renderer.
   * @param metadata - The script metadata to render.
   */
  constructor(metadata: ScriptStore) {
    this.metadata = metadata;
  }

  /**
   * Render the documentation.
   * @param includeLocalScripts - Should project-local scripts be rendered?
   * @returns The final Markdown document.
   */
  render(includeLocalScripts = false) {
    let fullDocument = "# Full reference\n\n";
    for (const scriptMeta of this.metadata.scripts) {
      if (!scriptMeta.isGlobal && !scriptMeta.isRootManifest && !includeLocalScripts) {
        continue;
      }

      const scriptDocs = makeDocumentation(scriptMeta, scriptMeta.description);
      fullDocument += scriptDocs + "\n";
    }
    return fullDocument;
  }

  /**
   * Write individual documentation fragments to disc.
   * @param rootDirectory - The directory to write the fragments to.
   * @param includeLocalScripts - Should project-local scripts be included?
   */
  async flushFragments(rootDirectory: string, includeLocalScripts = false) {
    await fs.mkdir(rootDirectory, { recursive: true });
    for (const scriptMeta of this.metadata.scripts) {
      if (!scriptMeta.isGlobal && !scriptMeta.isRootManifest && !includeLocalScripts) {
        continue;
      }

      //const description = fragmentStore.getExistingDescription(scriptMeta.scriptName);

      const scriptDocs = makeDocumentation(scriptMeta, scriptMeta.description);
      const fragmentFilename = FragmentStore.scriptToFragmentFilename(scriptMeta.scriptName);
      const fragmentPath = path.resolve(rootDirectory, fragmentFilename);
      await fs.writeFile(fragmentPath, scriptDocs);
    }
  }
}
