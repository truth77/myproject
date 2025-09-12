@echo off
set PORT=3002
set BROWSER=none
cd /d %~dp0client
call npm start
