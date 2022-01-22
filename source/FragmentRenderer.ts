import { ScriptStoreEntry } from "./ScriptStore";

const pendingDefault = `_documentation pending_`;

export class FragmentRenderer {
  static isDefaultDescription(description: string) {
    return description === pendingDefault;
  }

  static makeDocumentation(scriptMeta: ScriptStoreEntry, rawDescription?: string | undefined) {
    const description = rawDescription !== undefined ? rawDescription : pendingDefault;
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
