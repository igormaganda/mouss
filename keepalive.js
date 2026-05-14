#!/usr/bin/env node
// Keepalive wrapper for Next.js dev server
// Restarts automatically if the process dies

const { spawn } = require('child_process');
const path = require('path');

const server = spawn('npx', ['next', 'dev', '-p', '3000'], {
  cwd: path.join(__dirname),
  stdio: ['inherit', 'pipe', 'pipe'],
  detached: false,
});

server.stdout.on('data', (data) => {
  process.stdout.write(data);
});

server.stderr.on('data', (data) => {
  process.stderr.write(data);
});

server.on('close', (code) => {
  console.log(`Next.js exited with code ${code}. Restarting in 3s...`);
  setTimeout(() => {
    // Re-spawn
    const newServer = spawn('npx', ['next', 'dev', '-p', '3000'], {
      cwd: path.join(__dirname),
      stdio: ['inherit', 'pipe', 'pipe'],
    });
    newServer.stdout.pipe(process.stdout);
    newServer.stderr.pipe(process.stderr);
    newServer.on('close', () => {
      console.log('Restarted server also died. Exiting.');
      process.exit(1);
    });
  }, 3000);
});

// Handle SIGTERM gracefully
process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit(0);
});
