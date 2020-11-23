import { linkPurposes } from "./WCAG/linkPurposes/linkPurposes.js";
import { lsTarget, changeLineSpacing } from "./UAAG/lineSpacing/lineSpacing.js";
import { fcTarget, changeFontColor } from "./UAAG/fontColor/fontColor.js";
import { bgcTarget, changeBackgroundColor } from "./UAAG/backgroundColor/backgroundColor.js";
export { update };

var url = (new URL(window.location.href)).hostname;
var docHeight = document.body.scrollHeight;


function update(isLoad = false) {
    chrome.storage.local.get(url, data => {
        let currentHeight = document.body.scrollHeight;
        if (currentHeight > docHeight) {
            if (data[url] && data[url].optimization) {
                let links = document.body.querySelectorAll("a");
                linkPurposes(links, data[url]);
            }

            if (data[url] && data[url].backgroundColor) {
                console.log("Updating background color");
                changeBackgroundColor(data[url].backgroundColor, bgcTarget, true);
            }
            docHeight = currentHeight;
        }

        if (data[url] && data[url].lineSpacing) {
            if (isLoad) changeLineSpacing(data[url].lineSpacing, lsTarget, false, true);
            else changeLineSpacing(data[url].lineSpacing, lsTarget, true);
        }

        if (data[url] && data[url].fontColor) {
            changeFontColor(data[url].fontColor, fcTarget);
        }

        console.log("updated");
    });
}
