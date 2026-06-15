// ==UserScript==
// @name         UNETI Logo Replacer
// @namespace    https://github.com/unibend
// @version      1.0
// @description  Trades the main UNETI logo for a custom image.
// @author       Ben
// @match        *://uneti.edu.ve/*
// @match        *://*.uneti.edu.ve/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const targetImageUrl = 'https://www.uneti.edu.ve/campus/pluginfile.php/1/theme_edash/main_logo/1777513178/logouneti22.jpg';
    const newImageUrl = 'https://images2.imgbox.com/56/f7/nFfdG1zp_o.png';

    // Function to find and replace the target image
    function replaceLogo() {
        const images = document.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            // Check both the resolved src and the raw attribute src
            if (img.src === targetImageUrl || img.getAttribute('src') === targetImageUrl) {
                img.src = newImageUrl;
            }
        }
    }

    // Run initially when the script loads
    replaceLogo();

    // Use a MutationObserver to catch dynamically loaded images (e.g., via AJAX or lazy loading)
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                shouldCheck = true;
                break;
            }
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                shouldCheck = true;
                break;
            }
        }
        if (shouldCheck) {
            replaceLogo();
        }
    });

    // Start observing the document body for DOM changes
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src']
            });
        });
    }

})();