var docHeight = document.body.scrollHeight;

//******************************************************************************
import { initLoad } from "./src/initLoad.js";
import { update } from "./src/update.js";

var count = 0;

// //****on page load**************************************************************
export function main() {
    // document.addEventListener('readystatechange', event => {
        // console.log(event.target.readyState);
        // if (event.target.readyState === "interactive" || event.target.readyState === "complete") {
        //     console.log("loading complete");
            initLoad();
            setTimeout(updateStart, 3000);
        // }
    // });
}

function updateStart() {
    const config = { attributes: true, childList: true, subtree: true };
    const callback = function(mutationsList, observer) {
        if (mutationsList.length > 3) {
            update();
            observer.disconnect();
            setTimeout(() => observer.observe(document.body, config), 800);
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
}
