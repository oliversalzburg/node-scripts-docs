#!/usr/bin/env node

import ElapsedTime from "elapsed-time";
import minimist from "minimist";
import fs from "node:fs/promises";
import path from "node:path";
import { DocumentationRenderer } from "./DocumentationRenderer.js";
import { loadFragments } from "./FragmentScanner.js";
import { DOCS_FRAGMENTS_DEFAULT_LOCATION, FragmentStore } from "./FragmentStore.js";
import { render } from "./ReportRenderer.js";
import { ScriptScanner } from "./ScriptScanner.js";
import { SCRIPTS_METADATA_DEFAULT_FILENAME, ScriptStore } from "./ScriptStore.js";
import { StoreAugmenter } from "./StoreAugmenter.js";
import { Validator } from "./Validator.js";

const argv = minimist(process.argv.slice(2));

(async () => {
  console.info(`node-scripts-docs (${new Date().toISOString()})`);
  const entry = ElapsedTime.new().start();

  const rootDirectory = String(argv.cwd ?? argv._[0] ?? process.cwd());
  console.info(`Working directory: ${rootDirectory}`);

  const withLocalScripts = Boolean(argv["include-locals"]);

  const manifestPath = path.resolve(rootDirectory, "package.json");
  const manifestExists = await ScriptScanner.canLoad(manifestPath);
  if (!manifestExists) {
    console.info("Manifest: package.json (doesn't exist!)");
    console.error("Manifest not found in working directory. Aborting.");
    process.exit(1);
  }
  const manifest = await ScriptScanner.loadManifest(manifestPath);
  console.info(
    `Manifest: package.json (exists) [${manifest.name}@${manifest.version ?? "<no version>"}]`,
  );

  const scriptStoreName = String(argv.store ?? SCRIPTS_METADATA_DEFAULT_FILENAME);
  const scriptStorePath = path.resolve(rootDirectory, scriptStoreName);
  const scriptStoreExists = await ScriptStore.exists(scriptStorePath);
  console.info(
    `Metadata store: ${scriptStoreName} (${scriptStoreExists ? "exists" : "doesn't exist"})`,
  );

  const docsLocation = String(argv["docs-location"] ?? DOCS_FRAGMENTS_DEFAULT_LOCATION);
  const fragmentStorePath = path.resolve(rootDirectory, docsLocation);
  const fragmentStoreExists = await FragmentStore.exists(fragmentStorePath);
  console.info(
    `Docs location: ${docsLocation} (${fragmentStoreExists ? "exists" : "doesn't exist"})`,
  );

  const skipScan = Boolean(argv["skip-scan"]);
  let scriptStoreFromScan;
  if (!skipScan) {
    console.info("Finding all scripts in all workspaces...");
    const scriptScanner = new ScriptScanner(rootDirectory);
    await scriptScanner.loadManifests();
    console.info(`Found ${scriptScanner.manifests.length.toString()} manifest(s).`);
    scriptStoreFromScan = await scriptScanner.loadScripts();
    console.info(
      `Manifests contain ${scriptStoreFromScan.scripts.length.toString()} script(s), ${scriptStoreFromScan.globalScripts.length.toString()} as global.`,
    );
  }

  let scriptStore;
  if (scriptStoreExists) {
    console.info("Loading existing metadata...");
    scriptStore = new ScriptStore(rootDirectory, scriptStoreName);
    await scriptStore.load();
    console.info(`Store contains ${scriptStore.scripts.length.toString()} script(s).`);
  }

  let fragmentStore;
  if (fragmentStoreExists) {
    console.info("Loading existing fragments...");
    fragmentStore = await loadFragments(fragmentStorePath);
    console.info(`Docs contain ${fragmentStore.fragments.size.toString()} fragment(s).`);
  }

  const metadata = scriptStoreFromScan ?? scriptStore;
  if (!metadata) {
    console.error("No metadata available. Aborting.");
    process.exit(1);
  }

  if (scriptStoreFromScan) {
    const validator = new Validator(
      scriptStore ?? new ScriptStore(rootDirectory),
      scriptStoreFromScan,
      fragmentStore ?? new FragmentStore(fragmentStorePath),
    );

    const report = validator.generateReport(withLocalScripts);

    const skipPending = Boolean(argv["skip-pending"]);
    console.info(render(report, skipPending));
  } else {
    console.info("Skipping change-detection due to --skip-scan.");
  }

  const checkOnly = Boolean(argv["check-only"]);
  if (!checkOnly) {
    if (fragmentStore) {
      console.info("Augmenting metadata with existing documentation fragment data...");
      const augmenter = new StoreAugmenter(metadata);
      augmenter.augment(fragmentStore);
      console.info("Augmentation complete.");
    }

    const renderer = new DocumentationRenderer(metadata);
    await renderer.flushFragments(fragmentStorePath, withLocalScripts);

    const documentation = renderer.render(withLocalScripts);
    const indexFile = path.resolve(fragmentStorePath, "index.md");
    await fs.writeFile(indexFile, documentation);

    console.info("Flushing metadata...");
    await metadata.save();
  } else {
    console.warn("No files were updated, due to --check-only.");
  }

  console.log(`Process completed in ${entry.getValue()}.`);
  process.exit(0);
})().catch((error: unknown) => {
  console.error(error);
});
