# Full reference

## build

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    tsc
    ```

-   Description:

    Build the TypeScript sources.

## docs:build

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material build --site-dir=public
    ```

-   Description:

    Build the documentation website locally.

## docs:scripts

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    yarn nsd-debug --include-locals
    ```

-   Description:

    Rebuilds the `node-scripts-docs` documentation for this project itself.

## docs:serve

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material
    ```

-   Description:

    Runs the mkdocs-material development server.

## npm:publish

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    yarn build && npm publish
    ```

-   Description:

    Build the latest sources and then `npm publish` the current state.

## nsd-debug

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    yarn build && node output/node-scripts-docs.js
    ```

-   Description:

    Build the latest sources and then use the build output to execute your command. Parameters are passed through by `yarn`.
