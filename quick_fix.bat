@echo off
REM Quick fix script for Windows laptops to stop IT admin blocking messages
echo.
echo ========================================
echo  IT Admin Message Blocker - Quick Fix
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running as Administrator... Good!
) else (
    echo WARNING: Not running as Administrator. Some fixes may not work.
    echo Right-click and "Run as Administrator" for best results.
    echo.
)

echo Choose a quick fix option:
echo.
echo 1. Clear all browser data (Chrome, Edge, Firefox)
echo 2. Reset network settings (flush DNS, reset TCP/IP)
echo 3. Disable Windows SmartScreen temporarily
echo 4. Open network settings to change DNS
echo 5. Kill and restart browsers
echo 6. Check and disable proxy settings
echo 7. Run all safe fixes automatically
echo 8. Exit
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto clear_browsers
if "%choice%"=="2" goto reset_network
if "%choice%"=="3" goto disable_smartscreen
if "%choice%"=="4" goto open_network_settings
if "%choice%"=="5" goto restart_browsers
if "%choice%"=="6" goto disable_proxy
if "%choice%"=="7" goto run_all
if "%choice%"=="8" goto exit
goto invalid_choice

:clear_browsers
echo.
echo Clearing browser data...
REM Clear Chrome data
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default" (
    taskkill /f /im chrome.exe >nul 2>&1
    timeout /t 2 >nul
    rmdir /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" >nul 2>&1
    del /f /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cookies" >nul 2>&1
    del /f /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\History" >nul 2>&1
    echo Chrome data cleared.
)

REM Clear Edge data
if exist "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default" (
    taskkill /f /im msedge.exe >nul 2>&1
    timeout /t 2 >nul
    rmdir /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" >nul 2>&1
    del /f /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cookies" >nul 2>&1
    echo Edge data cleared.
)

REM Clear Firefox data
if exist "%APPDATA%\Mozilla\Firefox\Profiles" (
    taskkill /f /im firefox.exe >nul 2>&1
    timeout /t 2 >nul
    for /d %%i in ("%APPDATA%\Mozilla\Firefox\Profiles\*") do (
        rmdir /s /q "%%i\cache2" >nul 2>&1
        del /f /q "%%i\cookies.sqlite" >nul 2>&1
    )
    echo Firefox data cleared.
)

echo Browser data clearing completed!
goto menu

:reset_network
echo.
echo Resetting network settings...
ipconfig /flushdns
ipconfig /release
ipconfig /renew
netsh winsock reset
netsh int ip reset
echo Network settings reset! Restart may be required.
goto menu

:disable_smartscreen
echo.
echo Temporarily disabling Windows SmartScreen...
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer" /v SmartScreenEnabled /t REG_SZ /d "Off" /f >nul 2>&1
if %errorLevel% == 0 (
    echo SmartScreen disabled successfully.
    echo NOTE: Remember to re-enable it later for security!
) else (
    echo Failed to disable SmartScreen. Run as Administrator.
)
goto menu

:open_network_settings
echo.
echo Opening network settings...
echo Change your DNS to: 8.8.8.8 and 8.8.4.4 (Google DNS)
echo Or use: 1.1.1.1 and 1.0.0.1 (Cloudflare DNS)
start ms-settings:network-wifi
goto menu

:restart_browsers
echo.
echo Killing and restarting browsers...
taskkill /f /im chrome.exe >nul 2>&1
taskkill /f /im msedge.exe >nul 2>&1
taskkill /f /im firefox.exe >nul 2>&1
taskkill /f /im opera.exe >nul 2>&1
timeout /t 3
echo Browsers killed. You can now restart them manually.
goto menu

:disable_proxy
echo.
echo Disabling proxy settings...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer /t REG_SZ /d "" /f >nul 2>&1
echo Proxy settings disabled.
goto menu

:run_all
echo.
echo Running all safe automatic fixes...
echo.

REM Clear browser data
echo [1/4] Clearing browser data...
taskkill /f /im chrome.exe >nul 2>&1
taskkill /f /im msedge.exe >nul 2>&1
taskkill /f /im firefox.exe >nul 2>&1
timeout /t 2 >nul

REM Reset network
echo [2/4] Flushing DNS...
ipconfig /flushdns >nul

REM Disable proxy
echo [3/4] Disabling proxy...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f >nul 2>&1

REM Clear temp files
echo [4/4] Clearing temp files...
del /f /s /q "%TEMP%\*" >nul 2>&1
del /f /s /q "%TMP%\*" >nul 2>&1

echo.
echo All automatic fixes completed!
echo Try accessing Cursor now, or use a VPN/mobile hotspot.
goto menu

:invalid_choice
echo Invalid choice. Please try again.
goto menu

:menu
echo.
echo Press any key to return to menu or Ctrl+C to exit...
pause >nul
cls
goto start

:exit
echo.
echo Additional tips:
echo - Try using mobile hotspot instead of WiFi
echo - Use incognito/private browsing mode
echo - Install a VPN (ExpressVPN, NordVPN, etc.)
echo - Try different browsers (Firefox, Opera, Brave)
echo - Contact IT to whitelist Cursor if possible
echo.
echo Goodbye!
pause