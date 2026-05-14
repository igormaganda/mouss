#!/bin/bash
# Robust dev server keepalive
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting Next.js..." >> /home/z/my-project/dev.log
  npx next dev -p 3000 >> /home/z/my-project/dev.log 2>&1
  echo "[$(date)] Next.js exited. Restarting in 3s..." >> /home/z/my-project/dev.log
  sleep 3
done
