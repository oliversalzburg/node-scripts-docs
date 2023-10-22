import { globby } from "globby";
import fs from "node:fs/promises";
import path from "node:path";
import { ScriptStore } from "./ScriptStore.js";

export type Manifest = {
  name: string;
  version: string;
  scripts: Record<string, string>;
};

export class ScriptScanner {
  private rootDirectory: string;
  private workspaces: Array<string>;

  public manifests = new Array<string>();

  constructor(rootDirectory: string, workspaces = ["packages/*"]) {
    this.rootDirectory = rootDirectory;
    this.workspaces = workspaces;
  }

  async findManifests(includeRootManifest = true) {
    const manifests = new Array<string>();
    for (const workspacePath of this.workspaces) {
      let workspaceManifests = await globby(`${workspacePath}/package.json`, {
        cwd: this.rootDirectory,
      });
      manifests.push(...workspaceManifests);
    }

    if (includeRootManifest) {
      manifests.push("package.json");
    }

    return manifests;
  }

  async loadManifests() {
    this.manifests = await this.findManifests();
  }

  async loadScripts() {
    const scriptStore = new ScriptStore(this.rootDirectory);
    for (const manifestPath of this.manifests) {
      const isRootManifest = manifestPath === "package.json";
      const manifest = await ScriptScanner.loadManifest(
        path.resolve(this.rootDirectory, manifestPath),
      );
      const projectName = manifest.name;
      const projectScripts: Record<string, string> = manifest.scripts || {};

      for (const [name, script] of Object.entries(projectScripts)) {
        const isGlobal = name.includes(":");
        scriptStore.add(manifestPath, projectName, name, script, isGlobal, isRootManifest);
      }
    }

    return scriptStore;
  }

  static async loadManifest(manifestPath: string) {
    const manifestContent = await fs.readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(manifestContent) as Manifest;
    return manifest;
  }

  static async canLoad(manifestPath: string) {
    try {
      await fs.stat(manifestPath);
    } catch {
      return false;
    }

    return true;
  }
}
