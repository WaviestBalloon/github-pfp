#!/bin/bash
set -e

# Purge dist folder if it exists
if [ -d "dist" ]; then
	rm -r dist
fi

# Build server npx
npx tsc

# Run server
node . --port 3000 --cache-removal-timer 285000 --use-cluster true
# It's recommended to enable cluster in production for better performance
# Read here: https://github.com/WaviestBalloon/github-pfp/tree/main#-server-parameters
