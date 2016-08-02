#!/bin/bash

rm -rf dist
mkdir dist

## Create different module formats

### CommonJS
node_modules/.bin/tsc --project tsconfig.json

### ES2015
node_modules/.bin/tsc --project tsconfig.es2015.json

### AMD
node_modules/.bin/tsc --project tsconfig.amd.json

### System
node_modules/.bin/tsc --project tsconfig.system.json


## Create single .d.ts file
cp dist/amd/index.d.ts dist/
