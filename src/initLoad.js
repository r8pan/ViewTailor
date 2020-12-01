import { update } from "./update.js";
import { distinguishVisitedLinks } from "./contentScripts/distinguishVisitedLinks/distinguishVisitedLinks.js";
import { focusHighlightCSS1, focusHighlightCSS2, focusHighlight } from "./contentScripts/focusHighlight/focusHighlight.js";
import { setSelectionState } from "./contentScripts/selectionState/selectionState.js";

export { initLoad };

var url = (new URL(window.location.href)).hostname;

function initLoad() {
    chrome.storage.local.get(url, data => {
        if (data[url] && data[url].selectionState) {
            setSelectionState(data[url]);
        }

        if (data[url] && data[url].focusHighlight) {
            focusHighlight(data[url], focusHighlightCSS1, focusHighlightCSS2);
        }

        if (data[url] && data[url].distinguishVisitedLinks) {
            distinguishVisitedLinks(data[url]);
        }

        update(true);
    });
}
