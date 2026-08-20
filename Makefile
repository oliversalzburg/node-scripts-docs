.PHONY: default build clean docs git-hook pretty lint test run

OBJECTS := $(wildcard source/*.ts)
OUTPUT := $(patsubst %.ts,%.js,$(OBJECTS))

default : build

build : output/tsconfig.tsbuildinfo

clean :
	rm --force --recursive node_modules output tsconfig.tsbuildinfo

docs :
	podman run --rm --volume ${PWD}:/docs docker.io/squidfunk/mkdocs-material build --site-dir=public

git-hook :
	echo "make pretty" > .git/hooks/pre-commit

pretty : node_modules/.package-lock.json
	npm exec -- biome check --write --no-errors-on-unmatched --unsafe
	npm pkg fix

lint : node_modules/.package-lock.json
	npm exec -- biome check .
	npm exec -- tsc

test : output/tsconfig.tsbuildinfo
	node --enable-source-maps --test
update-snapshots : output/tsconfig.tsbuildinfo
	node --test --test-update-snapshots

run : output/tsconfig.tsbuildinfo
	node ./output/main.js


package-lock.json: package.json
	npm install --package-lock-only
node_modules/.package-lock.json: package-lock.json
	npm ci

output/tsconfig.tsbuildinfo : node_modules/.package-lock.json $(OBJECTS)
	npm exec -- tsc
