.PHONY: default build clean docs git-hook pretty lint test run

default: build

build: output

clean:
	rm --force --recursive node_modules output tsconfig.tsbuildinfo

docs:
	podman run --rm --volume ${PWD}:/docs docker.io/squidfunk/mkdocs-material build --site-dir=public

git-hook:
	echo "make pretty" > .git/hooks/pre-commit

pretty: node_modules
	yarn biome check --write --no-errors-on-unmatched
	npm pkg fix

lint: node_modules
	yarn biome check .
	yarn tsc --noEmit

test: build
	node --experimental-vm-modules $(shell yarn bin jest) --coverage source

run: build
	node ./output/main.js


node_modules:
	yarn install

output: node_modules
	yarn tsc
