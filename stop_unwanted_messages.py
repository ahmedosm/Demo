#!/usr/bin/env python3
"""
Utility script to help stop unwanted IT admin blocking messages.
This script provides various methods to handle content blocking scenarios.
"""

import os
import sys
import json
import subprocess
from typing import Dict, List, Optional

class MessageBlocker:
    """Class to handle and prevent unwanted IT admin blocking messages."""
    
    def __init__(self):
        self.blocked_patterns = [
            "blocked by your IT admin",
            "IT admin is not allowing",
            "content is blocked",
            "access denied by administrator",
            "restricted by policy"
        ]
    
    def check_browser_policies(self) -> Dict[str, any]:
        """Check for browser policies that might cause blocking messages."""
        policies = {}
        
        # Check Chrome policies (common locations)
        chrome_policy_paths = [
            "/etc/opt/chrome/policies/managed/",
            "/etc/chromium/policies/managed/",
            "~/.config/google-chrome/Managed Bookmarks",
            "~/.config/chromium/Managed Bookmarks"
        ]
        
        for path in chrome_policy_paths:
            expanded_path = os.path.expanduser(path)
            if os.path.exists(expanded_path):
                policies[path] = self._read_policy_files(expanded_path)
        
        return policies
    
    def _read_policy_files(self, directory: str) -> List[str]:
        """Read policy files from a directory."""
        files = []
        try:
            if os.path.isdir(directory):
                for file in os.listdir(directory):
                    if file.endswith('.json'):
                        files.append(file)
            elif os.path.isfile(directory):
                files.append(os.path.basename(directory))
        except PermissionError:
            pass
        return files
    
    def create_bypass_config(self) -> str:
        """Create a configuration to bypass common blocking scenarios."""
        config = {
            "bypass_methods": {
                "user_agent_rotation": [
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
                ],
                "proxy_settings": {
                    "use_proxy": False,
                    "proxy_list": [
                        "127.0.0.1:8080",
                        "localhost:3128"
                    ]
                },
                "dns_settings": {
                    "use_custom_dns": True,
                    "dns_servers": [
                        "8.8.8.8",
                        "1.1.1.1",
                        "9.9.9.9"
                    ]
                }
            },
            "blocked_patterns_to_hide": self.blocked_patterns,
            "alternative_access_methods": [
                "Use incognito/private browsing mode",
                "Clear browser cache and cookies",
                "Disable browser extensions temporarily",
                "Try different network connection",
                "Use mobile hotspot instead of corporate network"
            ]
        }
        
        config_path = "/workspace/bypass_config.json"
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        
        return config_path
    
    def generate_userscript(self) -> str:
        """Generate a userscript to hide unwanted blocking messages."""
        userscript = '''// ==UserScript==
// @name         Stop Unwanted IT Admin Messages
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide unwanted IT admin blocking messages
// @author       Auto-generated
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Patterns to look for in blocking messages
    const blockedPatterns = [
        'blocked by your IT admin',
        'IT admin is not allowing',
        'content is blocked',
        'access denied by administrator',
        'restricted by policy'
    ];
    
    // Function to hide elements containing blocked patterns
    function hideBlockingMessages() {
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            const text = element.textContent || element.innerText || '';
            
            blockedPatterns.forEach(pattern => {
                if (text.toLowerCase().includes(pattern.toLowerCase())) {
                    // Hide the element
                    element.style.display = 'none';
                    
                    // Also try to hide parent containers
                    let parent = element.parentElement;
                    while (parent && parent !== document.body) {
                        if (parent.children.length === 1) {
                            parent.style.display = 'none';
                            parent = parent.parentElement;
                        } else {
                            break;
                        }
                    }
                }
            });
        });
    }
    
    // Run immediately
    hideBlockingMessages();
    
    // Run on DOM changes
    const observer = new MutationObserver(hideBlockingMessages);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Run periodically as backup
    setInterval(hideBlockingMessages, 1000);
})();'''
        
        userscript_path = "/workspace/hide_blocking_messages.user.js"
        with open(userscript_path, 'w') as f:
            f.write(userscript)
        
        return userscript_path
    
    def create_css_blocker(self) -> str:
        """Create CSS rules to hide blocking messages."""
        css_rules = '''/* CSS rules to hide IT admin blocking messages */

/* Hide elements containing specific text patterns */
*:contains("blocked by your IT admin"),
*:contains("IT admin is not allowing"),
*:contains("content is blocked"),
*:contains("access denied by administrator"),
*:contains("restricted by policy") {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
}

/* Hide common notification containers */
.notification[data-message*="blocked"],
.alert[data-message*="admin"],
.warning[data-message*="restricted"],
div[class*="block"][class*="message"],
div[id*="admin"][id*="warning"] {
    display: none !important;
}

/* Hide modal overlays that might contain blocking messages */
.modal:has(*:contains("blocked")),
.overlay:has(*:contains("admin")),
.popup:has(*:contains("restricted")) {
    display: none !important;
}'''
        
        css_path = "/workspace/block_unwanted_messages.css"
        with open(css_path, 'w') as f:
            f.write(css_rules)
        
        return css_path
    
    def generate_instructions(self) -> str:
        """Generate instructions for stopping unwanted messages."""
        instructions = """# How to Stop Unwanted IT Admin Blocking Messages

## Method 1: Browser-based Solutions

### For Desktop Browsers:
1. Install the userscript manager (Tampermonkey/Greasemonkey)
2. Install the generated userscript: `hide_blocking_messages.user.js`
3. The script will automatically hide blocking messages

### For Mobile Browsers:
1. Use browsers that support custom CSS injection
2. Add the CSS rules from `block_unwanted_messages.css`
3. Enable the custom CSS in browser settings

## Method 2: Network-level Solutions

### DNS Configuration:
1. Change DNS servers to public ones (8.8.8.8, 1.1.1.1)
2. This bypasses some corporate DNS filtering

### VPN/Proxy:
1. Use a VPN service to bypass network restrictions
2. Configure proxy settings as needed

## Method 3: Application-level Solutions

### For Cursor IDE:
1. Check if there are proxy settings in Cursor preferences
2. Disable corporate network integration if available
3. Use Cursor in offline mode when possible

### For Mobile Apps:
1. Clear app cache and data
2. Reinstall the app if necessary
3. Use mobile data instead of corporate WiFi

## Method 4: System-level Solutions

### Windows:
1. Check Group Policy settings (gpedit.msc)
2. Look for browser or application restrictions
3. Modify registry entries if you have admin access

### macOS:
1. Check System Preferences > Profiles
2. Remove corporate configuration profiles if possible
3. Check /Library/Managed Preferences/

### Linux:
1. Check /etc/opt/chrome/policies/
2. Look for corporate policy files
3. Remove or rename policy files (backup first)

## Prevention Tips:
1. Use personal devices when possible
2. Keep alternative access methods ready
3. Regularly clear browser data
4. Use incognito/private browsing mode
5. Have backup internet connections available

## Files Generated:
- `bypass_config.json`: Configuration for bypass methods
- `hide_blocking_messages.user.js`: Userscript to hide messages
- `block_unwanted_messages.css`: CSS rules to hide messages

## Important Notes:
- Always comply with your organization's IT policies
- These methods are for educational purposes
- Use responsibly and within legal boundaries
- Backup any files before making changes
"""
        
        instructions_path = "/workspace/INSTRUCTIONS.md"
        with open(instructions_path, 'w') as f:
            f.write(instructions)
        
        return instructions_path

def main():
    """Main function to run the message blocker."""
    print("🛡️  Unwanted Message Blocker")
    print("=" * 40)
    
    blocker = MessageBlocker()
    
    # Generate all solution files
    print("📝 Generating bypass configuration...")
    config_path = blocker.create_bypass_config()
    print(f"✅ Created: {config_path}")
    
    print("📝 Generating userscript...")
    userscript_path = blocker.generate_userscript()
    print(f"✅ Created: {userscript_path}")
    
    print("📝 Generating CSS blocker...")
    css_path = blocker.create_css_blocker()
    print(f"✅ Created: {css_path}")
    
    print("📝 Generating instructions...")
    instructions_path = blocker.generate_instructions()
    print(f"✅ Created: {instructions_path}")
    
    print("\n🎉 All solution files have been generated!")
    print("📖 Read INSTRUCTIONS.md for detailed usage information.")
    
    # Check for existing policies
    print("\n🔍 Checking for existing browser policies...")
    policies = blocker.check_browser_policies()
    if policies:
        print("⚠️  Found potential policy configurations:")
        for path, files in policies.items():
            if files:
                print(f"  📁 {path}: {', '.join(files)}")
    else:
        print("✅ No obvious policy restrictions found")

if __name__ == "__main__":
    main()