// let contents = document.getElementByTagName('p');
// for (let i = 0; i < cotents.length; i++) {" +
//     document.getElementById(contents[i].id).style.fontSize =
//         contents[i].style.fontSize
// }"


console.log("in textScale.js");
var url = (new URL(window.location.href)).hostname;
var target = "div,p,span,em,a,h1,h2,h3,h4,h5,h6,th,td,li";
var targetUC = target.split(',').map(e=>e.toUpperCase());
//console.log(target.split(',').map(n => n.toUpperCase()));

//if (url !== "www.zhihu.com") {
    chrome.storage.local.get(url, data => {
        let oldValue;
        if (!data[url]) data[url] = {};
        else oldValue = data[url].textScale ? data[url].textScale : 100;
        data[url].textScale = newValue;
        chrome.storage.local.set({[url]: data[url]}, () => {
            document.body.querySelectorAll(target).forEach(n => {
                // console.log(n,n.childNodes.length, n.childNodes.length > 0 ? n.childNodes[0].nodeType : -1);
                if (targetUC.includes(n.nodeName)
                    //&& (n.childNodes.length > 1 || (n.childNodes.length === 1 && n.childNodes[0].nodeType !== 3))) return;
                    && (n.childNodes.length > 1 && n.childNodes[0].nodeType !== 3)) return;
                // console.log("passed");
                let oldFontSize = window.getComputedStyle(n).getPropertyValue("font-size");
                if (n.id === "test") console.log(oldFontSize);
                let digitalPart = parseFloat(oldFontSize) / oldValue * newValue;
                let newFontSize = digitalPart + oldFontSize.toString().slice(parseFloat(oldFontSize).toString().length-oldFontSize.length);
                n.style.fontSize = newFontSize;
            });
        });
    });
//}
