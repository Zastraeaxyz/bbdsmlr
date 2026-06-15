#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { createRequire } from 'module';

let __dirname;
try {
  __dirname = dirname(fileURLToPath(import.meta.url));
} catch (e) {
  __dirname = process.cwd();
}

// Change working directory to the executable's directory
// so that node_modules and resources are found correctly
process.chdir(__dirname);

const require = createRequire(import.meta.url);

// Load systray dynamically (it uses CommonJS internally)
const SysTray = require('systray').default;

// Paths
const appDataDir = process.platform === 'win32'
  ? join(process.env.APPDATA, 'BetterBDSMLR')
  : join(process.env.HOME || '/tmp', '.betterbdsmlr');

const dbDir = join(appDataDir, 'drizzle', 'data');
const downloadsDir = join(appDataDir, 'downloads');
const dbPath = join(dbDir, 'db.sqlite');

// Ensure data directories exist
if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });
if (!existsSync(downloadsDir)) mkdirSync(downloadsDir, { recursive: true });

// Server path
const serverDir = join(__dirname, '.output', 'server');
const serverPath = join(serverDir, 'index.mjs');

// Start the server
const server = spawn(process.argv[0], [serverPath], {
  cwd: serverDir,
  env: {
    ...process.env,
    DATABASE_PATH: dbPath,
  },
  stdio: 'pipe',
  detached: false,
  windowsHide: true,
});

server.stdout.on('data', (data) => {
  console.log(`[server] ${data.toString().trim()}`);
});

server.stderr.on('data', (data) => {
  console.error(`[server] ${data.toString().trim()}`);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});

// Read the icon base64
let iconBase64 = '';
try {
  const iconPath = join(__dirname, 'icon.png');
  if (existsSync(iconPath)) {
    const iconBuffer = require('fs').readFileSync(iconPath);
    iconBase64 = iconBuffer.toString('base64');
  }
} catch (e) {
  console.error('Failed to load icon:', e);
}

// Create system tray
const systray = new SysTray({
  menu: {
    icon: iconBase64,
    title: 'Better BDSMLR',
    tooltip: 'Better BDSMLR',
    items: [
      {
        title: 'Open in Browser',
        tooltip: 'Open the app in your browser',
        checked: false,
        enabled: true,
      },
      {
        title: 'Quit',
        tooltip: 'Quit the application',
        checked: false,
        enabled: true,
      },
    ],
  },
  debug: false,
  copyDir: true,
});

systray.onClick((action) => {
  if (action.item.title === 'Open in Browser') {
    if (process.platform === 'win32') {
      spawn('cmd', ['/c', 'start', 'http://localhost:3000'], { detached: true, windowsHide: true });
    } else {
      spawn('open', ['http://localhost:3000'], { detached: true });
    }
  } else if (action.item.title === 'Quit') {
    console.log('Quitting...');
    server.kill();
    systray.kill();
  }
});

systray.onError((err) => {
  console.error('Systray error:', err);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Received SIGINT, quitting...');
  server.kill();
  systray.kill();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, quitting...');
  server.kill();
  systray.kill();
});

console.log('Better BDSMLR is running. Right-click the system tray icon to open or quit.');
