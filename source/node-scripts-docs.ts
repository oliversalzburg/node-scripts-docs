#!/usr/bin/env node

import ElapsedTime from "elapsed-time";
import fs from "fs/promises";
import minimist from "minimist";
import path from "path";
import { DocumentationRenderer } from "./DocumentationRenderer";
import { FragmentScanner } from "./FragmentScanner";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION, FragmentStore } from "./FragmentStore";
import { ScriptScanner } from "./ScriptScanner";
import { ScriptStore, SCRIPTS_METADATA_DEFAULT_FILENAME } from "./ScriptStore";
import { StoreAugmenter } from "./StoreAugmenter";
import { Validator } from "./Validator";

const argv = minimist(process.argv.slice(2));

(async () => {
  debugger;
  console.info(`node-scripts-docs (${new Date().toISOString()})`);
  const entry = ElapsedTime.new().start();

  const rootDirectory = argv.cwd ?? argv._[0] ?? process.cwd();
  console.info(`Working directory: ${rootDirectory}`);

  const manifestPath = path.resolve(rootDirectory, "package.json");
  const manifestExists = await ScriptScanner.canLoad(manifestPath);
  if (!manifestExists) {
    console.info(`Manifest: package.json (doesn't exist!)`);
    console.error("Manifest not found in working directory. Aborting.");
    process.exit(1);
  }
  const manifest = await ScriptScanner.loadManifest(manifestPath);
  console.info(
    `Manifest: package.json (exists) [${manifest.name}@${manifest.version ?? "<no version>"}]`
  );

  const scriptStoreName = argv.store ?? SCRIPTS_METADATA_DEFAULT_FILENAME;
  const scriptStorePath = path.resolve(rootDirectory, scriptStoreName);
  const scriptStoreExists = await ScriptStore.exists(scriptStorePath);
  console.info(
    `Metadata store: ${scriptStoreName} (${scriptStoreExists ? "exists" : "doesn't exist"})`
  );

  const docsLocation = argv["docs-location"] ?? DOCS_FRAGMENTS_DEFAULT_LOCATION;
  const fragmentStorePath = path.resolve(rootDirectory, docsLocation);
  const fragmentStoreExists = await FragmentStore.exists(fragmentStorePath);
  console.info(
    `Docs location: ${docsLocation} (${fragmentStoreExists ? "exists" : "doesn't exist"})`
  );

  const skipScan = Boolean(argv["skip-scan"]) ?? false;
  let scriptStoreFromScan;
  if (!skipScan) {
    console.info("Finding all scripts in all workspaces...");
    const scriptScanner = new ScriptScanner(rootDirectory);
    await scriptScanner.loadManifests();
    console.info(`Found ${scriptScanner.manifests.length} manifest(s).`);
    scriptStoreFromScan = await scriptScanner.loadScripts();
    console.info(`Manifests contain ${scriptStoreFromScan.scripts.length} script(s).`);
  }

  let scriptStore;
  if (scriptStoreExists) {
    console.info("Loading existing metadata...");
    scriptStore = new ScriptStore(rootDirectory, scriptStoreName);
    await scriptStore.load();
    console.info(`Store contains ${scriptStore.scripts.length} script(s).`);
  }

  let fragmentStore;
  if (fragmentStoreExists) {
    console.info("Loading existing fragments...");
    const fragmentScanner = new FragmentScanner(fragmentStorePath);
    fragmentStore = await fragmentScanner.loadFragments();
    console.info(`Docs contain ${fragmentStore.fragments.size} fragment(s).`);
  }

  const metadata = scriptStoreFromScan ?? scriptStore;
  if (!metadata) {
    console.error("No metadata available. Aborting.");
    process.exit(1);
  }

  const validator = new Validator(
    scriptStore ?? new ScriptStore(rootDirectory),
    scriptStoreFromScan ?? new ScriptStore(rootDirectory),
    fragmentStore ?? new FragmentStore(fragmentStorePath)
  );

  const report = validator.generateReport();

  if (0 < report.missingFragments.size) {
    console.info(` --- Missing fragments (will be generated) --- `);
    for (const scriptMeta of report.missingFragments) {
      console.info(
        `  ${FragmentStore.scriptToFragmentFilename(scriptMeta.scriptName)} (${
          scriptMeta.scriptName
        })`
      );
    }
    console.info("");
  }

  if (0 < report.corruptedMetadataRecords.size) {
    console.info(` --- Outdated metadata (will be updated) --- `);
    for (const scriptMeta of report.corruptedMetadataRecords) {
      console.info(
        `  ${ScriptStore.makeScriptLocator(scriptMeta.projectName, scriptMeta.scriptName)}`
      );
    }
    console.info("");
  }

  if (0 < report.obsoleteFragments.size) {
    console.info(` --- Obsolete fragments (delete manually) --- `);
    for (const fragment of report.obsoleteFragments) {
      console.info(`  ${fragment.filename}`);
    }
    console.info("");
  }

  if (0 < report.changedFragments.size) {
    console.info(` --- Detected changes --- `);
    for (const scriptMeta of report.changedFragments) {
      console.info(
        `  ${FragmentStore.scriptToFragmentFilename(scriptMeta.scriptName)} (${
          scriptMeta.scriptName
        })`
      );
    }
    console.info("");
  }

  if (0 < report.pendingDocumentation.size) {
    console.info(` --- Pending documentation --- `);
    for (const scriptMeta of report.pendingDocumentation) {
      console.info(
        `  ${ScriptStore.makeScriptLocator(scriptMeta.projectName, scriptMeta.scriptName)}`
      );
    }
    console.info("");
  }

  if (0 < report.newScripts.size) {
    console.info(` --- New scripts --- `);
    for (const scriptMeta of report.newScripts) {
      console.info(
        `  ${ScriptStore.makeScriptLocator(scriptMeta.projectName, scriptMeta.scriptName)}`
      );
    }
    console.info("");
  }

  const checkOnly = Boolean(argv["check-only"]) ?? false;
  if (!checkOnly) {
    if (fragmentStore) {
      console.info("Augmenting metadata with existing documentation fragment data...");
      const augmenter = new StoreAugmenter(metadata);
      augmenter.augment(fragmentStore);
      console.info("Augmentation complete.");
    }

    const withLocalScripts = Boolean(argv["include-locals"]) ?? false;
    const renderer = new DocumentationRenderer(metadata);
    await renderer.renderFragments(fragmentStorePath);

    const documentation = renderer.render(withLocalScripts);
    const indexFile = path.resolve(fragmentStorePath, "index.md");
    await fs.writeFile(indexFile, documentation);

    console.info("Flushing metadata...");
    await metadata.save();
  }

  console.log(`Process completed in ${entry.getValue()}.`);
  process.exit(0);
})();
