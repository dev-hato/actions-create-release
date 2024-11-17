#!/usr/bin/env bash

npm ci
tsc --noEmit

for f in src/*.ts; do
	npx esbuild --platform=node --bundle --format=cjs --outdir=dist "$f"
done
