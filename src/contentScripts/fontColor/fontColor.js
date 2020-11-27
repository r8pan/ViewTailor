export { fcTarget, changeFontColor };

var url = (new URL(window.location.href)).hostname;
var fcTarget = "div,p,h1,h2,h3,h4,h5,h6,"
    + "span,abbr,address,b,blockquote,cite,code,del,em,i,ins,mark,pre,"
    + "progress,q,s,samp,small,strong,sub,sup,time,u,"
    + "input,textarea,button,select,optgroup,option,label,fieldset,legend,datalist,output,"
    + "a,link,nav," + "li,dl,dt,dd," + "caption,th,td," + "figcaption,svg";

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
