#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync, rmSync, writeFileSync, readFileSync, renameSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = process.cwd();
const DIST_DIR = join(ROOT, 'dist-desktop');
const NODE_VERSION = '25.4.0';

// Clean dist directory
if (existsSync(DIST_DIR)) {
    rmSync(DIST_DIR, { recursive: true });
}
mkdirSync(DIST_DIR, { recursive: true });

// Build the web app
console.log('Building server...');
execSync('pnpm build', { stdio: 'inherit', cwd: ROOT });

// Copy server output
console.log('Copying server output...');
const serverOutput = join(ROOT, '.output', 'server');
const serverDest = join(DIST_DIR, '.output', 'server');
cpSync(serverOutput, serverDest, { recursive: true, dereference: true });

// Copy public assets
const publicOutput = join(ROOT, '.output', 'public');
const publicDest = join(DIST_DIR, '.output', 'public');
cpSync(publicOutput, publicDest, { recursive: true, dereference: true });

// Copy drizzle migrations
const drizzleSrc = join(ROOT, 'drizzle');
const drizzleDest = join(DIST_DIR, 'drizzle');
if (existsSync(drizzleSrc)) {
    cpSync(drizzleSrc, drizzleDest, { recursive: true, dereference: true });
}

// Copy desktop wrapper
const wrapperSrc = join(ROOT, 'desktop-wrapper.mjs');
const wrapperDest = join(DIST_DIR, 'desktop-wrapper.mjs');
cpSync(wrapperSrc, wrapperDest);

// Copy icon
const iconSrc = join(ROOT, 'src-tauri', 'icons', 'icon.png');
const iconDest = join(DIST_DIR, 'icon.png');
if (existsSync(iconSrc)) {
    cpSync(iconSrc, iconDest);
}

// Download Windows Node.js binary
const nodeExe = join(DIST_DIR, 'node.exe');
console.log('Downloading Windows Node.js binary...');
const url = `https://nodejs.org/dist/v${NODE_VERSION}/win-x64/node.exe`;
try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download node.exe: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    writeFileSync(nodeExe, Buffer.from(buffer));
    console.log('Downloaded node.exe');
} catch (e) {
    console.error('Failed to download node.exe:', e.message);
    console.error('Please download it manually from:', url);
    console.error('And place it at:', nodeExe);
    process.exit(1);
}

// Download Windows Node.js binary (the one that supports SEA, includes postject)
// Actually, we need the full Windows Node.js binary to use postject
// But we're on Linux, so we can't run postject on Windows node.exe directly
// We need to use the postject Node.js package

// For SEA, we need to create the blob first
console.log('Creating SEA blob...');
execSync('node --experimental-sea-config sea-config.json', { stdio: 'inherit', cwd: ROOT });

// Copy the blob to dist
const blobSrc = join(ROOT, 'sea-prep.blob');
const blobDest = join(DIST_DIR, 'sea-prep.blob');
cpSync(blobSrc, blobDest);

// Now we need to inject the blob into node.exe
// We can use postject from our current Node.js installation
// But postject needs to modify the PE binary on Windows
// Actually, postject can modify PE binaries from any platform

console.log('Injecting SEA blob into node.exe...');
try {
    execSync(
        `npx postject ${nodeExe} NODE_SEA_BLOB ${blobDest} --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA`,
        { stdio: 'inherit', cwd: ROOT }
    );
    console.log('SEA blob injected successfully');
} catch (e) {
    console.error('Failed to inject SEA blob:', e.message);
    console.error('You may need to run this script on Windows, or use a Windows-compatible postject');
    process.exit(1);
}

// Rename the executable
const finalExe = join(DIST_DIR, 'BetterBDSMLR.exe');
renameSync(nodeExe, finalExe);

// Create a minimal node_modules with systray using pnpm with hoisted linker
// This creates a flat node_modules that works without symlinks
console.log('Installing systray dependencies...');
const tmpDir = join(DIST_DIR, '.tmp-pnpm');
mkdirSync(tmpDir, { recursive: true });
writeFileSync(join(tmpDir, 'package.json'), JSON.stringify({
    name: 'tmp',
    version: '1.0.0',
    dependencies: {
        systray: '^1.0.5'
    }
}, null, 2));
writeFileSync(join(tmpDir, '.npmrc'), 'node-linker=hoisted\n');

execSync('pnpm install', { stdio: 'inherit', cwd: tmpDir });

// Copy the flat node_modules to dist
const tmpNodeModules = join(tmpDir, 'node_modules');
const distNodeModules = join(DIST_DIR, 'node_modules');
mkdirSync(distNodeModules, { recursive: true });

for (const entry of readdirSync(tmpNodeModules)) {
    if (entry === '.modules.yaml' || entry === '.pnpm') continue;
    const src = join(tmpNodeModules, entry);
    const dest = join(distNodeModules, entry);
    cpSync(src, dest, { recursive: true, dereference: true });
}

// Clean up temp dir
rmSync(tmpDir, { recursive: true });

// Create a package.json for the dist directory
const distPackageJson = {
    name: 'better-bdsmlr-desktop',
    version: '0.3.0',
    type: 'module',
    main: 'desktop-wrapper.mjs',
};
writeFileSync(join(DIST_DIR, 'package.json'), JSON.stringify(distPackageJson, null, 2));

console.log('');
console.log('Build complete!');
console.log('');
console.log('The desktop app is ready at:', DIST_DIR);
console.log('');
console.log('To package into an installer:');
console.log('  1. Zip the dist-desktop folder');
console.log('  2. Or use Inno Setup to create an installer');
console.log('');
console.log('The user can run BetterBDSMLR.exe to start the app.');
console.log('');
