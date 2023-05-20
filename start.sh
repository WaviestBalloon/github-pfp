# Purge dist folder
rm -rf dist
# Build server
npx tsc

# Run server
node . --port 3000 --cache-removal-timer 285000 --use-cluster true
# It's recommended to enable cluster in production for better performance
# Read here: https://github.com/WaviestBalloon/github-pfp/tree/main#-server-parameters
