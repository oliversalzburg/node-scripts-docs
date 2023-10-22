import { ScriptStoreEntry } from "./ScriptStore.js";

export const DOCUMENTATION_PENDING_DEFAULT = "_documentation pending_";

export class FragmentRenderer {
  static isDefaultDescription(description: string) {
    return description === DOCUMENTATION_PENDING_DEFAULT;
  }

  static makeDocumentation(scriptMeta: ScriptStoreEntry, rawDescription?: string | undefined) {
    const description =
      rawDescription !== undefined ? rawDescription : DOCUMENTATION_PENDING_DEFAULT;
    const descriptionIndented = description.replace(/^(?!\s*$)/gm, " ".repeat(4));

    const scriptDocs: string = `## ${scriptMeta.scriptName}

-   Project: \`${scriptMeta.projectName}\`
-   Source:

    \`\`\`shell
    ${scriptMeta.scriptCode}
    \`\`\`

-   Description:

${descriptionIndented}
`;

    return scriptDocs;
  }
}
