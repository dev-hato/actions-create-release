#!/usr/bin/env bash
set -e

npm ci
npx --no-install tsc --noEmit

for f in src/*.ts; do
	npx esbuild --platform=node --bundle --format=cjs --outdir=dist "$f"
done
