export { fcTarget, changeFontColor };

var url = (new URL(window.location.href)).hostname;
var fcTarget = "div,p,span,em,a,h1,h2,h3,h4,h5,h6,th,td,li,button,input,blockquote";

chrome.storage.local.get(url, data => {
    if (data[url]) {
        changeFontColor(data[url].fontColor, fcTarget);
    }
});

function changeFontColor(fc, target) {
    document.body.querySelectorAll(target).forEach(n => {
        n.style.setProperty("color", fc);
    });
}
