// var distinguishVisitedLinksCSS1 = "a:link {border-bottom:1px solid rgb(96,96,255) !important;}";
// var distinguishVisitedLinksCSS2 = "a:visited {color:rgb(160,160,160) !important;" +
//     "border-bottom:1px dotted rgb(255,160,160) !important;}";
var distinguishVisitedLinksCSS1 = "a:visited {color:rgb(160,160,160) !important;}";

var url = (new URL(window.location.href)).hostname;

chrome.storage.local.get(url, data => {
    if (!data[url]) data[url] = {};
    data[url].distinguishVisitedLinks = true;
    chrome.storage.local.set({[url]: data[url]}, () => {
        for (let i = document.styleSheets.length-1; i >= 0; i--) {
            let styleSheet = document.styleSheets[i];
            if (!styleSheet.href) {
                styleSheet.insertRule(distinguishVisitedLinksCSS1, styleSheet.cssRules.length);
                // styleSheet.insertRule(distinguishVisitedLinksCSS2, styleSheet.cssRules.length);
                break;
            }
        }
    });
});
