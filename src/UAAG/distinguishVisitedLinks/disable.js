var url = (new URL(window.location.href)).hostname;

chrome.storage.local.get(url, data => {
    data[url].distinguishVisitedLinks = false;
    chrome.storage.local.set({[url]: data[url]}, () => {
        for (let i = document.styleSheets.length-1; i >= 0; i--) {
            let styleSheet = document.styleSheets[i];
            if (!styleSheet.href) {
                for (let j = styleSheet.cssRules.length-1; j >= 0; j--) {
                    if (styleSheet.cssRules[j].selectorText && (
                        styleSheet.cssRules[j].selectorText.startsWith("a:link") ||
                        styleSheet.cssRules[j].selectorText.startsWith("a:visited"))) {
                        styleSheet.removeRule(j);
                    }
                }
            }
        }
    });
});
