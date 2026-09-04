#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." >/dev/null 2>&1 && pwd)"
ARCHIVE="$DIR/dependencies/node_modules_offline.tar.gz"

echo "==========================================================="
echo "  AetherOS - Offline Dependency Restorer (Shell)"
echo "==========================================================="

if [ ! -f "$ARCHIVE" ]; then
  echo "❌ Error: $ARCHIVE not found."
  exit 1
fi

echo "📦 Extracting offline dependencies into $DIR/node_modules..."
tar -xzf "$ARCHIVE" -C "$DIR"

echo "✅ Done! Offline dependencies are restored to ./node_modules."
echo "You can now run:"
echo "   npm run build"
echo "   npm run setup:apk"
echo "==========================================================="
