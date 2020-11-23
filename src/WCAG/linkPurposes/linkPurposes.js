export { linkPurposes };

var url = (new URL(window.location.href)).hostname;
var links = document.body.querySelectorAll("a");
var webFileTypes = ["html", "htm", "shtml", "php", "asp", "aspx", "jsp", "com"];

chrome.storage.local.get(url, data => {
    if (data[url] && data[url].optimization) {
        linkPurposes(links, data[url]);
    }
});

function linkPurposes(links, settings) {
    let s = settings;
    links.forEach(link => {
        let images = link.querySelectorAll("img");
        if (images.length > 0) removeProfilePictureLink(images);
        if (!link.processed) linkText(link, s);
    });
}

function removeProfilePictureLink(images) {
    images.forEach(image => {
        let imgWidth = window.getComputedStyle(image).getPropertyValue("width");
        let imgHeight = window.getComputedStyle(image).getPropertyValue("height");
        if (imgWidth !== imgHeight) return;
        let parentNodes = image, imageLink, repetitiveNodes, numNodes = 0;
        for (let i = 0; i < 5; i++) {
            if (numNodes >= 2) break;
            parentNodes = parentNodes.parentNode;
            if (parentNodes.nodeName === "A") imageLink = parentNodes;
            if (imageLink) {
                let pathname = imageLink.href ? (new URL(imageLink.href)).pathname : null;
                if (pathname) {
                    repetitiveNodes = parentNodes.querySelectorAll("a[href*='" + pathname + "']");
                    numNodes = repetitiveNodes.length;
                }
            }
        }
        if (numNodes < 2) return;
        repetitiveNodes[0].setAttribute("tabindex", "-1");
        repetitiveNodes[0].setAttribute("aria-hidden", "true");
    });
}

function linkText(link, settings) {
    let linkText = {};
    if (!hasSomethingToRead(link)) addLinkText(link, settings);
    let pathname = link.href ? (new URL(link.href)).pathname : null;
    if (pathname && pathname.length-1-pathname.lastIndexOf('.') < Math.min(5,pathname.length)
        && !endsWithAny(pathname,webFileTypes)) {
        addFileType(link, pathname);
    }
    link.processed = true;
}

function hasSomethingToRead(element) {
    return hasAttributeR(element, "aria-label") || hasAttributeR(element, "aria-labelledby")
        || hasAttributeR(element, "aria-describedby") || hasAttributeR(element, "title")
        || hasAttributeR(element, "alt") || element.textContent;
}

function hasAttributeR(element, attribute) {
    return element.getAttribute(attribute) || [...element.querySelectorAll('*')].some(e => e.getAttribute(attribute));
}

function addLinkText(link, settings) {
    let imageLink = link.querySelector("img");
    if (link.href.startsWith("javascript")) {
        if (imageLink) imageLink.setAttribute("alt", "图片按钮");
        else link.setAttribute("aria-label", "按钮");
    }
    else if (link.getAttribute("href") === '#') {
        if (imageLink) imageLink.setAttribute("alt", "回到页首");
        else link.setAttribute("aria-label", "回到页首");
    }
    else if (!link.getAttribute("href")) {
        link.setAttribute("tabindex", "-1");
        link.setAttribute("aria-hidden", "true");
    }
    else if (Number(link.tabIndex) > -1) {
        setLinkTextFromURL(link, settings);
    }
}

function setLinkTextFromURL(link, settings) {
    let imageLink = link.querySelector("img");
    let l = link.href;
    if (l) {
        if ((new URL(window.location.href)).hostname !== (new URL(l)).hostname) return;
        // else console.log(link, link.href);
        if (settings.frequentLinks && Object.keys(settings.frequentLinks).includes(l)) {
            if (imageLink) imageLink.setAttribute("alt", settings.frequentLinks[l]);
            else link.setAttribute("aria-label", settings.frequentLinks[l]);
        }
        else {
            fetch(l)
                .then(response => response.text())
                .then(text => {
                    let doc = new DOMParser().parseFromString(text, "text/html");
                    let imageLink = link.querySelector("img");
                    if (imageLink) imageLink.setAttribute("alt", doc.title+"图片");
                    else link.setAttribute("aria-label", doc.title);
                    if (!document.linkList) document.linkList = [];
                    else {
                        let uniqueLinks = document.linkList.map(e => e[0]);
                        console.log(document.linkList, uniqueLinks);
                        if (uniqueLinks.includes(l)) {
                            if (!settings.frequentLinks) settings.frequentLinks = {};
                            settings.frequentLinks[l] = doc.title;
                            chrome.storage.local.set({[url]: settings});
                        }
                        else {
                            document.linkList.push([l, doc.title]);
                        }
                    }
                });
        }
    }
}


function addFileType(link, pathname) {
    let images = link.querySelectorAll("img");
    if (images.length > 0) {
        images[0].alt += " " + pathname.substring(pathname.lastIndexOf('.')+1) + "类型文件";
    }
    else {
        let linkText = document.createTextNode(" " + pathname.substring(pathname.lastIndexOf('.')+1) + "类型文件");
        link.appendChild(linkText);
    }
}

function endsWithAny(string, suffixes) {
    return suffixes.some((suffix) => string.endsWith(suffix));
}
