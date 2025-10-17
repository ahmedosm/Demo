// ==UserScript==
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
})();