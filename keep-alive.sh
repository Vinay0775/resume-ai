#!/bin/bash
cd /home/z/my-project
while true; do
  rm -rf .next
  npx next dev -p 3000 &
  SERVER_PID=$!
  echo "Server started with PID: $SERVER_PID" > /home/z/my-project/server.pid
  wait $SERVER_PID
  echo "Server died, restarting in 3s..." >> /home/z/my-project/dev.log
  sleep 3
done
