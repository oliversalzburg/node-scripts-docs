# node-scripts-docs

## Quick Start

This is a yarn [Zero-Install](https://yarnpkg.com/features/zero-installs) repository. After cloning it, you should be ready to use the code. Just in case some dependencies need to be rebuilt, run an install:

```shell
yarn install
```

You can now run `node-scripts-docs` from the shell through `yarn`:

```shell
yarn nsd --check-only
```

To run `nsd` on another project, you can simply pass the directory as an unlabeled argument:

```shell
yarn nsd ~/projects/myrepo --check-only
```

Drop the `--check-only` to write the initial documentation scaffold. Then begin editing the descriptions in the generated documentation fragments right away.

Whenever you've added scripts, removed scripts, updated documentation fragments, just run `yarn nsd` again to update the documentation.
