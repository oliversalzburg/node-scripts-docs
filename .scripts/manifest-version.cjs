#!/usr/bin/env node

"use strict";

const { execSync } = require("node:child_process");
const { resolve } = require("node:path");

const pkg = require(resolve("./package.json"));

const options = process.argv.slice(2).reduce((args, arg) => {
  const [key, value] = arg.split("=");
  args[key.substring(2)] = value ?? true;

  return args;
}, {});

function getRootVersion(bump = true) {
  let rootVersion = pkg.version.replace(/^(\d+\.\d+\.\d+)-?.*$/, "$1");

  if (bump) {
    const parts = rootVersion.split(".");
    const inc = bump ? 1 : 0;

    switch (options.canary?.toLowerCase()) {
      case "major": {
        parts[0] = `${+parts[0] + inc}`;
        parts[1] = 0;
        parts[2] = 0;
        break;
      }
      case "minor": {
        parts[1] = `${+parts[0] + inc}`;
        parts[2] = 0;
        break;
      }
      case "patch":
      default:
        parts[2] = `${+parts[2] + inc}`;
    }

    rootVersion = parts.join(".");
  }

  return rootVersion;
}

function getNextVersion() {
  const versions = [];

  try {
    const versionString = execSync(`npm show ${pkg.name} versions --json`, {
      encoding: "utf8",
      stdio: "pipe",
    });
    const parsed = JSON.parse(versionString);
    versions.push(...parsed);
  } catch {
    // the package might not have been published yet
  }

  const version = getRootVersion(options.canary ?? false);

  if (versions.some(v => v === version)) {
    process.stderr.write(
      `before-deploy: A release with version ${version} already exists. Please increment version accordingly.\n`,
    );
    process.exit(1);
  }

  if (!options.canary) {
    return version;
  }

  const preid = options.preid ?? "dev";
  const prereleaseNumbers = versions
    .filter(v => v.startsWith(`${version}-${preid}.`))
    .map(v => Number(v.match(/\.(\d+)$/)?.[1]));
  const lastPrereleaseNumber = Math.max(-1, ...prereleaseNumbers);

  return `${version}-${preid}.${lastPrereleaseNumber + 1}`;
}

const versionString = getNextVersion();
process.stdout.write(versionString);
