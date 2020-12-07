export { setHoverState };

var url = (new URL(window.location.href)).hostname;

chrome.storage.local.get(url, data => {
    if (data[url]) {
        setHoverState(data[url]);
    }
});

function setHoverState(settings) {
    console.log("hoverState hook: " + settings.hoverState);
    for (let i = document.styleSheets.length-1; i >= 0; i--) {
        let styleSheet = document.styleSheets[i];
        if (!styleSheet.href) {
            for (let j = styleSheet.cssRules.length-1; j >= 0; j--) {
                if (styleSheet.cssRules[j].selectorText &&
                    styleSheet.cssRules[j].selectorText.startsWith("[href]:hover")) {
                    styleSheet.removeRule(j);
                }
            }
        }
    }
    if (settings.hoverFontColor || settings.hoverBackgroundColor) {
        for (let i = document.styleSheets.length-1; i >= 0; i--) {
            let styleSheet = document.styleSheets[i];
            if (!styleSheet.href) {
                let rule = "*[href]:hover,input:hover,textarea:hover,button:hover,"
                    + "select:hover,optgroup:hover,option:hover,fieldset:hover,"
                    + "legend:hover,datalist:hover,output:hover {";
                let fc = settings.hoverFontColor ? settings.hoverFontColor
                    : settings.fontColor ? settings.fontColor : "#202020";
                let bgc = settings.hoverBackgroundColor ?
                    settings.hoverBackgroundColor : settings.backgroundColor ?
                    settings.backgroundColor : "#FFFFFF";
                rule = rule + "color:" + fc + " !important;";
                rule = rule + "background-color:" + bgc + " !important;";
                rule += "}";
                styleSheet.insertRule(rule, styleSheet.cssRules.length);
                break;
            }
        }
    }
}
