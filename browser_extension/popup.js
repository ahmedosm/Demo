// Popup script for the IT Admin Message Blocker extension

document.addEventListener('DOMContentLoaded', function() {
    // Load and display stats
    loadStats();
    
    // Set up event listeners
    document.getElementById('refreshBtn').addEventListener('click', refreshCurrentPage);
    document.getElementById('clearDataBtn').addEventListener('click', clearBrowserData);
    document.getElementById('openOptionsBtn').addEventListener('click', openSolutions);
    
    // Update stats every 2 seconds
    setInterval(loadStats, 2000);
});

function loadStats() {
    chrome.storage.local.get(['hiddenCount'], function(result) {
        const count = result.hiddenCount || 0;
        document.getElementById('hiddenCount').textContent = count;
        
        // Update status based on activity
        const statusElement = document.getElementById('status');
        if (count > 0) {
            statusElement.textContent = 'Active (Blocking)';
            statusElement.style.color = '#28a745';
        } else {
            statusElement.textContent = 'Active (Monitoring)';
            statusElement.style.color = '#007cba';
        }
    });
}

function refreshCurrentPage() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.reload(tabs[0].id);
        window.close();
    });
}

function clearBrowserData() {
    if (confirm('This will clear all browser data (cookies, cache, etc.). Continue?')) {
        chrome.browsingData.remove({
            "since": 0
        }, {
            "appcache": true,
            "cache": true,
            "cookies": true,
            "downloads": false,
            "fileSystems": true,
            "formData": true,
            "history": false,
            "indexedDB": true,
            "localStorage": true,
            "serverBoundCertificates": true,
            "passwords": false,
            "pluginData": true,
            "serviceWorkers": true,
            "webSQL": true
        }, function() {
            alert('Browser data cleared! Please refresh the page.');
            window.close();
        });
    }
}

function openSolutions() {
    // Create a new tab with solutions
    const solutionsHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>IT Admin Message Solutions</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            h2 { color: #007cba; border-bottom: 2px solid #007cba; padding-bottom: 5px; }
            .solution { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .quick-fix { background: #d4edda; border-left: 4px solid #28a745; }
            code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <h1>🛡️ Stop IT Admin Blocking Messages - Solutions</h1>
        
        <div class="warning">
            <strong>⚠️ Important:</strong> Always comply with your organization's IT policies. Use these methods responsibly.
        </div>
        
        <h2>🚀 Quick Fixes (Try First)</h2>
        
        <div class="solution quick-fix">
            <h3>1. Switch Networks</h3>
            <p>Disconnect from corporate WiFi and use:</p>
            <ul>
                <li>Mobile hotspot from your phone</li>
                <li>Personal home network</li>
                <li>Public WiFi (coffee shop, library)</li>
            </ul>
        </div>
        
        <div class="solution quick-fix">
            <h3>2. Use Different Browser</h3>
            <ul>
                <li>Chrome Incognito: <code>Ctrl+Shift+N</code></li>
                <li>Firefox Private: <code>Ctrl+Shift+P</code></li>
                <li>Try Edge, Brave, or Opera</li>
            </ul>
        </div>
        
        <div class="solution quick-fix">
            <h3>3. Clear All Browser Data</h3>
            <p>Press <code>Ctrl+Shift+Delete</code> and select "All time"</p>
        </div>
        
        <h2>🔧 Advanced Solutions</h2>
        
        <div class="solution">
            <h3>Windows Solutions</h3>
            <ul>
                <li><strong>Group Policy:</strong> Run <code>gpedit.msc</code> and check browser policies</li>
                <li><strong>Registry:</strong> Check <code>HKLM\\SOFTWARE\\Policies\\Google\\Chrome</code></li>
                <li><strong>Hosts File:</strong> Edit <code>C:\\Windows\\System32\\drivers\\etc\\hosts</code></li>
            </ul>
        </div>
        
        <div class="solution">
            <h3>macOS Solutions</h3>
            <ul>
                <li><strong>Profiles:</strong> System Preferences > Profiles (remove corporate ones)</li>
                <li><strong>DNS:</strong> Network Preferences > Advanced > DNS (use 8.8.8.8)</li>
                <li><strong>Terminal:</strong> <code>sudo profiles list</code></li>
            </ul>
        </div>
        
        <div class="solution">
            <h3>Linux Solutions</h3>
            <ul>
                <li><strong>Chrome Policies:</strong> <code>/etc/opt/chrome/policies/managed/</code></li>
                <li><strong>DNS:</strong> Edit <code>/etc/systemd/resolved.conf</code></li>
                <li><strong>Firewall:</strong> <code>sudo ufw allow out 80,443</code></li>
            </ul>
        </div>
        
        <h2>🌐 Alternative Access Methods</h2>
        
        <div class="solution">
            <h3>VPN Solutions</h3>
            <ul>
                <li>ExpressVPN, NordVPN, Surfshark</li>
                <li>Free: ProtonVPN, Windscribe</li>
                <li>Browser VPN: Opera built-in VPN</li>
            </ul>
        </div>
        
        <div class="solution">
            <h3>Proxy Methods</h3>
            <ul>
                <li>Web proxies: hide.me, proxysite.com</li>
                <li>SOCKS proxy configuration</li>
                <li>Browser proxy settings</li>
            </ul>
        </div>
        
        <div class="solution">
            <h3>Alternative Platforms</h3>
            <ul>
                <li>GitHub Codespaces</li>
                <li>VS Code with Cursor extension</li>
                <li>Replit, CodeSandbox</li>
                <li>Use personal device/laptop</li>
            </ul>
        </div>
        
        <h2>📱 If All Else Fails</h2>
        
        <div class="solution">
            <ul>
                <li><strong>Personal Device:</strong> Use your own laptop/computer</li>
                <li><strong>Remote Access:</strong> TeamViewer to personal computer</li>
                <li><strong>Mobile Development:</strong> Use tablet/phone</li>
                <li><strong>Request Whitelist:</strong> Ask IT to allow Cursor</li>
            </ul>
        </div>
        
        <p><em>This extension will continue to automatically hide blocking messages while you try these solutions.</em></p>
    </body>
    </html>
    `;
    
    const blob = new Blob([solutionsHTML], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    chrome.tabs.create({url: url});
}