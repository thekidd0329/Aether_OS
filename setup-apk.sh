#!/usr/bin/env bash

# AetherOS - Turnkey Android APK & Launcher Setup Shell Script
set -e

echo ""
echo "========================================================================"
echo "   AetherOS Turnkey Android APK & Launcher Setup"
echo "========================================================================"
echo ""

# Run the cross-platform Node.js automation script
node scripts/setup-apk.mjs "$@"
