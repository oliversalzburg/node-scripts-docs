import fs from "fs/promises";
import { marked } from "marked";
import path from "path";

export const DOCS_FRAGMENTS_DEFAULT_LOCATION = "docs/reference/Repository Scripts/";

export class DocumentationFragment {
  descriptionMarkdown: string;
  filename: string;

  constructor(filename: string, descriptionMarkdown = "_documentation pending_") {
    this.filename = filename;
    this.descriptionMarkdown = descriptionMarkdown;
  }
}

export class FragmentStore {
  private fragmentDirectory: string;

  public fragments = new Map<string, DocumentationFragment>();

  constructor(fragmentDirectory: string) {
    this.fragmentDirectory = fragmentDirectory;
  }

  addFile(filename: string, descriptionMarkdown?: string) {
    this.fragments.set(
      FragmentStore.fragmentFilenameToScript(filename)!,
      new DocumentationFragment(filename, descriptionMarkdown)
    );
  }

  addScript(scriptName: string, descriptionMarkdown?: string) {
    this.fragments.set(
      scriptName,
      new DocumentationFragment(
        FragmentStore.scriptToFragmentFilename(scriptName),
        descriptionMarkdown
      )
    );
  }

  async loadFragment(fragmentFilename: string) {
    const existingDocumentation = await fs.readFile(
      path.resolve(this.fragmentDirectory, fragmentFilename),
      "utf-8"
    );
    const parsed = marked.lexer(existingDocumentation);

    // Expect parsed to be an array of [heading, list]
    const items = (parsed[1] as marked.Tokens.List).items;
    // Expect items to be [list_item, list_item, list_item]
    const descriptionItem = items.find(
      item =>
        1 <= item.tokens.length && (item.tokens[0] as marked.Tokens.Text).text === "Description:"
    );
    if (!descriptionItem) {
      throw new Error(
        `Unable to find description item in documentation fragment at '${fragmentFilename}'!`
      );
    }

    const assumedScriptName = FragmentStore.fragmentFilenameToScript(fragmentFilename);
    if (!assumedScriptName) {
      throw new Error(`Unable to interpret fragment file name '${fragmentFilename}'!`);
    }

    const descriptionRaw = descriptionItem.tokens
      .slice(2)
      .map(token => token.raw)
      .join("");

    this.fragments.set(
      assumedScriptName,
      new DocumentationFragment(fragmentFilename, descriptionRaw)
    );
  }

  getExistingDescription(scriptName: string) {
    if (!this.fragments.has(scriptName)) {
      return undefined;
    }

    return this.fragments.get(scriptName)!.descriptionMarkdown;
  }

  static scriptToFragmentFilename(scriptName: string) {
    return `.${scriptName}.md`;
  }

  static fragmentFilenameToScript(fragmentName: string) {
    const matches = /\.(.+?)\.md/.exec(fragmentName);
    if (!matches) {
      return null;
    }

    return matches[1];
  }

  static async exists(storePath: string) {
    try {
      await fs.stat(storePath);
    } catch {
      return false;
    }

    return true;
  }
}
