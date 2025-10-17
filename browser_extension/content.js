// Content script to hide IT admin blocking messages
(function() {
    'use strict';
    
    // Comprehensive list of blocking message patterns
    const blockingPatterns = [
        'blocked by your IT admin',
        'IT admin is not allowing',
        'content is blocked',
        'access denied by administrator',
        'restricted by policy',
        'blocked by administrator',
        'corporate policy',
        'network administrator',
        'content filtering',
        'web filter',
        'security policy',
        'access restricted',
        'site blocked',
        'category blocked',
        'policy violation',
        'administrative block',
        'firewall blocked',
        'proxy blocked',
        'filtered content',
        'unauthorized access'
    ];
    
    // Common selectors for blocking message containers
    const blockingSelectors = [
        '[class*="block"]',
        '[class*="restrict"]',
        '[class*="deny"]',
        '[class*="admin"]',
        '[class*="policy"]',
        '[class*="filter"]',
        '[id*="block"]',
        '[id*="restrict"]',
        '[id*="deny"]',
        '[id*="admin"]',
        '[id*="policy"]',
        '.notification',
        '.alert',
        '.warning',
        '.error',
        '.modal',
        '.popup',
        '.overlay',
        '.banner',
        '.message'
    ];
    
    let hiddenCount = 0;
    
    // Function to hide elements containing blocking messages
    function hideBlockingElements() {
        let elementsHidden = 0;
        
        // Method 1: Hide by text content
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const text = (element.textContent || element.innerText || '').toLowerCase();
            
            blockingPatterns.forEach(pattern => {
                if (text.includes(pattern.toLowerCase())) {
                    hideElement(element, 'text pattern');
                    elementsHidden++;
                }
            });
        });
        
        // Method 2: Hide by common selectors
        blockingSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    const text = (element.textContent || element.innerText || '').toLowerCase();
                    blockingPatterns.forEach(pattern => {
                        if (text.includes(pattern.toLowerCase())) {
                            hideElement(element, 'selector match');
                            elementsHidden++;
                        }
                    });
                });
            } catch (e) {
                // Ignore invalid selectors
            }
        });
        
        // Method 3: Hide elements with blocking-related attributes
        const attributeSelectors = [
            '[data-message*="block"]',
            '[data-message*="restrict"]',
            '[data-message*="admin"]',
            '[title*="block"]',
            '[title*="restrict"]',
            '[alt*="block"]',
            '[alt*="restrict"]'
        ];
        
        attributeSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    hideElement(element, 'attribute match');
                    elementsHidden++;
                });
            } catch (e) {
                // Ignore invalid selectors
            }
        });
        
        if (elementsHidden > 0) {
            hiddenCount += elementsHidden;
            console.log(`🛡️ Hidden ${elementsHidden} blocking elements (total: ${hiddenCount})`);
        }
    }
    
    // Function to hide an element and its containers
    function hideElement(element, reason) {
        if (element.dataset.blockerHidden) return; // Already hidden
        
        // Mark as hidden to avoid duplicate processing
        element.dataset.blockerHidden = 'true';
        
        // Hide the element
        element.style.setProperty('display', 'none', 'important');
        element.style.setProperty('visibility', 'hidden', 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('height', '0', 'important');
        element.style.setProperty('width', '0', 'important');
        element.style.setProperty('overflow', 'hidden', 'important');
        element.style.setProperty('position', 'absolute', 'important');
        element.style.setProperty('left', '-9999px', 'important');
        
        // Try to hide parent containers that might only contain this blocking message
        let parent = element.parentElement;
        let level = 0;
        while (parent && parent !== document.body && level < 5) {
            const siblings = Array.from(parent.children).filter(child => 
                !child.dataset.blockerHidden && 
                child.offsetHeight > 0 && 
                child.offsetWidth > 0
            );
            
            if (siblings.length <= 1) {
                parent.style.setProperty('display', 'none', 'important');
                parent.dataset.blockerHidden = 'true';
                parent = parent.parentElement;
                level++;
            } else {
                break;
            }
        }
        
        console.log(`🚫 Hidden element (${reason}):`, element);
    }
    
    // Function to remove blocking overlays
    function removeBlockingOverlays() {
        const overlaySelectors = [
            '.modal-backdrop',
            '.overlay',
            '.modal-overlay',
            '.popup-overlay',
            '[style*="position: fixed"]',
            '[style*="z-index"]'
        ];
        
        overlaySelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    const text = (element.textContent || element.innerText || '').toLowerCase();
                    blockingPatterns.forEach(pattern => {
                        if (text.includes(pattern.toLowerCase())) {
                            element.remove();
                            console.log('🗑️ Removed blocking overlay:', element);
                        }
                    });
                });
            } catch (e) {
                // Ignore errors
            }
        });
    }
    
    // Function to bypass common blocking mechanisms
    function bypassBlockingMechanisms() {
        // Remove event listeners that might prevent navigation
        const events = ['beforeunload', 'unload', 'click', 'submit'];
        events.forEach(eventType => {
            window.removeEventListener(eventType, function() {}, true);
        });
        
        // Override common blocking functions
        if (window.alert) {
            const originalAlert = window.alert;
            window.alert = function(message) {
                if (blockingPatterns.some(pattern => 
                    message.toLowerCase().includes(pattern.toLowerCase()))) {
                    console.log('🚫 Blocked alert:', message);
                    return;
                }
                return originalAlert.call(this, message);
            };
        }
        
        if (window.confirm) {
            const originalConfirm = window.confirm;
            window.confirm = function(message) {
                if (blockingPatterns.some(pattern => 
                    message.toLowerCase().includes(pattern.toLowerCase()))) {
                    console.log('🚫 Blocked confirm:', message);
                    return true; // Auto-confirm to bypass
                }
                return originalConfirm.call(this, message);
            };
        }
    }
    
    // Function to inject custom CSS
    function injectCustomCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Hide elements containing blocking text */
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
            }
            
            /* Hide common blocking containers */
            .blocked-content,
            .access-denied,
            .policy-violation,
            .admin-block,
            .content-filter,
            [data-blocked="true"],
            [data-restricted="true"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize the blocker
    function init() {
        console.log('🛡️ IT Admin Message Blocker activated');
        
        // Inject CSS immediately
        injectCustomCSS();
        
        // Run initial cleanup
        hideBlockingElements();
        removeBlockingOverlays();
        bypassBlockingMechanisms();
        
        // Set up mutation observer for dynamic content
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
            });
            
            if (shouldCheck) {
                setTimeout(() => {
                    hideBlockingElements();
                    removeBlockingOverlays();
                }, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
        
        // Run periodic cleanup
        setInterval(() => {
            hideBlockingElements();
            removeBlockingOverlays();
        }, 2000);
        
        // Store stats
        chrome.storage.local.set({ hiddenCount: hiddenCount });
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also run immediately
    setTimeout(init, 100);
})();