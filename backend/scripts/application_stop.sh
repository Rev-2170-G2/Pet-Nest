#!/bin/bash
echo "Stopping Node server..."

# Find PIDs of node server.js
pids=$(pgrep -f "node server.js")

if [ -n "$pids" ]; then
  echo "Killing processes: $pids"
  kill $pids
else
  echo "No matching node processes found."
fi
