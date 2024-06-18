import { globby } from "globby";
import { FragmentStore } from "./FragmentStore.js";

/**
 * Loads any fragments from the given directory and places them into a fragment store.
 * @param fragmentDirectory - The directory from which to load fragments.
 * @returns A fragment store.
 */
export const loadFragments = async (fragmentDirectory: string) => {
  const fragmentStore = new FragmentStore(fragmentDirectory);
  const fragments = await globby(FragmentStore.scriptToFragmentFilename("*"), {
    cwd: fragmentDirectory,
  });
  for (const fragment of fragments) {
    await fragmentStore.loadFragment(fragment);
  }

  return fragmentStore;
};
