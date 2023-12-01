import { isDefaultDescription } from "./FragmentRenderer.js";
import { FragmentStore } from "./FragmentStore.js";
import { ScriptStore } from "./ScriptStore.js";

export class StoreAugmenter {
  scriptStore: ScriptStore;

  constructor(scriptStore: ScriptStore) {
    this.scriptStore = scriptStore;
  }

  augment(fragmentStore: FragmentStore) {
    for (const scriptMeta of this.scriptStore.scripts) {
      const description = fragmentStore.getExistingDescription(scriptMeta.scriptName);
      if (description && !isDefaultDescription(description)) {
        scriptMeta.description = description;
      }
    }
  }
}
