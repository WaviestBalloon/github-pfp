rm -rf dist
npx tsc
node . --port 3000 --cache-removal-timer 285000
