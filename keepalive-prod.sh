#!/bin/bash
cd /home/z/my-project/.next/standalone
while true; do
  node server.js >> /home/z/my-project/dev.log 2>&1
  echo "$(date): Production server crashed, restarting in 2s..." >> /home/z/my-project/dev.log
  sleep 2
done
