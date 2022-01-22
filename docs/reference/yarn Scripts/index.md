# Full reference

## build

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    tsc
    ```

-   Description:

    _documentation pending_

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

    _documentation pending_

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

    _documentation pending_

## nsd-debug

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    yarn build && node output/node-scripts-docs.js
    ```

-   Description:

    _documentation pending_
