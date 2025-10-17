#!/bin/bash

# Quick fix script for Linux/macOS laptops to stop IT admin blocking messages

echo "========================================"
echo " IT Admin Message Blocker - Quick Fix"
echo "========================================"
echo

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
else
    OS="Unknown"
fi

echo "Detected OS: $OS"
echo

show_menu() {
    echo "Choose a quick fix option:"
    echo
    echo "1. Clear all browser data"
    echo "2. Reset network settings (flush DNS)"
    echo "3. Kill and restart browsers"
    echo "4. Change DNS to public servers"
    echo "5. Check and remove corporate policies"
    echo "6. Disable proxy settings"
    echo "7. Run all safe fixes automatically"
    echo "8. Exit"
    echo
    read -p "Enter your choice (1-8): " choice
}

clear_browsers() {
    echo
    echo "Clearing browser data..."
    
    # Kill browsers first
    pkill -f chrome 2>/dev/null
    pkill -f firefox 2>/dev/null
    pkill -f safari 2>/dev/null
    pkill -f edge 2>/dev/null
    sleep 2
    
    if [[ "$OS" == "macOS" ]]; then
        # macOS paths
        rm -rf ~/Library/Caches/Google/Chrome/* 2>/dev/null
        rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Cookies 2>/dev/null
        rm -rf ~/Library/Caches/com.apple.Safari/* 2>/dev/null
        rm -rf ~/Library/Safari/Databases/* 2>/dev/null
        echo "macOS browser data cleared."
    else
        # Linux paths
        rm -rf ~/.cache/google-chrome/* 2>/dev/null
        rm -rf ~/.config/google-chrome/Default/Cookies 2>/dev/null
        rm -rf ~/.mozilla/firefox/*/cache2/* 2>/dev/null
        rm -rf ~/.cache/mozilla/* 2>/dev/null
        echo "Linux browser data cleared."
    fi
    
    echo "Browser data clearing completed!"
}

reset_network() {
    echo
    echo "Resetting network settings..."
    
    if [[ "$OS" == "macOS" ]]; then
        sudo dscacheutil -flushcache
        sudo killall -HUP mDNSResponder
        echo "macOS DNS cache flushed."
    else
        sudo systemctl flush-dns 2>/dev/null || sudo service systemd-resolved restart 2>/dev/null
        echo "Linux DNS cache flushed."
    fi
}

restart_browsers() {
    echo
    echo "Killing browsers..."
    pkill -f chrome 2>/dev/null
    pkill -f firefox 2>/dev/null
    pkill -f safari 2>/dev/null
    pkill -f edge 2>/dev/null
    pkill -f opera 2>/dev/null
    sleep 3
    echo "Browsers killed. You can now restart them manually."
}

change_dns() {
    echo
    echo "Changing DNS to public servers..."
    echo "This will set DNS to Google (8.8.8.8) and Cloudflare (1.1.1.1)"
    
    if [[ "$OS" == "macOS" ]]; then
        echo "For macOS, please manually change DNS in System Preferences > Network"
        echo "Set DNS servers to: 8.8.8.8, 1.1.1.1, 8.8.4.4, 1.0.0.1"
        open /System/Library/PreferencePanes/Network.prefPane 2>/dev/null
    else
        # Linux - try different methods
        if command -v systemd-resolve >/dev/null 2>&1; then
            echo "Using systemd-resolved..."
            sudo mkdir -p /etc/systemd/resolved.conf.d/
            echo -e "[Resolve]\nDNS=8.8.8.8 1.1.1.1 8.8.4.4 1.0.0.1" | sudo tee /etc/systemd/resolved.conf.d/dns.conf
            sudo systemctl restart systemd-resolved
        elif command -v nmcli >/dev/null 2>&1; then
            echo "Using NetworkManager..."
            nmcli device show | grep "GENERAL.CONNECTION" | head -1 | awk '{print $2}' | xargs -I {} nmcli connection modify {} ipv4.dns "8.8.8.8,1.1.1.1"
        else
            echo "Please manually set DNS in your network settings to:"
            echo "Primary: 8.8.8.8, Secondary: 1.1.1.1"
        fi
    fi
}

remove_policies() {
    echo
    echo "Checking for corporate browser policies..."
    
    if [[ "$OS" == "macOS" ]]; then
        echo "Checking macOS configuration profiles..."
        profiles list 2>/dev/null | grep -i "chrome\|firefox\|safari\|policy"
        echo
        echo "To remove corporate profiles, run:"
        echo "sudo profiles remove -identifier <profile-identifier>"
    else
        echo "Checking Linux Chrome policies..."
        if [ -d "/etc/opt/chrome/policies/managed/" ]; then
            echo "Found Chrome policies:"
            ls -la /etc/opt/chrome/policies/managed/
            echo
            echo "To backup and remove, run:"
            echo "sudo cp -r /etc/opt/chrome/policies/managed/ ~/chrome_policies_backup/"
            echo "sudo rm /etc/opt/chrome/policies/managed/*.json"
        fi
        
        if [ -d "/etc/chromium/policies/managed/" ]; then
            echo "Found Chromium policies:"
            ls -la /etc/chromium/policies/managed/
        fi
        
        if [ ! -d "/etc/opt/chrome/policies/managed/" ] && [ ! -d "/etc/chromium/policies/managed/" ]; then
            echo "No obvious browser policies found."
        fi
    fi
}

disable_proxy() {
    echo
    echo "Disabling proxy settings..."
    
    if [[ "$OS" == "macOS" ]]; then
        networksetup -setwebproxystate "Wi-Fi" off 2>/dev/null
        networksetup -setsecurewebproxystate "Wi-Fi" off 2>/dev/null
        echo "macOS proxy settings disabled for Wi-Fi."
    else
        # Linux - unset proxy environment variables
        unset http_proxy
        unset https_proxy
        unset HTTP_PROXY
        unset HTTPS_PROXY
        echo "Proxy environment variables cleared."
        
        # Also try gsettings for GNOME
        if command -v gsettings >/dev/null 2>&1; then
            gsettings set org.gnome.system.proxy mode 'none' 2>/dev/null
            echo "GNOME proxy settings disabled."
        fi
    fi
}

run_all_fixes() {
    echo
    echo "Running all safe automatic fixes..."
    echo
    
    echo "[1/5] Killing browsers..."
    pkill -f chrome 2>/dev/null
    pkill -f firefox 2>/dev/null
    pkill -f safari 2>/dev/null
    sleep 2
    
    echo "[2/5] Flushing DNS..."
    if [[ "$OS" == "macOS" ]]; then
        sudo dscacheutil -flushcache 2>/dev/null
        sudo killall -HUP mDNSResponder 2>/dev/null
    else
        sudo systemctl flush-dns 2>/dev/null || sudo service systemd-resolved restart 2>/dev/null
    fi
    
    echo "[3/5] Disabling proxy..."
    unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY 2>/dev/null
    
    echo "[4/5] Clearing browser cache..."
    if [[ "$OS" == "macOS" ]]; then
        rm -rf ~/Library/Caches/Google/Chrome/* 2>/dev/null
        rm -rf ~/Library/Caches/com.apple.Safari/* 2>/dev/null
    else
        rm -rf ~/.cache/google-chrome/* 2>/dev/null
        rm -rf ~/.cache/mozilla/* 2>/dev/null
    fi
    
    echo "[5/5] Clearing temp files..."
    rm -rf /tmp/* 2>/dev/null
    
    echo
    echo "All automatic fixes completed!"
    echo "Try accessing Cursor now, or use a VPN/mobile hotspot."
}

# Main menu loop
while true; do
    show_menu
    
    case $choice in
        1)
            clear_browsers
            ;;
        2)
            reset_network
            ;;
        3)
            restart_browsers
            ;;
        4)
            change_dns
            ;;
        5)
            remove_policies
            ;;
        6)
            disable_proxy
            ;;
        7)
            run_all_fixes
            ;;
        8)
            echo
            echo "Additional tips:"
            echo "- Try using mobile hotspot instead of WiFi"
            echo "- Use incognito/private browsing mode"
            echo "- Install a VPN (ExpressVPN, NordVPN, etc.)"
            echo "- Try different browsers (Firefox, Opera, Brave)"
            echo "- Contact IT to whitelist Cursor if possible"
            echo
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
    
    echo
    echo "Press Enter to return to menu..."
    read
    clear
done