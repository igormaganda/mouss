#!/bin/bash
cd /home/z/my-project/.next/standalone
HOSTNAME="0.0.0.0" PORT=3000 node server.js &
PID=$!
echo "$PID" > /home/z/my-project/server.pid
echo "Server started with PID $PID"
disown
