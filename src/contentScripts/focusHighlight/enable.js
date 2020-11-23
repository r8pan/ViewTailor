var focusHighlightCSS1 = "a:focus {color:rgb(255,255,255) !important; background-color:rgb(96,96,225) !important;" +
    "outline-style:solid !important; outline-color:rgb(128,128,225) !important; outline-width:3px !important; padding:3px !important;" +
    "border:none !important;}";
var focusHighlightCSS2 = "a:focus div {color: rgb(255,255,255) !important;}";

var url = (new URL(window.location.href)).hostname;

chrome.storage.local.get(url, data => {
    console.log("in enable.js");
    if (!data[url]) data[url] = {};
    data[url].focusHighlight = true;
    console.log(data[url]);
    chrome.storage.local.set({[url]: data[url]}, () => {
        for (let i = document.styleSheets.length-1; i >= 0; i--) {
            let styleSheet = document.styleSheets[i];
            if (!styleSheet.href) {
                styleSheet.insertRule(focusHighlightCSS1, styleSheet.cssRules.length);
                styleSheet.insertRule(focusHighlightCSS2, styleSheet.cssRules.length);
                break;
            }
        }
    });
});
