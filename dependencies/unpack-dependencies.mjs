import { existsSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const ARCHIVE = join(ROOT_DIR, 'dependencies', 'node_modules_offline.tar.gz');
const TARGET = join(ROOT_DIR, 'node_modules');

console.log('===========================================================');
console.log('  AetherOS - Offline Dependency Restorer');
console.log('===========================================================');

if (!existsSync(ARCHIVE)) {
  console.error(`❌ Archive not found at: ${ARCHIVE}`);
  console.error('Please ensure dependencies/node_modules_offline.tar.gz exists.');
  process.exit(1);
}

console.log(`📦 Unpacking offline dependencies from:\n   ${ARCHIVE}\n   into ./node_modules...`);

try {
  // Use native tar (available on modern Windows 10/11, macOS, and Linux)
  execSync(`tar -xzf "${ARCHIVE}" -C "${ROOT_DIR}"`, { stdio: 'inherit' });
  console.log('✅ Successfully unpacked all dependencies!');
  console.log('You can now run:');
  console.log('   npm run build');
  console.log('   npm run setup:apk');
  console.log('===========================================================');
} catch (err) {
  console.error('❌ Failed to unpack using tar command.', err);
  process.exit(1);
}
