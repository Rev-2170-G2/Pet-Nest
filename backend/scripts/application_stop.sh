#!/bin/bash
echo "Checking for running Node processes..."
pgrep -a -f node

pids=$(pgrep -f "node server.js")
if [ -n "$pids" ]; then
  echo "Killing processes: $pids"
  kill $pids
else
  echo "No matching node processes found."
fi
