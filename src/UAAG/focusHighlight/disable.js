console.log("In disableFocus.js");

var url = (new URL(window.location.href)).hostname;

chrome.storage.local.get(url, data => {
    data[url].focusHighlight = false;
    chrome.storage.local.set({[url]: data[url]}, () => {
        for (let i = document.styleSheets.length-1; i >= 0; i--) {
            let styleSheet = document.styleSheets[i];
            if (!styleSheet.href) {
                for (let j = styleSheet.cssRules.length-1; j >= 0; j--) {
                    if (styleSheet.cssRules[j].selectorText && (
                        styleSheet.cssRules[j].selectorText.startsWith("a:focus") ||
                        styleSheet.cssRules[j].selectorText.startsWith("a:focus div"))) {
                        styleSheet.removeRule(j);
                    }
                }
            }
        }
    });
});
