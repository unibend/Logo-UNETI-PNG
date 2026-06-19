// ==UserScript==
// @name         UNETI Logo Replacer
// @namespace    https://github.com/unibend
// @version      1.2
// @description  Replaces the main UNETI logo with a custom image.
// @author       Ben
// @match        *://uneti.edu.ve/*
// @match        *://*.uneti.edu.ve/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_URL  = 'https://www.uneti.edu.ve/campus/pluginfile.php/1/theme_edash/main_logo/1777513178/logouneti22.jpg';
    const REPLACE_URL = 'https://images2.imgbox.com/56/f7/nFfdG1zp_o.png';

    // Normalise a URL string so both relative and absolute src values
    // can be compared against the fully-qualified TARGET_URL.
    function resolveUrl(raw) {
        try { return new URL(raw, location.href).href; }
        catch { return raw; }
    }

    function isTarget(img) {
        const raw = img.getAttribute('src') || '';
        return img.src === TARGET_URL || resolveUrl(raw) === TARGET_URL;
    }

    function replaceIfMatch(img) {
        if (isTarget(img)) {
            img.src = REPLACE_URL;
        }
    }

    // Recursively scan a DOM node for matching <img> elements.
    function scanNode(node) {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        
        if (node.tagName === 'IMG') {
            replaceIfMatch(node);
            return; // <img> cannot contain other <img> tags, so we can stop here
        }
        
        // querySelectorAll is faster than getElementsByTagName on large subtrees.
        node.querySelectorAll('img').forEach(replaceIfMatch);
    }

    // --- MutationObserver ---
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // New nodes added to the DOM.
            mutation.addedNodes.forEach(scanNode);
            
            // Existing <img> src attribute changed.
            if (
                mutation.type === 'attributes' &&
                mutation.attributeName === 'src' &&
                mutation.target.tagName === 'IMG'
            ) {
                replaceIfMatch(mutation.target);
            }
        }
    });

    const OBSERVER_CONFIG = {
        childList:      true,
        subtree:        true,
        attributes:     true,
        attributeFilter: ['src'],
    };

    // At document-start, document.documentElement might be null, 
    // but the `document` object ALWAYS exists.
    // By observing `document`, we instantly catch the exact microsecond 
    // the <html> tag is created by the parser, ensuring zero delay.
    function start() {
        scanNode(document); // Catch anything already there (unlikely but safe)
        observer.observe(document, OBSERVER_CONFIG);
    }

    // Re-run a full scan once the DOM is fully parsed as a final safety net.
    document.addEventListener('DOMContentLoaded', () => scanNode(document.documentElement), { once: true });

    start();
})();
