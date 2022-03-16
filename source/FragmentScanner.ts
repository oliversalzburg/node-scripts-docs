import globby from "globby";
import { FragmentStore } from "./FragmentStore";

export class FragmentScanner {
  private fragmentDirectory: string;

  public fragments = new Array<string>();

  constructor(fragmentDirectory: string) {
    this.fragmentDirectory = fragmentDirectory;
  }

  async loadFragments() {
    const fragmentStore = new FragmentStore(this.fragmentDirectory);
    const fragments = await globby(FragmentStore.scriptToFragmentFilename("*"), {
      cwd: this.fragmentDirectory,
    });
    for (const fragment of fragments) {
      await fragmentStore.loadFragment(fragment);
    }

    return fragmentStore;
  }
}
