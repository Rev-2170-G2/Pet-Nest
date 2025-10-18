#!/bin/bash
sudo pgrep -l -f "node server.js" | cut -d ' ' -f 1 | xargs sudo kill