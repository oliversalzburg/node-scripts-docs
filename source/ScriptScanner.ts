import { globby } from "globby";
import fs from "node:fs/promises";
import path, { join } from "node:path";
import { ScriptStore } from "./ScriptStore.js";

/**
 * The important parts of a project's manifest.
 */
export interface Manifest {
  /**
   * The name of the project.
   */
  name: string;

  /**
   * The version of the project.
   */
  version?: string | undefined;

  /**
   * The scripts that exist in the manifest.
   */
  scripts?: Record<string, string> | undefined;
}

/**
 * Searches for scripts in a project.
 */
export class ScriptScanner {
  private rootDirectory: string;
  private workspaces: Array<string>;

  /**
   * Manifests we found in the project.
   */
  public manifests = new Array<string>();

  /**
   * Constructs a new script scanner.
   * @param rootDirectory - The root directory to search for manifests.
   * @param workspaces - The location where workspaces are stored in the monorepo.
   */
  constructor(rootDirectory: string, workspaces = ["packages/*"]) {
    this.rootDirectory = rootDirectory;
    this.workspaces = workspaces;
  }

  /**
   * Find manifests in the target project.
   * @param includeRootManifest - Should the manifest of the project root be included?
   * @returns The found manifests.
   */
  async findManifests(includeRootManifest = true) {
    const manifests = new Array<string>();
    for (const workspacePath of this.workspaces) {
      const workspaceManifests = await globby(join(workspacePath, "package.json"), {
        cwd: this.rootDirectory,
      });
      manifests.push(...workspaceManifests);
    }

    if (includeRootManifest) {
      manifests.push("package.json");
    }

    return manifests;
  }

  /**
   * Find manifests and load them into the scanner instance.
   */
  async loadManifests() {
    this.manifests = await this.findManifests();
  }

  /**
   * Find all scripts in all manifests and put them into a script store.
   * @returns An instance of a script store.
   */
  async loadScripts() {
    const scriptStore = new ScriptStore(this.rootDirectory);
    for (const manifestPath of this.manifests) {
      const isRootManifest = manifestPath === "package.json";
      const manifest = await ScriptScanner.loadManifest(
        path.resolve(this.rootDirectory, manifestPath),
      );
      const projectName = manifest.name;
      const projectScripts: Record<string, string> = manifest.scripts ?? {};

      for (const [name, script] of Object.entries(projectScripts)) {
        const isGlobal = name.includes(":");
        scriptStore.add(manifestPath, projectName, name, script, isGlobal, isRootManifest);
      }
    }

    return scriptStore;
  }

  /**
   * Loads the target manifest.
   * @param manifestPath - The path of the manifest.
   * @returns The loaded manifest.
   */
  static async loadManifest(manifestPath: string) {
    const manifestContent = await fs.readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(manifestContent) as Manifest;
    return manifest;
  }

  /**
   * Check if the target location can be loaded.
   * @param manifestPath - The location to check.
   * @returns `true` if the manifest exists; `false` otherwise.
   */
  static async canLoad(manifestPath: string) {
    try {
      await fs.stat(manifestPath);
    } catch {
      return false;
    }

    return true;
  }
}
