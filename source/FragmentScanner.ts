import { globby } from "globby";
import { FragmentStore } from "./FragmentStore.js";

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
