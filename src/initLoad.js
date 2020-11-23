import { update } from "./update.js";
export { initLoad };

var focusHighlightCSS1 = "a:focus {color:rgb(255,255,255) !important; background-color:rgb(96,96,225) !important;" +
    "outline-style:solid !important; outline-color:rgb(128,128,225) !important; outline-width:3px !important; padding:3px !important;" +
    "border:none !important;}";
var focusHighlightCSS2 = "a:focus div {color: rgb(255,255,255) !important;}";
// var distinguishVisitedLinksCSS1 = "a:link {border-bottom:1px solid rgb(96,96,255) !important;}";
// var distinguishVisitedLinksCSS2 = "a:visited {color:rgb(160,160,160) !important; border-bottom:1px dotted rgb(255,160,160) !important;}";
var distinguishVisitedLinksCSS1 = "a:visited {color:rgb(180,180,180) !important;}";
var url = (new URL(window.location.href)).hostname;

function initLoad() {
    chrome.storage.local.get(url, data => {
        if (data[url] && data[url].focusHighlight) {
            for (let i = document.styleSheets.length-1; i >= 0; i--) {
                let styleSheet = document.styleSheets[i];
                if (!styleSheet.href) {
                    styleSheet.insertRule(focusHighlightCSS1, styleSheet.cssRules.length);
                    styleSheet.insertRule(focusHighlightCSS2, styleSheet.cssRules.length);
                    break;
                }
            }
        }
        else {
            for (let i = document.styleSheets.length-1; i >= 0; i--) {
                let styleSheet = document.styleSheets[i];
                if (!styleSheet.href) {
                    for (let j = styleSheet.cssRules.length-1; j >= 0; j--) {
                        if(styleSheet.cssRules[j].selectorText && (
                            styleSheet.cssRules[j].selectorText.startsWith("a:focus") ||
                            styleSheet.cssRules[j].selectorText.startsWith("a:focus div"))) {
                            styleSheet.removeRule(j);
                        }
                    }
                }
            }
        }

        if (data[url] && data[url].distinguishVisitedLinks) {
            for (let i = document.styleSheets.length-1; i >= 0; i--) {
                let styleSheet = document.styleSheets[i];
                if (!styleSheet.href) {
                    styleSheet.insertRule(distinguishVisitedLinksCSS1, styleSheet.cssRules.length);
                    // styleSheet.insertRule(distinguishVisitedLinksCSS2, styleSheet.cssRules.length);
                    break;
                }
            }
        }
        else {
            for (let i = document.styleSheets.length-1; i >= 0; i--) {
                let styleSheet = document.styleSheets[i];
                if (!styleSheet.href) {
                    for (let j = styleSheet.cssRules.length-1; j >= 0; j--) {
                        if(styleSheet.cssRules[j].selectorText && (
                            styleSheet.cssRules[j].selectorText.startsWith("a:link") ||
                            styleSheet.cssRules[j].selectorText.startsWith("a:visied"))) {
                            styleSheet.removeRule(j);
                        }
                    }
                }
            }
        }

        update(true);
    });
}
