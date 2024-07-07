#!/usr/bin/env node

import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
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

const main = async () => {
  process.stderr.write(`node-scripts-docs (${new Date().toISOString()})\n`);
  const entry = ElapsedTime.new().start();

  const rootDirectory = String(argv.cwd ?? argv._[0] ?? process.cwd());
  process.stderr.write(`Working directory: ${rootDirectory}}\n`);

  const withLocalScripts = Boolean(argv["include-locals"]);

  const manifestPath = path.resolve(rootDirectory, "package.json");
  const manifestExists = await ScriptScanner.canLoad(manifestPath);
  if (!manifestExists) {
    process.stderr.write("Manifest: package.json (doesn't exist!)\n");
    process.stderr.write("Manifest not found in working directory. Aborting.\n");
    process.exit(1);
  }
  const manifest = await ScriptScanner.loadManifest(manifestPath);
  process.stderr.write(
    `Manifest: package.json (exists) [${manifest.name}@${manifest.version ?? "<no version>"}]\n`,
  );

  const scriptStoreName = String(argv.store ?? SCRIPTS_METADATA_DEFAULT_FILENAME);
  const scriptStorePath = path.resolve(rootDirectory, scriptStoreName);
  const scriptStoreExists = await ScriptStore.exists(scriptStorePath);
  process.stderr.write(
    `Metadata store: ${scriptStoreName} (${scriptStoreExists ? "exists" : "doesn't exist"})\n`,
  );

  const docsLocation = String(argv["docs-location"] ?? DOCS_FRAGMENTS_DEFAULT_LOCATION);
  const fragmentStorePath = path.resolve(rootDirectory, docsLocation);
  const fragmentStoreExists = await FragmentStore.exists(fragmentStorePath);
  process.stderr.write(
    `Docs location: ${docsLocation} (${fragmentStoreExists ? "exists" : "doesn't exist"})\n`,
  );

  const skipScan = Boolean(argv["skip-scan"]);
  let scriptStoreFromScan;
  if (!skipScan) {
    process.stderr.write("Finding all scripts in all workspaces...\n");
    const scriptScanner = new ScriptScanner(rootDirectory);
    await scriptScanner.loadManifests();
    process.stderr.write(`Found ${scriptScanner.manifests.length.toString()} manifest(s).\n`);
    scriptStoreFromScan = await scriptScanner.loadScripts();
    process.stderr.write(
      `Manifests contain ${scriptStoreFromScan.scripts.length.toString()} script(s), ${scriptStoreFromScan.globalScripts.length.toString()} as global.\n`,
    );
  }

  let scriptStore;
  if (scriptStoreExists) {
    process.stderr.write("Loading existing metadata...\n");
    scriptStore = new ScriptStore(rootDirectory, scriptStoreName);
    await scriptStore.load();
    process.stderr.write(`Store contains ${scriptStore.scripts.length.toString()} script(s).\n`);
  }

  let fragmentStore;
  if (fragmentStoreExists) {
    process.stderr.write("Loading existing fragments...\n");
    fragmentStore = await loadFragments(fragmentStorePath);
    process.stderr.write(`Docs contain ${fragmentStore.fragments.size.toString()} fragment(s).\n`);
  }

  const metadata = scriptStoreFromScan ?? scriptStore;
  if (!metadata) {
    process.stderr.write("No metadata available. Aborting.\n");
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
    process.stderr.write(render(report, skipPending));
  } else {
    process.stderr.write("Skipping change-detection due to --skip-scan.\n");
  }

  const checkOnly = Boolean(argv["check-only"]);
  if (!checkOnly) {
    if (fragmentStore) {
      process.stderr.write("Augmenting metadata with existing documentation fragment data...\n");
      const augmenter = new StoreAugmenter(metadata);
      augmenter.augment(fragmentStore);
      process.stderr.write("Augmentation complete.\n");
    }

    const renderer = new DocumentationRenderer(metadata);
    await renderer.flushFragments(fragmentStorePath, withLocalScripts);

    const documentation = renderer.render(withLocalScripts);
    const indexFile = path.resolve(fragmentStorePath, "index.md");
    await fs.writeFile(indexFile, documentation);

    process.stderr.write("Flushing metadata...\n");
    await metadata.save();
  } else {
    process.stderr.write("No files were updated, due to --check-only.\n");
  }

  process.stderr.write(`Process completed in ${entry.getValue()}.\n`);
  process.exit(0);
};

main().catch(redirectErrorsToConsole(console));
