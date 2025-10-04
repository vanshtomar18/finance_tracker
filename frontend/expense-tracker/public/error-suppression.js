// Error Suppression Script
// This will completely hide browser extension errors from console

(function() {
    'use strict';
    
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Extension error patterns to suppress
    const suppressPatterns = [
        'runtime.lastError',
        'message port closed',
        'applygoat.com',
        'chrome-extension',
        'moz-extension',
        'contentScript.js',
        'The message port closed before a response was received'
    ];
    
    // Function to check if error should be suppressed
    function shouldSuppress(args) {
        const message = args.join(' ').toLowerCase();
        return suppressPatterns.some(pattern => 
            message.includes(pattern.toLowerCase())
        );
    }
    
    // Override console.error
    console.error = function(...args) {
        if (!shouldSuppress(args)) {
            originalError.apply(console, args);
        }
    };
    
    // Override console.warn  
    console.warn = function(...args) {
        if (!shouldSuppress(args)) {
            originalWarn.apply(console, args);
        }
    };
    
    // Suppress window errors related to extensions
    window.addEventListener('error', function(e) {
        if (shouldSuppress([e.message, e.filename || ''])) {
            e.preventDefault();
            return true;
        }
    });
    
    // Suppress unhandled promise rejections from extensions
    window.addEventListener('unhandledrejection', function(e) {
        if (shouldSuppress([e.reason?.message || '', e.reason?.stack || ''])) {
            e.preventDefault();
            return true;
        }
    });
    
    console.log('🎯 Extension error suppression active - Clean console for your app!');
})();