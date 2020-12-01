export { setSelectionState };

var url = (new URL(window.location.href)).hostname;
// var focusHighlightCSS2 = "a:focus div {color: rgb(255,255,255) !important;}";

chrome.storage.local.get(url, data => {
    if (data[url]) {
        setSelectionState(data[url]);
    }
});

function setSelectionState(settings) {
    console.log("selection hook: " + settings.selectionState);
    for (let i = document.styleSheets.length-1; i >= 0; i--) {
        let styleSheet = document.styleSheets[i];
        if (!styleSheet.href) {
            for (let j = styleSheet.cssRules.length-1; j >= 0; j--) {
                if (styleSheet.cssRules[j].selectorText &&
                    styleSheet.cssRules[j].selectorText.startsWith("::selection")) {
                    styleSheet.removeRule(j);
                }
            }
        }
    }
    if (settings.selectionState) {
        for (let i = document.styleSheets.length-1; i >= 0; i--) {
            let styleSheet = document.styleSheets[i];
            if (!styleSheet.href) {
                let rule = "::selection {";
                let fc = settings.selectionFontColor ? settings.selectionFontColor
                    : settings.fontColor ? settings.fontColor : "#F0F0F0";
                let bgc = settings.selectionBackgroundColor ?
                    settings.selectionBackgroundColor : settings.backgroundColor ?
                    settings.backgroundColor : "#8080F0";
                rule = rule + "color:" + fc + " !important;";
                rule = rule + "background-color:" + bgc + " !important;";
                rule += "}";
                styleSheet.insertRule(rule, styleSheet.cssRules.length);
                break;
            }
        }
    }
}
