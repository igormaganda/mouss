#!/bin/bash
# Keep-alive script for Next.js dev server
while true; do
  cd /home/z/my-project
  npx next dev -p 3000 >> /home/z/my-project/dev.log 2>&1
  echo "$(date): Next.js crashed, restarting in 2s..." >> /home/z/my-project/dev.log
  sleep 2
done
