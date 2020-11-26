export { distinguishVisitedLinks };

var url = (new URL(window.location.href)).hostname;

chrome.storage.local.get(url, data => {
    if (data[url]) {
        distinguishVisitedLinks(data[url]);
    }
});

function distinguishVisitedLinks(settings) {
    console.log(settings.distinguishVisitedLinks);
    if (settings.distinguishVisitedLinks) {
        let fc = settings.fontColor ? settings.fontColor.substring(1).match(/.{2}/g)
            .map(c => parseInt("0x"+c)) : [15,15,15];
        let bgc = settings.backgroundColor ? settings.backgroundColor.substring(1).match(/.{2}/g)
            .map(c => parseInt("0x"+c)) : [255,255,255];
        let colors = fc.map((num,idx) => parseInt(bgc[idx] + (num-bgc[idx])/3));
        console.log(fc,bgc,colors);
        var rule = "*[href]:visited {color:rgb(" + colors[0] + "," + colors[1]
            + "," + colors[2] + ") !important;}";
        for (let i = document.styleSheets.length-1; i >= 0; i--) {
            let styleSheet = document.styleSheets[i];
            if (!styleSheet.href) {
                styleSheet.insertRule(rule, styleSheet.cssRules.length);
                break;
            }
        }
    }
    else {
        for (let i = document.styleSheets.length-1; i >= 0; i--) {
            let styleSheet = document.styleSheets[i];
            if (!styleSheet.href) {
                for (let j = styleSheet.cssRules.length-1; j >= 0; j--) {
                    if (styleSheet.cssRules[j].selectorText
                        && styleSheet.cssRules[j].selectorText.startsWith("[href]:visited")) {
                        styleSheet.removeRule(j);
                    }
                }
            }
        }
    }
}
