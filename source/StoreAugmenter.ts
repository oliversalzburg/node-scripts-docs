import { FragmentRenderer } from "./FragmentRenderer";
import { FragmentStore } from "./FragmentStore";
import { ScriptStore } from "./ScriptStore";

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
