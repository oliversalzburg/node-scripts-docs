.PHONY: default build clean docs pretty lint test run

default: clean build

build: output

clean:
	rm -rf ./output tsconfig.tsbuildinfo

docs:
	podman run --rm --volume ${PWD}:/docs docker.io/squidfunk/mkdocs-material build --site-dir=public

pretty:
	yarn biome check --write --no-errors-on-unmatched

lint:
	yarn biome check .
	yarn tsc --noEmit

test: clean build
	node --experimental-vm-modules $(shell yarn bin jest) --coverage source

run: clean build
	node ./output/main.js


output:
	yarn tsc
