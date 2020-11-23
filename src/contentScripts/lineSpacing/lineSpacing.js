export { lsTarget, changeLineSpacing };

var url = (new URL(window.location.href)).hostname;
var lsTarget = "p,span,div,a,blockquote,li";

chrome.storage.local.get(url, data => {
    if (data[url]) {
        changeLineSpacing(data[url].lineSpacing, lsTarget);
    }
});

function changeLineSpacing(ls, target, isUpdate = false, isLoad = false) {
    let targets = (target.substring(7)).split(',').map(e=>e.toUpperCase());
    document.body.querySelectorAll(target).forEach(n => {
        if (isUpdate && n.lineSpacingChanged) return;
        if (targets.includes(n.nodeName) && (n.childNodes.length > 1
            || (n.childNodes.length === 1 && n.childNodes[0].nodeType !== 3))) return;
        let oldLineHeight = window.getComputedStyle(n).getPropertyValue("line-height");
        oldLineHeight = Number(oldLineHeight.substring(0, oldLineHeight.length-2));
        if (!n.lsFactor) n.lsFactor = 100;
        n.style.setProperty("line-height", oldLineHeight/n.lsFactor*ls+'px');
        n.lsFactor = ls;
        if (isLoad) n.lineSpacingChanged = true;
    });
}
