import { update } from "./update.js";
import { setSelectionState } from "./contentScripts/selectionState/selectionState.js";
import { setHoverState } from "./contentScripts/hoverState/hoverState.js";
import { setFocusState } from "./contentScripts/focusState/focusState.js";
import { distinguishVisitedLinks } from "./contentScripts/distinguishVisitedLinks/distinguishVisitedLinks.js";


export { initLoad };

var url = (new URL(window.location.href)).hostname;

function initLoad() {
    chrome.storage.local.get(url, data => {
        if (data[url] && data[url].selectionState) {
            setSelectionState(data[url]);
        }

        if (data[url] && data[url].hoverState) {
            setHoverState(data[url]);
        }

        if (data[url] && data[url].focusState) {
            setFocusState(data[url]);
        }

        if (data[url] && data[url].distinguishVisitedLinks) {
            distinguishVisitedLinks(data[url]);
        }

        update(true);
    });
}
