# Full reference

## docs:build

-   Project: `node-scripts-docs`
-   Source:

    ```shell
    docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material build --site-dir=public
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
