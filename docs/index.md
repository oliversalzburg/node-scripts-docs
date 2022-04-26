# Quick Start

1.  Install `node-scripts-docs`:

    === "yarn"

        ```shell
        yarn add -D node-scripts-docs
        ```

    === "npm"

        ```shell
        npm install -D node-scripts-docs
        ```

1.  Run an initial check on your project:

    === "yarn"

        ```shell
        yarn nsd --check-only
        ```

    === "npm"

        ```shell
        npx nsd --check-only
        ```

    !!! hint

        To run `nsd` on another project, you can simply pass the directory as an unlabeled argument:

        === "yarn"

            ```shell
            yarn nsd ~/projects/myrepo --check-only
            ```

        === "npm"

            ```shell
            npx nsd ~/projects/myrepo --check-only
            ```

1.  Drop the `--check-only` to write the initial documentation scaffold. Then begin editing the descriptions in the generated documentation fragments right away.

    Whenever you've added scripts, removed scripts, updated documentation fragments, just run `yarn nsd` again to synchronize the documentation and the scripts.

!!! warn

    By default, this tool will only operate on scripts that have a `:` in their name. By `yarn` definition, these are _globally available_ scripts throughout the monorepo. This tool is primarily designed for that scenario.

    However, you can pass `--include-locals` to also include other scripts in the build. If you are working in a monorepo, where multiple workspaces define the same script, this will result in problems. This option is mostly intended for single-workspace projects.

## Sample output

```shell
node-scripts-docs (2022-01-22T20:56:40.834Z)
Working directory: /home/oliver/projects/node-scripts-docs
Manifest: package.json (exists) [node-scripts-docs@0.0.2]
Metadata store: package.json-scripts.json (exists)
Docs location: docs/reference/yarn Scripts/ (exists)
Finding all scripts in all workspaces...
Found 1 manifest(s).
Manifests contain 5 script(s), 3 as global.
Loading existing metadata...
Store contains 4 script(s).
Loading existing fragments...
Docs contain 2 fragment(s).
 --- Pending documentation ---
  docs:build→node-scripts-docs

 --- New scripts ---
  npm:publish→node-scripts-docs

Augmenting metadata with existing documentation fragment data...
Augmentation complete.
Flushing metadata...
Process completed in 56.703ms.
```
