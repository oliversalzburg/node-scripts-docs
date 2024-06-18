import { isDefaultDescription } from "./FragmentRenderer.js";
import { FragmentStore } from "./FragmentStore.js";
import { ScriptStore } from "./ScriptStore.js";

/**
 * Augments a script store with descriptions from a fragment store.
 */
export class StoreAugmenter {
  /**
   * The script store we're operating on.
   */
  scriptStore: ScriptStore;

  /**
   * Constructs a new store augmenter.
   * @param scriptStore - The script store to augment.
   */
  constructor(scriptStore: ScriptStore) {
    this.scriptStore = scriptStore;
  }

  /**
   * Augment the script store with the given fragments.
   * @param fragmentStore - The fragment store to pull the descriptions from.
   */
  augment(fragmentStore: FragmentStore) {
    for (const scriptMeta of this.scriptStore.scripts) {
      const description = fragmentStore.getExistingDescription(scriptMeta.scriptName);
      if (description && !isDefaultDescription(description)) {
        scriptMeta.description = description;
      }
    }
  }
}
