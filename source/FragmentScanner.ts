import globby from "globby";
import { FragmentStore } from "./FragmentStore";

export class FragmentScanner {
  static async loadFragments(fragmentDirectory: string) {
    const fragmentStore = new FragmentStore(fragmentDirectory);
    const fragments = await globby(FragmentStore.scriptToFragmentFilename("*"), {
      cwd: fragmentDirectory,
    });
    for (const fragment of fragments) {
      await fragmentStore.loadFragment(fragment);
    }

    return fragmentStore;
  }
}
