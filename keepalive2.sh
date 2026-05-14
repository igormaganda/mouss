#!/bin/bash
LOGFILE="/home/z/my-project/dev.log"
while true; do
  echo "=== START $(date) ===" >> "$LOGFILE"
  cd /home/z/my-project
  npx next dev -p 3000 >> "$LOGFILE" 2>&1
  echo "=== EXIT code=$? $(date) ===" >> "$LOGFILE"
  sleep 2
done
