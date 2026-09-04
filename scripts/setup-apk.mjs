#!/usr/bin/env node

/**
 * AetherOS - Turnkey Android APK & Launcher Setup Engine
 *
 * This script automates:
 * 1. Installing Capacitor core, CLI, and Android runtime.
 * 2. Compiling the production web application into /dist.
 * 3. Scaffolding the native Android project via Capacitor.
 * 4. Injecting the Android Home Launcher intent filters & hardware permissions into AndroidManifest.xml.
 * 5. Building the debug APK via Gradle (if Android SDK / Java is present).
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const ANDROID_DIR = join(ROOT_DIR, 'android');
const MANIFEST_PATH = join(ANDROID_DIR, 'app', 'src', 'main', 'AndroidManifest.xml');

const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

function log(msg, color = COLORS.cyan) {
  console.log(`${color}${COLORS.bold}[AetherOS APK Builder]${COLORS.reset} ${msg}`);
}

function run(command, description) {
  log(`${description}... ${COLORS.dim}(${command})${COLORS.reset}`);
  try {
    execSync(command, { stdio: 'inherit', cwd: ROOT_DIR });
    return true;
  } catch (err) {
    console.error(`${COLORS.yellow}⚠️ Warning during: ${description}${COLORS.reset}`);
    return false;
  }
}

async function main() {
  console.log(`
${COLORS.cyan}========================================================================
   ___       __  __                ____  _____       ___   ____  __ __
  / _ | ___ / /_/ /  ___ ____  ___/ / / / / _ \\ ___ / _ | / _ \\/ //_/
 / __ |/ -_) __/ _ \\/ -_) __/ _  / /_/ / // // -_) __ |/ ___/ ,<   
/_/ |_|\\__/\\__/_//_/\\__/_/    \\_,_/\\____/____(_)__/_/ |_/_/  /_/|_|  
========================================================================${COLORS.reset}
`);

  // Step 1: Ensure Capacitor packages are installed
  log('Verifying Capacitor dependencies in package.json...');
  const pkgJsonPath = join(ROOT_DIR, 'package.json');
  let pkg = {};
  if (existsSync(pkgJsonPath)) {
    pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
  }

  const needsDeps =
    !pkg.dependencies?.['@capacitor/core'] ||
    !pkg.dependencies?.['@capacitor/android'] ||
    !pkg.devDependencies?.['@capacitor/cli'];

  if (needsDeps) {
    log('Installing @capacitor/core, @capacitor/android, and @capacitor/cli...', COLORS.magenta);
    run('npm install @capacitor/core @capacitor/android && npm install -D @capacitor/cli', 'Installing Capacitor packages');
  } else {
    log('Capacitor packages already present.', COLORS.green);
  }

  // Step 2: Compile Production Web Artifacts
  log('Building optimized production bundle with Vite...', COLORS.cyan);
  const buildSuccess = run('npm run build', 'Compiling web build');
  if (!buildSuccess) {
    console.error('Failed to compile production bundle. Please fix build errors first.');
    process.exit(1);
  }

  // Step 3: Add or Sync Android Native Platform
  if (!existsSync(ANDROID_DIR)) {
    log('Scaffolding native Android project container...', COLORS.magenta);
    run('npx cap add android', 'Adding Android platform');
  } else {
    log('Syncing web assets to existing Android container...', COLORS.green);
    run('npx cap sync android', 'Syncing Capacitor Android');
  }

  // Step 4: Inject Launcher Intent & Permissions into AndroidManifest.xml
  if (existsSync(MANIFEST_PATH)) {
    log('Injecting Android Home Launcher Intent & Permissions into AndroidManifest.xml...', COLORS.cyan);
    let manifest = readFileSync(MANIFEST_PATH, 'utf8');

    // 4a. Permissions
    const permissionsToAdd = [
      '<uses-permission android:name="android.permission.INTERNET" />',
      '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />',
      '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
      '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
      '<uses-permission android:name="android.permission.ACCESS_MOCK_LOCATION" />',
      '<uses-permission android:name="android.permission.SEND_SMS" />',
      '<uses-permission android:name="android.permission.READ_SMS" />',
      '<uses-permission android:name="android.permission.RECEIVE_SMS" />',
      '<uses-permission android:name="android.permission.CALL_PHONE" />',
      '<uses-permission android:name="android.permission.READ_CONTACTS" />',
      '<uses-permission android:name="android.permission.VIBRATE" />',
      '<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />',
      '<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />'
    ];

    permissionsToAdd.forEach((perm) => {
      if (!manifest.includes(perm)) {
        manifest = manifest.replace('<application', `    ${perm}\n    <application`);
      }
    });

    // 4b. Launcher Intent Filter
    const launcherIntent = `
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.HOME" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>`;

    if (!manifest.includes('android.intent.category.HOME')) {
      // Find MainActivity intent-filter or closing tag
      if (manifest.includes('android.intent.action.MAIN')) {
        manifest = manifest.replace(
          '<category android:name="android.intent.category.LAUNCHER" />',
          '<category android:name="android.intent.category.LAUNCHER" />\n                <category android:name="android.intent.category.HOME" />\n                <category android:name="android.intent.category.DEFAULT" />'
        );
      }
    }

    // 4c. Set singleTask & stateNotNeeded for proper Home Launcher lifecycle
    if (!manifest.includes('android:launchMode="singleTask"')) {
      manifest = manifest.replace(
        '<activity',
        '<activity\n            android:launchMode="singleTask"\n            android:stateNotNeeded="true"'
      );
    }

    writeFileSync(MANIFEST_PATH, manifest, 'utf8');
    log('Successfully patched AndroidManifest.xml for full Android Launcher support!', COLORS.green);
  }

  // Step 5: Check if direct APK assembly is requested
  const shouldAssemble = process.argv.includes('--build') || process.argv.includes('--assemble');

  if (shouldAssemble) {
    log('Attempting direct Gradle APK assembly...', COLORS.cyan);
    const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
    try {
      execSync(`${gradlew} assembleDebug`, { cwd: ANDROID_DIR, stdio: 'inherit' });
      const apkPath = join(ANDROID_DIR, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
      if (existsSync(apkPath)) {
        console.log(`
${COLORS.green}${COLORS.bold}🎉 SUCCESS! APK BUILT DIRECTLY:${COLORS.reset}
${COLORS.cyan}${apkPath}${COLORS.reset}

To install on your connected phone right now:
  ${COLORS.yellow}adb install -r ${apkPath}${COLORS.reset}
`);
        return;
      }
    } catch (e) {
      log('Gradle build skipped or Android SDK not found in path. Proceeding to Android Studio / CLI instructions.', COLORS.yellow);
    }
  }

  // Print friendly completion summary
  console.log(`
${COLORS.green}${COLORS.bold}✅ AetherOS Android Native Packaging is Ready!${COLORS.reset}

${COLORS.bold}Next Steps to run on your phone:${COLORS.reset}
1. Open the project directly in Android Studio:
   ${COLORS.cyan}npx cap open android${COLORS.reset}
   Then click ${COLORS.bold}'Build' -> 'Build Bundle(s) / APK(s)' -> 'Build APK(s)'${COLORS.reset}.

2. OR assemble debug APK directly from terminal:
   ${COLORS.cyan}cd android && ./gradlew assembleDebug${COLORS.reset}
   Your APK will be ready at:
   ${COLORS.yellow}android/app/build/outputs/apk/debug/app-debug.apk${COLORS.reset}

3. To install directly to your plugged-in Android device via USB:
   ${COLORS.cyan}adb install android/app/build/outputs/apk/debug/app-debug.apk${COLORS.reset}

4. Set AetherOS as your default Android Launcher:
   On your phone, go to:
   ${COLORS.dim}Settings -> Apps -> Default Apps -> Home App -> Select "AetherOS"${COLORS.reset}
========================================================================
`);
}

main().catch((err) => {
  console.error('Fatal error during setup-apk:', err);
  process.exit(1);
});
