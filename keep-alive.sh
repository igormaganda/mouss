#!/bin/bash
# Keep-alive server script for Next.js standalone production
while true; do
  cd /home/z/my-project/.next/standalone
  HOSTNAME="0.0.0.0" PORT=3000 node server.js 2>&1
  echo "Server died, restarting in 2s..."
  sleep 2
done
