import { FragmentRenderer } from "./FragmentRenderer";
import { DocumentationFragment, FragmentStore } from "./FragmentStore";
import { ScriptStore, ScriptStoreEntry } from "./ScriptStore";

export type ValidationReport = {
  // Scripts for which the description in the fragment doesn't match the metadata.
  changedFragments: Set<ScriptStoreEntry>;
  // Scripts where the metadata was confusingly inconsistent with the fragment.
  corruptedMetadataRecords: Set<ScriptStoreEntry>;
  // Scripts that exist in the metadata, but for which no fragment exists at all.
  // These could just be new scripts.
  missingFragments: Set<ScriptStoreEntry>;
  // Scripts that aren't in the metadata.
  newScripts: Set<ScriptStoreEntry>;
  // Fragments for which there is no longer a matching script.
  obsoleteFragments: Set<DocumentationFragment>;
  // Scripts that have a fragment which is not filled out yet.
  pendingDocumentation: Set<ScriptStoreEntry>;
  // Scripts for which the description in the fragment is identical with the metadata.
  unchangedFragments: Set<ScriptStoreEntry>;
};

export class Validator {
  fragmentStore: FragmentStore;
  metadata: ScriptStore;
  metadataFromScan: ScriptStore;

  constructor(metadata: ScriptStore, metadataFromScan: ScriptStore, fragmentStore: FragmentStore) {
    this.metadata = metadata;
    this.metadataFromScan = metadataFromScan;
    this.fragmentStore = fragmentStore;
  }

  generateReport(withLocals = false): ValidationReport {
    const report: ValidationReport = {
      changedFragments: new Set<ScriptStoreEntry>(),
      corruptedMetadataRecords: new Set<ScriptStoreEntry>(),
      missingFragments: new Set<ScriptStoreEntry>(),
      newScripts: new Set<ScriptStoreEntry>(),
      obsoleteFragments: new Set<DocumentationFragment>(),
      pendingDocumentation: new Set<ScriptStoreEntry>(),
      unchangedFragments: new Set<ScriptStoreEntry>(),
    };

    // Find fragments in the fragment store for which the corresponding script has been removed.
    const obsoleteFragments = new Set<DocumentationFragment>();
    for (const fragment of this.fragmentStore.fragments.values()) {
      obsoleteFragments.add(fragment);
    }
    for (const scriptMeta of this.metadataFromScan.scripts) {
      const fragment = this.fragmentStore.fragments.get(scriptMeta.scriptName);
      if (fragment) {
        obsoleteFragments.delete(fragment);
      }
    }
    report.obsoleteFragments = obsoleteFragments;

    for (const scriptMeta of this.metadataFromScan.scripts) {
      if (!scriptMeta.isGlobal && !withLocals) {
        continue;
      }

      const cachedMeta = this.metadata.scripts.find(
        candidate =>
          candidate.projectName === scriptMeta.projectName &&
          candidate.scriptName === scriptMeta.scriptName
      );

      if (!cachedMeta) {
        report.newScripts.add(scriptMeta);
        continue;
      }

      // If a script is not in the fragment store, it is treated as missing.
      if (!this.fragmentStore.fragments.has(scriptMeta.scriptName)) {
        report.missingFragments.add(scriptMeta);
        continue;
      }

      const fragment = this.fragmentStore.fragments.get(scriptMeta.scriptName)!;

      // If the fragment has the default description, it was written by an earlier run.
      // If the metadata contains no description, the documentation is still pending.
      if (
        FragmentRenderer.isDefaultDescription(fragment.descriptionMarkdown) &&
        !cachedMeta.description
      ) {
        report.unchangedFragments.add(scriptMeta);
        report.pendingDocumentation.add(scriptMeta);
      }

      // If the fragment has an authored description, it was well in production.
      // If the metadata contains no description, it seems to be corrupted.
      if (
        !FragmentRenderer.isDefaultDescription(fragment.descriptionMarkdown) &&
        !cachedMeta.description
      ) {
        report.corruptedMetadataRecords.add(scriptMeta);
      }

      // If a non-default description is authored in the fragment and there's a description in the metdata,
      // this should be changed for changes.
      if (
        !FragmentRenderer.isDefaultDescription(fragment.descriptionMarkdown) &&
        cachedMeta.description
      ) {
        // If the description in the fragment is identical to the metadata, it's treated as unchanged.
        if (fragment.descriptionMarkdown === cachedMeta.description) {
          report.unchangedFragments.add(scriptMeta);
        } else {
          report.changedFragments.add(scriptMeta);
        }
      }
    }

    return report;
  }
}
