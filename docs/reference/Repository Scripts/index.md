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
    podman run --rm -it -p 8000:8000 -v ${PWD}:/docs docker.io/squidfunk/mkdocs-material build --site-dir=public
    ```

-   Description:

    Build the documentation website locally.

## docs:scripts

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    yarn nsd-debug
    ```

-   Description:

    Rebuilds the `node-scripts-docs` documentation for this project itself.

## docs:serve

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    podman run --rm -it -p 8000:8000 -v ${PWD}:/docs docker.io/squidfunk/mkdocs-material
    ```

-   Description:

    Runs the mkdocs-material development server.

## npm:publish

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    npm publish
    ```

-   Description:

    Build the latest sources and then `npm publish` the current state.

## npm:publish:major

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    npm version major && npm publish
    ```

-   Description:

    _documentation pending_

## npm:publish:minor

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    npm version minor && npm publish
    ```

-   Description:

    _documentation pending_

## npm:publish:patch

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    npm version patch && npm publish
    ```

-   Description:

    Publish a patch release to the npm registry.

## nsd-debug

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    yarn build && node output/node-scripts-docs.js
    ```

-   Description:

    Build the latest sources and then use the build output to execute your command. Parameters are passed through by `yarn`.

## prepack

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    yarn build
    ```

-   Description:

    _documentation pending_

## test

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    node --experimental-vm-modules $(yarn bin jest)
    ```

-   Description:

    Execute all Jest test suites.

## test:coverage

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    node --experimental-vm-modules $(yarn bin jest) --coverage
    ```

-   Description:

    Execute Jest test suites and calculate code coverage.
