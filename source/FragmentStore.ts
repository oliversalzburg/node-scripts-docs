import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { InvalidOperationError } from "@oliversalzburg/js-utils/errors/InvalidOperationError.js";
import { Tokens, marked } from "marked";
import fs from "node:fs/promises";
import path from "node:path";
import { DOCUMENTATION_PENDING_DEFAULT } from "./FragmentRenderer.js";

export const DOCS_FRAGMENTS_DEFAULT_LOCATION = "docs/reference/Repository Scripts/";

/**
 * A documentation fragment contains the documentation for a single script.
 */
export class DocumentationFragment {
  /**
   * The description for the script in Markdown.
   */
  descriptionMarkdown: string;

  /**
   * The filename of the fragment.
   */
  filename: string;

  /**
   * Constructs a new documentation fragment.
   * @param filename - The filename of the fragment.
   * @param descriptionMarkdown - The description of the script.
   */
  constructor(filename: string, descriptionMarkdown = DOCUMENTATION_PENDING_DEFAULT) {
    this.filename = filename;
    this.descriptionMarkdown = descriptionMarkdown;
  }
}

/**
 * A store for documentation fragments.
 */
export class FragmentStore {
  private fragmentDirectory: string;

  /**
   * The fragments in the store.
   */
  public fragments = new Map<string, DocumentationFragment>();

  /**
   * Constructs a new fragment store.
   * @param fragmentDirectory - The directory where the fragments are located.
   */
  constructor(fragmentDirectory: string) {
    this.fragmentDirectory = fragmentDirectory;
  }

  /**
   * Loads the given fragment into the store.
   * @param fragmentFilename - The filename of the fragment to load.
   */
  async loadFragment(fragmentFilename: string) {
    const assumedScriptName = FragmentStore.fragmentFilenameToScript(fragmentFilename);
    if (!assumedScriptName) {
      throw new Error(`Unable to interpret fragment file name '${fragmentFilename}'!`);
    }

    const existingDocumentation = await fs.readFile(
      path.resolve(this.fragmentDirectory, fragmentFilename),
      "utf-8",
    );
    const parsed = marked.lexer(existingDocumentation);

    // Expect parsed to be an array of [heading, list]
    const items = (parsed[1] as Tokens.List | undefined)?.items;
    // Expect items to be [list_item, list_item, list_item]
    const descriptionItem = items?.find(
      item => 1 <= item.tokens.length && (item.tokens[0] as Tokens.Text).text === "Description:",
    );
    if (!descriptionItem) {
      throw new Error(
        `Unable to find description item in documentation fragment at '${fragmentFilename}'!`,
      );
    }

    const descriptionRaw = descriptionItem.tokens
      .slice(2)
      .map(token => token.raw)
      .join("");

    this.fragments.set(
      assumedScriptName,
      new DocumentationFragment(fragmentFilename, descriptionRaw),
    );
  }

  /**
   * Retrieves the current description of a script.
   * @param scriptName - The name of the script.
   * @returns The current description of the script, if one exists.
   */
  getExistingDescription(scriptName: string) {
    if (!this.fragments.has(scriptName)) {
      return undefined;
    }

    const fragment = this.fragments.get(scriptName);
    if (isNil(fragment)) {
      throw new InvalidOperationError(`There is no fragment for '${scriptName}'.`);
    }

    return fragment.descriptionMarkdown;
  }

  /**
   * Generate the filename for a fragment.
   * @param scriptName - The name of the script.
   * @returns The filename that should represent the fragment.
   */
  static scriptToFragmentFilename(scriptName: string) {
    // $ needs to be duplicated, as it's otherwise interpreted as part of $1,$2,$3,... references
    return `.${scriptName.replace(/:/g, "$$$$")}.md`;
  }

  /**
   * Retrieve the script name from the filename of a fragment.
   * @param fragmentName - The filename of the fragment.
   * @returns The script name, if the fragment name could be parsed.
   */
  static fragmentFilenameToScript(fragmentName: string) {
    const matches = /\.(.+?)\.md/.exec(fragmentName);
    if (!matches) {
      return null;
    }

    return matches[1].replace(/\$\$/g, ":");
  }

  /**
   * Determine if the given store location exists.
   * @param storePath - The location of a store.
   * @returns `true` if the store exists; `false` otherwise.
   */
  static async exists(storePath: string) {
    try {
      await fs.stat(storePath);
    } catch {
      return false;
    }

    return true;
  }
}
