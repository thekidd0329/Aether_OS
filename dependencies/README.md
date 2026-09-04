# AetherOS - Offline Dependencies & APK Build Kit

This folder contains pre-packaged offline dependencies and build assets for environments that cannot connect to the npm registry or need local Gradle/Android SDK build support.

---

## 📦 What's Inside This Directory

| File / Folder | Purpose |
| :--- | :--- |
| `node_modules_offline.tar.gz` | Complete offline snapshot of all npm dependencies (React, Capacitor, Tailwind, Motion, Lucide, etc.) |
| `gradle/gradle-8.14.3-bin.zip` | Offline Gradle 8.14.3 distribution binary required by Capacitor Android |
| `unpack-dependencies.mjs` | Cross-platform Node.js script to restore dependencies into `./node_modules` |
| `unpack-dependencies.sh` | 1-click Bash script for Linux & macOS |
| `unpack-dependencies.bat` | 1-click Batch script for Windows |
| `README.md` | This documentation |

---

## 🚀 Quickstart: Restoring Dependencies Without Internet

### On Windows
Double-click `dependencies\unpack-dependencies.bat` or open Command Prompt:
```cmd
dependencies\unpack-dependencies.bat
```

### On macOS / Linux
Run the shell script:
```bash
./dependencies/unpack-dependencies.sh
```

### Cross-Platform via Node.js
```bash
node dependencies/unpack-dependencies.mjs
```

Once extracted, `./node_modules` will be fully populated with all packages, TypeScript types, and executables.

---

## 📱 Compiling the Android APK

The project already includes the full native Android container in `./android`, pre-configured as an Android Home Launcher with all necessary hardware permissions.

### Option A: Using Android Studio (Recommended)
1. Open **Android Studio**.
2. Click **Open** and select the `android` folder in this project.
3. Android Studio will automatically detect the SDK and build files.
4. From the top menu, select:
   **Build > Build Bundle(s) / APK(s) > Build APK(s)**
5. Once complete, click **locate** to find `app-debug.apk`.

### Option B: Using Gradle via Terminal
If you have Java (JDK 17 or higher) and Android SDK installed on your system:
```bash
cd android
./gradlew assembleDebug
```
(On Windows: `gradlew.bat assembleDebug`)

Your compiled APK will be at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📲 Installing to Your Android Phone

1. Connect your phone via USB with **USB Debugging** enabled in Developer Options.
2. Run:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```
3. To set AetherOS as your default home screen:
   Go to **Settings > Apps > Default Apps > Home App** and select **AetherOS**.
