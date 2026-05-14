#!/bin/bash
while true; do
  if ! ss -tlnp | grep -q ":3000 "; then
    cd /home/z/my-project/.next/standalone
    node server.js >> /home/z/my-project/dev.log 2>&1 &
    sleep 5
  fi
  sleep 3
done
