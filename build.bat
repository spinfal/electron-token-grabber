@echo off
SetLocal EnableDelayedExpansion
call npm i
echo:
echo Packages done installing. Beginning build process...
echo:
echo Provide a Discord Webhook
set /p Input=Webhook URL:
echo:
call node src/build.js %Input%
PAUSE
call npm run make
echo Build complete.
call explorer.exe out\make\squirrel.windows\x64