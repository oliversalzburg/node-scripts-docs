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
	npm exec -- biome check --write --no-errors-on-unmatched
	npm pkg fix

lint: node_modules
	npm exec -- biome check .
	npm exec -- tsc --noEmit

test: build
	NODE_OPTIONS=--experimental-vm-modules npm exec -- jest --coverage source
update-snapshots: build
	NODE_OPTIONS=--experimental-vm-modules npm exec -- jest -u source

run: build
	node ./output/main.js


node_modules:
	npm install

output: node_modules
	npm exec -- tsc
