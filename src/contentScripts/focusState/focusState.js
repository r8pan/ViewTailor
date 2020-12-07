export { setFocusState };

var url = (new URL(window.location.href)).hostname;

chrome.storage.local.get(url, data => {
    if (data[url]) {
        setFocusState(data[url]);
    }
});

function setFocusState(settings) {
    console.log("focusState hook: " + settings.focusState);
    for (let i = document.styleSheets.length-1; i >= 0; i--) {
        let styleSheet = document.styleSheets[i];
        if (!styleSheet.href) {
            for (let j = styleSheet.cssRules.length-1; j >= 0; j--) {
                if (styleSheet.cssRules[j].selectorText &&
                    styleSheet.cssRules[j].selectorText.startsWith("[href]:focus")) {
                    styleSheet.removeRule(j);
                }
            }
        }
    }
    if (settings.focusFontColor || settings.focusBackgroundColor || settings.focusOutlineColor) {
        for (let i = document.styleSheets.length-1; i >= 0; i--) {
            let styleSheet = document.styleSheets[i];
            if (!styleSheet.href) {
                let rule = "*[href]:focus *[href] span:focus,input:focus,textarea:focus,button:focus,"
                    + "select:focus,optgroup:focus,option:focus,fieldset:focus,"
                    + "legend:focus,datalist:focus,output:focus {";
                let fc = settings.focusFontColor ? settings.focusFontColor
                    : settings.focusColor ? settings.fontColor : "#202020";
                let bgc = settings.focusBackgroundColor ?
                    settings.focusBackgroundColor : settings.backgroundColor ?
                    settings.backgroundColor : "#FFFFFF";
                let bc = settings.focusOutlineColor ?
                    settings.focusOutlineColor : "#8080FF";
                rule = rule + "color:" + fc + " !important;";
                rule = rule + "background-color:" + bgc + " !important;";
                rule = rule + "outline:2px solid " + bc + " !important;";
                rule = rule + "border:none important;";
                rule += "}";
                styleSheet.insertRule(rule, styleSheet.cssRules.length);
                break;
            }
        }
    }
}
