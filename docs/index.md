# Quick Start

Install the published package:

=== "yarn"

    ```shell
    yarn install -D node-scripts-docs
    ```

=== "npm"

    ```shell
    npm install -D node-scripts-docs
    ```

You can now run `node-scripts-docs` from the shell through `yarn`:

=== "yarn"

    ```shell
    yarn nsd --check-only
    ```

=== "npm"

    ```shell
    npx nsd --check-only
    ```

To run `nsd` on another project, you can simply pass the directory as an unlabeled argument:

=== "yarn"

    ```shell
    yarn nsd ~/projects/myrepo --check-only
    ```

=== "npm"

    ```shell
    npx nsd ~/projects/myrepo --check-only
    ```

Drop the `--check-only` to write the initial documentation scaffold. Then begin editing the descriptions in the generated documentation fragments right away.

Whenever you've added scripts, removed scripts, updated documentation fragments, just run `yarn nsd` again to update the documentation.
