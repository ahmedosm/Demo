// Background script for IT Admin Message Blocker extension

// Initialize extension
chrome.runtime.onInstalled.addListener(function(details) {
    console.log('🛡️ IT Admin Message Blocker installed');
    
    // Set initial storage values
    chrome.storage.local.set({
        hiddenCount: 0,
        isActive: true,
        lastUpdate: Date.now()
    });
    
    // Show welcome notification
    if (details.reason === 'install') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'IT Admin Message Blocker',
            message: 'Extension installed! It will automatically hide blocking messages.'
        });
    }
});

// Handle tab updates to inject content script
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        // Skip chrome:// and extension pages
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
            return;
        }
        
        // Inject content script if not already injected
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).catch(err => {
            // Ignore errors (script might already be injected)
        });
    }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateHiddenCount') {
        chrome.storage.local.get(['hiddenCount'], function(result) {
            const newCount = (result.hiddenCount || 0) + (request.count || 1);
            chrome.storage.local.set({ hiddenCount: newCount });
            
            // Update badge
            chrome.action.setBadgeText({
                text: newCount > 0 ? newCount.toString() : '',
                tabId: sender.tab.id
            });
            chrome.action.setBadgeBackgroundColor({color: '#28a745'});
        });
    }
    
    if (request.action === 'getStats') {
        chrome.storage.local.get(['hiddenCount', 'isActive'], function(result) {
            sendResponse({
                hiddenCount: result.hiddenCount || 0,
                isActive: result.isActive !== false
            });
        });
        return true; // Keep message channel open for async response
    }
});

// Context menu for quick actions
chrome.contextMenus.create({
    id: 'refreshPage',
    title: '🔄 Refresh page (bypass blocking)',
    contexts: ['page']
});

chrome.contextMenus.create({
    id: 'clearData',
    title: '🗑️ Clear browser data',
    contexts: ['page']
});

chrome.contextMenus.create({
    id: 'openIncognito',
    title: '🕵️ Open in incognito',
    contexts: ['page', 'link']
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
        case 'refreshPage':
            chrome.tabs.reload(tab.id);
            break;
            
        case 'clearData':
            chrome.browsingData.remove({
                "since": 0
            }, {
                "cache": true,
                "cookies": true,
                "localStorage": true,
                "serviceWorkers": true
            });
            break;
            
        case 'openIncognito':
            const url = info.linkUrl || info.pageUrl || tab.url;
            chrome.windows.create({
                url: url,
                incognito: true
            });
            break;
    }
});

// Periodic cleanup and monitoring
setInterval(function() {
    // Clean up old data
    chrome.storage.local.get(['lastUpdate'], function(result) {
        const lastUpdate = result.lastUpdate || 0;
        const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        if (lastUpdate < dayAgo) {
            // Reset counter daily
            chrome.storage.local.set({
                hiddenCount: 0,
                lastUpdate: Date.now()
            });
        }
    });
}, 60000); // Check every minute

// Handle extension icon click
chrome.action.onClicked.addListener(function(tab) {
    // Refresh the current page as a quick action
    chrome.tabs.reload(tab.id);
});