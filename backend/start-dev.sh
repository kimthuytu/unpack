#!/bin/bash
# Load environment variables and start serverless offline

export PATH="/bin:/usr/bin:/opt/homebrew/opt/node@20/bin:/opt/homebrew/bin:$PATH"

# Load .env file
set -a
source .env
set +a

# Start serverless offline
npm run dev

