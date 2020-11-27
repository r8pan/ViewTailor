export { bgcTarget, changeBackgroundColor };

var url = (new URL(window.location.href)).hostname;
var bgcTarget = "body,div,a,span,li,ol,ul";

chrome.storage.local.get(url, data => {
    if (data[url]) {
        changeBackgroundColor(data[url].backgroundColor, bgcTarget);
    }
});

function changeBackgroundColor(bgc, target, isUpdate = false) {
    let overlays = [];
    let videos = document.querySelectorAll("video"), minZIndex = Infinity;
    if (videos.length === 0) minZIndex = 0;
    else {
        videos.forEach(v => {
            while (isNaN(parseInt(window.getComputedStyle(v).getPropertyValue("z-index")))) {
                v = v.parentNode;
                if (v === document.body) break;
            }
            let curZIndex = v === document.body ? 0 : parseInt(window.getComputedStyle(v).getPropertyValue("z-index"));
            if (curZIndex < minZIndex) minZIndex = curZIndex;
            console.log(minZIndex);
        });
    }
    document.querySelectorAll(target).forEach(n => {
        let z = parseInt(window.getComputedStyle(n).getPropertyValue("z-index"));
        // let rgb = window.getComputedStyle(n).getPropertyValue("background-color");
        // let colorVals = rgb.substring(4, rgb.length-1).replace(/ /g, '').split(',');
        if (window.getComputedStyle(n).getPropertyValue("position") === "absolute" || z > minZIndex) {
            overlays.push(n);
            return;
        }
        if (isUpdate && n.backgroundColorChanged) return;
        n.style.setProperty("background-color", bgc);
        if (isUpdate) n.backgroundColorChanged = true;
    });
    overlays.forEach(n => {
        if (n.style) n.style.setProperty("opacity", "0.9");
        removeBackgroundColor(n);
    });
    videos.forEach(v => {
        let p = v.parentNode.parentNode;
        removeBackgroundColor(p);
    });
    videos = {};
}

function removeBackgroundColor(e) {
    if (!e.childNodes || e.nodeType === 3) return;
    if (e.style) e.style.removeProperty("background-color");
    e.childNodes.forEach(c => {
        removeBackgroundColor(c);
    });
}
