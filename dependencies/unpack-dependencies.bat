@echo off
echo ===========================================================
echo   AetherOS - Offline Dependency Restorer (Windows)
echo ===========================================================

set SCRIPT_DIR=%~dp0
set ROOT_DIR=%SCRIPT_DIR%..
set ARCHIVE=%SCRIPT_DIR%node_modules_offline.tar.gz

if not exist "%ARCHIVE%" (
  echo Error: %ARCHIVE% not found.
  pause
  exit /b 1
)

echo Extracting offline dependencies into %ROOT_DIR%\node_modules...
tar -xzf "%ARCHIVE%" -C "%ROOT_DIR%"

if %ERRORLEVEL% equ 0 (
  echo [SUCCESS] Offline dependencies are restored to node_modules!
  echo You can now run:
  echo   npm run build
  echo   npm run setup:apk
) else (
  echo [ERROR] Failed to extract archive.
)
echo ===========================================================
pause
