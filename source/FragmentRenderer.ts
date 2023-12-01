import { ScriptStoreEntry } from "./ScriptStore.js";

export const DOCUMENTATION_PENDING_DEFAULT = "_documentation pending_";

export const isDefaultDescription = (description: string) => {
  return description === DOCUMENTATION_PENDING_DEFAULT;
};

export const makeDocumentation = (
  scriptMeta: ScriptStoreEntry,
  rawDescription?: string | undefined,
) => {
  const description = rawDescription ?? DOCUMENTATION_PENDING_DEFAULT;
  const descriptionIndented = description.replace(/^(?!\s*$)/gm, " ".repeat(4));

  const scriptDocs = `## ${scriptMeta.scriptName}

-   Project: \`${scriptMeta.projectName}\`
-   Source:

    \`\`\`shell
    ${scriptMeta.scriptCode}
    \`\`\`

-   Description:

${descriptionIndented}
`;

  return scriptDocs;
};
