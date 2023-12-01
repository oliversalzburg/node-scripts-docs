import { FragmentStore } from "./FragmentStore.js";
import { ScriptStore } from "./ScriptStore.js";
import { ValidationReport } from "./Validator.js";

export const render = (report: ValidationReport, skipPending = true) => {
  const output = new Array<string>();
  if (0 < report.pendingDocumentation.size && !skipPending) {
    output.push(" --- Pending documentation --- ");
    for (const scriptMeta of report.pendingDocumentation) {
      output.push(
        `  ${ScriptStore.makeScriptLocator(scriptMeta.projectName, scriptMeta.scriptName)}`,
      );
    }
    output.push("");
  }

  if (0 < report.missingFragments.size) {
    output.push(" --- Missing fragments (will be generated) --- ");
    for (const scriptMeta of report.missingFragments) {
      output.push(
        `  ${FragmentStore.scriptToFragmentFilename(scriptMeta.scriptName)} (${
          scriptMeta.scriptName
        })`,
      );
    }
    output.push("");
  }

  if (0 < report.corruptedMetadataRecords.size) {
    output.push(" --- Outdated metadata (will be updated) --- ");
    for (const scriptMeta of report.corruptedMetadataRecords) {
      output.push(
        `  ${ScriptStore.makeScriptLocator(scriptMeta.projectName, scriptMeta.scriptName)}`,
      );
    }
    output.push("");
  }

  if (0 < report.obsoleteFragments.size) {
    output.push(" --- Obsolete fragments (delete manually) --- ");
    for (const fragment of report.obsoleteFragments) {
      output.push(`  ${fragment.filename}`);
    }
    output.push("");
  }

  if (0 < report.changedFragments.size) {
    output.push(" --- Detected changes --- ");
    for (const scriptMeta of report.changedFragments) {
      output.push(
        `  ${FragmentStore.scriptToFragmentFilename(scriptMeta.scriptName)} (${
          scriptMeta.scriptName
        })`,
      );
    }
    output.push("");
  }

  if (0 < report.newScripts.size) {
    output.push(" --- New scripts --- ");
    for (const scriptMeta of report.newScripts) {
      output.push(
        `  ${ScriptStore.makeScriptLocator(scriptMeta.projectName, scriptMeta.scriptName)}`,
      );
    }
    output.push("");
  }

  return output.join("\n");
};
