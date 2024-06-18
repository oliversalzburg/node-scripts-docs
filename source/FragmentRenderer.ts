import { ScriptStoreEntry } from "./ScriptStore.js";

export const DOCUMENTATION_PENDING_DEFAULT = "_documentation pending_";

/**
 * Determine if the current description of a script is still at its default value.
 * @param description - The current description of the script.
 * @returns `true` if it's the default description; `false` otherwise.
 */
export const isDefaultDescription = (description: string) => {
  return description === DOCUMENTATION_PENDING_DEFAULT;
};

/**
 * Render a documentation fragment.
 * @param scriptMeta - The script metadata.
 * @param rawDescription - The description of the script.
 * @returns A documentation fragment for the provided script.
 */
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
