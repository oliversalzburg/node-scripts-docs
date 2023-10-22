import { FragmentRenderer } from "./FragmentRenderer.js";
import { FragmentStore } from "./FragmentStore.js";
import { ScriptStore } from "./ScriptStore.js";

export class StoreAugmenter {
  scriptStore: ScriptStore;

  constructor(scriptStore: ScriptStore) {
    this.scriptStore = scriptStore;
  }

  async augment(fragmentStore: FragmentStore) {
    for (const scriptMeta of this.scriptStore.scripts) {
      const description = fragmentStore.getExistingDescription(scriptMeta.scriptName);
      if (description && !FragmentRenderer.isDefaultDescription(description)) {
        scriptMeta.description = description;
      }
    }
  }
}
