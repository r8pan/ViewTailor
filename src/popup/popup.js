import { RGB2Hex, fetchScripts } from "../utilities/utils.js";
import { initColorPicker, updateColorHistory, setColorPickerAnimation } from "./colorPicker.js";

let url = new URL(window.location.href);

//******************************************************************************
let fontColor = document.getElementById("font-color");
let fontColorSwitch = document.getElementById("font-color-switch");
let fontColorPicker = document.getElementById("font-color-picker");
let backgroundColor = document.getElementById("background-color");
let backgroundColorSwitch = document.getElementById("background-color-switch");
let backgroundColorPicker = document.getElementById("background-color-picker");
let selectionFontColor = document.getElementById("selection-font-color");
let selectionFontColorSwitch = document.getElementById("selection-font-color-switch");
let selectionFontColorPicker = document.getElementById("selection-font-color-picker");
let selectionBackgroundColor = document.getElementById("selection-background-color");
let selectionBackgroundColorSwitch = document.getElementById("selection-background-color-switch");
let selectionBackgroundColorPicker = document.getElementById("selection-background-color-picker");
let hoverFontColor = document.getElementById("hover-font-color");
let hoverFontColorSwitch = document.getElementById("hover-font-color-switch");
let hoverFontColorPicker = document.getElementById("hover-font-color-picker");
let hoverBackgroundColor = document.getElementById("hover-background-color");
let hoverBackgroundColorSwitch = document.getElementById("hover-background-color-switch");
let hoverBackgroundColorPicker = document.getElementById("hover-background-color-picker");
let focusFontColor = document.getElementById("focus-font-color");
let focusFontColorSwitch = document.getElementById("focus-font-color-switch");
let focusFontColorPicker = document.getElementById("focus-font-color-picker");
let focusBackgroundColor = document.getElementById("focus-background-color");
let focusBackgroundColorSwitch = document.getElementById("focus-background-color-switch");
let focusBackgroundColorPicker = document.getElementById("focus-background-color-picker");
let focusOutlineColor = document.getElementById("focus-outline-color");
let focusOutlineColorSwitch = document.getElementById("focus-outline-color-switch");
let focusOutlineColorPicker = document.getElementById("focus-outline-color-picker");

let selectionStateSwitch = document.getElementById("selection-state-switch");
let hoverStateSwitch = document.getElementById("hover-state-switch");
let focusStateSwitch = document.getElementById("focus-state-switch");
let otherSwitch = document.getElementById("other-switch");
let lineSpacing = document.getElementById("line-spacing");
let distinguishVisitedLinks = document.getElementById("distinguish-visited-links");

//color picker******************************************************************

initColorPicker("font");
initColorPicker("background");
initColorPicker("selection-font");
initColorPicker("selection-background");
initColorPicker("hover-font");
initColorPicker("hover-background");
initColorPicker("focus-font");
initColorPicker("focus-background");
initColorPicker("focus-outline");


//selection state***************************************************************
selectionStateSwitch.onclick = () => {
    selectionStateSwitch.isExpanded = !selectionStateSwitch.isExpanded;
    selectionStateSwitch.style.transform = selectionStateSwitch.isExpanded ? "rotate(90deg)" : "rotate(0deg)";
    document.getElementById("selection-state-elements").querySelectorAll('div[class="row1"]').forEach(d => {
        d.style.padding = selectionStateSwitch.isExpanded ? "15px" : "0 15px";
        d.querySelectorAll("span,input,label").forEach(e => {
            e.style.display = selectionStateSwitch.isExpanded ? "inline-block" : "none";
        });
    });
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.get(url, data => {
            if (!data[url]) data[url] = {};
            data[url].selectionState = selectionStateSwitch.isExpanded;
            setColorPickerAnimation(selectionFontColorPicker, !selectionStateSwitch.isExpanded
                || !data[url].selectionFontColor);
            setColorPickerAnimation(selectionBackgroundColorPicker, !selectionStateSwitch.isExpanded
                || !data[url].selectionBackgroundColor);
            chrome.storage.local.set({[url]: data[url]});
        });
    });
};

//hover state*******************************************************************
hoverStateSwitch.onclick = () => {
    hoverStateSwitch.isExpanded = !hoverStateSwitch.isExpanded;
    hoverStateSwitch.style.transform = hoverStateSwitch.isExpanded ? "rotate(90deg)" : "rotate(0deg)";
    document.getElementById("hover-state-elements").querySelectorAll('div[class="row1"]').forEach(d => {
        d.style.padding = hoverStateSwitch.isExpanded ? "15px" : "0 15px";
        d.querySelectorAll("span,input,label").forEach(e => {
            e.style.display = hoverStateSwitch.isExpanded ? "inline-block" : "none";
        });
    });
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.get(url, data => {
            if (!data[url]) data[url] = {};
            data[url].hoverState = hoverStateSwitch.isExpanded;
            setColorPickerAnimation(hoverFontColorPicker, !hoverStateSwitch.isExpanded
                || !data[url].hoverFontColor);
            setColorPickerAnimation(hoverBackgroundColorPicker, !hoverStateSwitch.isExpanded
                || !data[url].hoverBackgroundColor);
            chrome.storage.local.set({[url]: data[url]});
        });
    });
};

//focus state*******************************************************************
focusStateSwitch.onclick = () => {
    focusStateSwitch.isExpanded = !focusStateSwitch.isExpanded;
    focusStateSwitch.style.transform = focusStateSwitch.isExpanded ? "rotate(90deg)" : "rotate(0deg)";
    document.getElementById("focus-state-elements").querySelectorAll('div[class="row1"]').forEach(d => {
        d.style.padding = focusStateSwitch.isExpanded ? "15px" : "0 15px";
        d.querySelectorAll("span,input,label").forEach(e => {
            e.style.display = focusStateSwitch.isExpanded ? "inline-block" : "none";
        });
    });
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.get(url, data => {
            if (!data[url]) data[url] = {};
            data[url].focusState = focusStateSwitch.isExpanded;
            setColorPickerAnimation(focusFontColorPicker, !focusStateSwitch.isExpanded
                || !data[url].focusFontColor);
            setColorPickerAnimation(focusBackgroundColorPicker, !focusStateSwitch.isExpanded
                || !data[url].focusBackgroundColor);
            setColorPickerAnimation(focusOutlineColorPicker, !focusStateSwitch.isExpanded
                || !data[url].focusOutlineColor);
            chrome.storage.local.set({[url]: data[url]});
        });
    });
};

//other*************************************************************************
otherSwitch.onclick = () => {
    otherSwitch.isExpanded = !otherSwitch.isExpanded;
    otherSwitch.style.transform = otherSwitch.isExpanded ? "rotate(90deg)" : "rotate(0deg)";
    document.getElementById("other-elements").querySelectorAll('div[class="row1"]').forEach(d => {
        d.style.height = otherSwitch.isExpanded ? "20px" : "0";
        d.style.padding = otherSwitch.isExpanded ? "15px" : "0 15px";
        // d.style.outlineTop = otherSwitch.isExpanded ? "1px solid rgb(240,240,240)" : "none";
        d.querySelectorAll('*').forEach(e => {
            e.style.display = otherSwitch.isExpanded ? "inline-block" : "none";
        });
    });
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.get(url, data => {
            if (!data[url]) data[url] = {};
            data[url].other = otherSwitch.isExpanded;
            chrome.storage.local.set({[url]: data[url]});
        });
    });
};

//line-spacing******************************************************************
lineSpacing.oninput = function() {
    console.log("received line-spacing click event", this.value);
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.get(url, data => {
            if (!data[url]) data[url] = {};
            data[url].lineSpacing = this.value;
            document.getElementById("line-spacing-value").textContent = this.value + "%";
            chrome.storage.local.set({[url]: data[url]}, () => {
                fetchScripts(["../contentScripts/lineSpacing/lineSpacing.js"], tabs);
            });
        });
    });
};

//distinguish visited links*****************************************************
distinguishVisitedLinks.onclick = element => {
    console.log("received distinguishVisitedLinks click event");
    let isChecked = document.getElementById("distinguish-visited-links").checked;
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.get(url, data => {
            if (!data[url]) data[url] = {};
            data[url].distinguishVisitedLinks = isChecked;
            chrome.storage.local.set({[url]: data[url]}, () => {
                fetchScripts(["../contentScripts/distinguishVisitedLinks/distinguishVisitedLinks.js"], tabs);
            });
        });
    });
}


//on opening the popup**********************************************************

document.addEventListener('DOMContentLoaded', () => {
    fontColor.disabled = true;
    backgroundColor.disabled = true;
    selectionFontColor.disabled = true;
    selectionBackgroundColor.disabled = true;
    hoverFontColor.disabled = true;
    hoverBackgroundColor.disabled = true;
    focusFontColor.disabled = true;
    focusBackgroundColor.disabled = true;
    focusOutlineColor.disabled = true;

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        console.log("current tab url: " + url);
        chrome.storage.local.get(url, data => {
            console.log(data[url]);
            if (data[url]) {

                fontColor.disabled = !data[url].fontColor;
                fontColor.value = data[url].fontColor ? data[url].fontColor : "#222222";
                setColorPickerAnimation(fontColorPicker, fontColor.disabled);
                fontColorSwitch.checked = !!data[url].fontColor;
                updateColorHistory("font");
                if (data[url].fontColor) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        fetchScripts(["../contentScripts/fontColor/fontColor.js"], tabs);
                    });
                }

                backgroundColor.disabled = !data[url].backgroundColor;
                backgroundColor.value = data[url].backgroundColor ? data[url].backgroundColor : "#F0F0F0";
                setColorPickerAnimation(backgroundColorPicker, backgroundColor.disabled);
                backgroundColorSwitch.checked = !!data[url].backgroundColor;
                updateColorHistory("background");
                if (data[url].backgroundColor) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        fetchScripts(["../contentScripts/backgroundColor/backgroundColor.js"], tabs);
                    });
                }

                selectionStateSwitch.isExpanded = data[url].selectionState;
                selectionStateSwitch.style.transform = selectionStateSwitch.isExpanded ? "rotate(90deg)" : "rotate(0deg)";
                selectionFontColor.disabled = !data[url].selectionFontColor;
                selectionFontColor.value = data[url].selectionFontColor ? data[url].selectionFontColor : "#222222";
                selectionFontColorSwitch.checked = data[url].selectionFontColor;
                updateColorHistory("selection-font");
                selectionBackgroundColor.disabled = !data[url].selectionBackgroundColor;
                selectionBackgroundColor.value = data[url].selectionBackgroundColor ? data[url].selectionBackgroundColor : "#F0F0F0";
                selectionBackgroundColorSwitch.checked = data[url].selectionBackgroundColor;
                updateColorHistory("selection-background");
                document.getElementById("selection-state-elements").querySelectorAll('div[class="row1"]').forEach(d => {
                    d.style.padding = selectionStateSwitch.isExpanded ? "15px" : "0 15px";
                    d.querySelectorAll("span,input,label").forEach(e => {
                        e.style.display = selectionStateSwitch.isExpanded ? "inline-block" : "none";
                    });
                    setColorPickerAnimation(selectionFontColorPicker, !selectionStateSwitch.isExpanded
                        || !data[url].selectionFontColor);
                    setColorPickerAnimation(selectionBackgroundColorPicker, !selectionStateSwitch.isExpanded
                        || !data[url].selectionBackgroundColor);
                });
                if (data[url].selectionState) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        fetchScripts(["../contentScripts/selectionState/selectionState.js"], tabs);
                    });
                }

                hoverStateSwitch.isExpanded = data[url].hoverState;
                hoverStateSwitch.style.transform = hoverStateSwitch.isExpanded ? "rotate(90deg)" : "rotate(0deg)";
                hoverFontColor.disabled = !data[url].hoverFontColor;
                hoverFontColor.value = data[url].hoverFontColor ? data[url].hoverFontColor : "#222222";
                hoverFontColorSwitch.checked = data[url].hoverFontColor;
                updateColorHistory("hover-font");
                hoverBackgroundColor.disabled = !data[url].hoverBackgroundColor;
                hoverBackgroundColor.value = data[url].hoverBackgroundColor ? data[url].hoverBackgroundColor : "#F0F0F0";
                hoverBackgroundColorSwitch.checked = data[url].hoverBackgroundColor;
                updateColorHistory("hover-background");
                document.getElementById("hover-state-elements").querySelectorAll('div[class="row1"]').forEach(d => {
                    d.style.padding = hoverStateSwitch.isExpanded ? "15px" : "0 15px";
                    d.querySelectorAll("span,input,label").forEach(e => {
                        e.style.display = hoverStateSwitch.isExpanded ? "inline-block" : "none";
                    });
                    setColorPickerAnimation(hoverFontColorPicker, !hoverStateSwitch.isExpanded
                        || !data[url].hoverFontColor);
                    setColorPickerAnimation(hoverBackgroundColorPicker, !hoverStateSwitch.isExpanded
                        || !data[url].hoverBackgroundColor);
                });
                if (data[url].hoverState) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        fetchScripts(["../contentScripts/hoverState/hoverState.js"], tabs);
                    });
                }

                focusStateSwitch.isExpanded = data[url].focusState;
                focusStateSwitch.style.transform = focusStateSwitch.isExpanded ? "rotate(90deg)" : "rotate(0deg)";
                focusFontColor.disabled = !data[url].focusrFontColor;
                focusFontColor.value = data[url].focusFontColor ? data[url].focusFontColor : "#222222";
                focusFontColorSwitch.checked = data[url].focusFontColor;
                updateColorHistory("focus-font");
                focusBackgroundColor.disabled = !data[url].focusBackgroundColor;
                focusBackgroundColor.value = data[url].focusBackgroundColor ? data[url].focusBackgroundColor : "#F0F0F0";
                focusBackgroundColorSwitch.checked = data[url].focusBackgroundColor;
                updateColorHistory("focus-background");
                focusOutlineColor.disabled = !data[url].focusOutlineColor;
                focusOutlineColor.value = data[url].focusOutlineColor ? data[url].focusOutlineColor : "#8080FF";
                focusOutlineColorSwitch.checked = data[url].focusOutlineColor;
                updateColorHistory("focus-outline");
                document.getElementById("focus-state-elements").querySelectorAll('div[class="row1"]').forEach(d => {
                    d.style.padding = focusStateSwitch.isExpanded ? "15px" : "0 15px";
                    d.querySelectorAll("span,input,label").forEach(e => {
                        e.style.display = focusStateSwitch.isExpanded ? "inline-block" : "none";
                    });
                    setColorPickerAnimation(focusFontColorPicker, !focusStateSwitch.isExpanded
                        || !data[url].focusFontColor);
                    setColorPickerAnimation(focusBackgroundColorPicker, !focusStateSwitch.isExpanded
                        || !data[url].focusBackgroundColor);
                    setColorPickerAnimation(focusOutlineColorPicker, !focusStateSwitch.isExpanded
                        || !data[url].focusOutlineColor);
                });
                if (data[url].focusState) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        fetchScripts(["../contentScripts/focusState/focusState.js"], tabs);
                    });
                }

                otherSwitch.isExpanded = data[url].other;
                otherSwitch.style.transform = otherSwitch.isExpanded ? "rotate(90deg)" : "rotate(0deg)";
                document.getElementById("other-elements").querySelectorAll('div[class="row1"]').forEach(d => {
                    d.style.height = otherSwitch.isExpanded ? "20px" : "0";
                    d.style.padding = otherSwitch.isExpanded ? "15px" : "0 15px";
                    d.querySelectorAll('*').forEach(e => {
                        e.style.display = otherSwitch.isExpanded ? "inline-block" : "none";
                    });
                });

                if (data[url].lineSpacing) {
                    lineSpacing.value = data[url].lineSpacing;
                    console.log("on opening popup");
                    document.getElementById("line-spacing-value").textContent = data[url].lineSpacing + "%";
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        fetchScripts(["../contentScripts/lineSpacing/lineSpacing.js"], tabs);
                    });
                }
                else {
                    lineSpacing.value = 100;
                    document.getElementById("line-spacing-value").textContent = "100%";
                }

                distinguishVisitedLinks.checked = data[url].distinguishVisitedLinks;
                fetchScripts(["../contentScripts/distinguishVisitedLinks/distinguishVisitedLinks.js"], tabs);
            }
            else {
                fontColor.disabled = true;
                fontColor.value = "#222222";
                setColorPickerAnimation(fontColorPicker, true);
                fontColorSwitch.checked = false;
                backgroundColor.disabled = true;
                backgroundColor.value = "#F0F0F0";
                setColorPickerAnimation(backgroundColorPicker, true);
                backgroundColorSwitch.checked = false;

                selectionStateSwitch.isExpanded = false;
                selectionStateSwitch.style.transform = "rotate(0deg)";
                selectionFontColor.disabled = true;
                selectionFontColor.value = "#222222";
                selectionFontColorSwitch.checked = false;
                selectionBackgroundColor.disabled = true;
                selectionBackgroundColor.value = "#F0F0F0";
                selectionBackgroundColorSwitch.checked = false;
                document.getElementById("selection-state-elements").querySelectorAll('div[class="row1"]').forEach(d => {
                    d.style.padding = "0 15px";
                    // d.style.outlineTop = "none";
                    d.querySelectorAll("span,input,label").forEach(e => {
                        e.style.display = "none";
                    });
                    setColorPickerAnimation(selectionFontColorPicker, true);
                    setColorPickerAnimation(selectionBackgroundColorPicker, true);
                });

                hoverStateSwitch.isExpanded = false;
                hoverStateSwitch.style.transform = "rotate(0deg)";
                hoverFontColor.disabled = true;
                hoverFontColor.value = "#222222";
                hoverFontColorSwitch.checked = false;
                hoverBackgroundColor.disabled = true;
                hoverBackgroundColor.value = "#F0F0F0";
                hoverBackgroundColorSwitch.checked = false;
                document.getElementById("hover-state-elements").querySelectorAll('div[class="row1"]').forEach(d => {
                    d.style.padding = "0 15px";
                    d.querySelectorAll("span,input,label").forEach(e => {
                        e.style.display = "none";
                    });
                    setColorPickerAnimation(hoverFontColorPicker, true);
                    setColorPickerAnimation(hoverBackgroundColorPicker, true);
                });

                focusStateSwitch.isExpanded = false;
                focusStateSwitch.style.transform = "rotate(0deg)";
                focusFontColor.disabled = true;
                focusFontColor.value = "#222222";
                focusFontColorSwitch.checked = false;
                focusBackgroundColor.disabled = true;
                focusBackgroundColor.value = "#F0F0F0";
                focusBackgroundColorSwitch.checked = false;
                focusOutlineColor.disabled = true;
                focusOutlineColor.value = "#8080FF";
                focusOutlineColorSwitch.checked = false;
                document.getElementById("focus-state-elements").querySelectorAll('div[class="row1"]').forEach(d => {
                    d.style.padding = "0 15px";
                    d.querySelectorAll("span,input,label").forEach(e => {
                        e.style.display = "none";
                    });
                    setColorPickerAnimation(focusFontColorPicker, true);
                    setColorPickerAnimation(focusBackgroundColorPicker, true);
                    setColorPickerAnimation(focusOutlineColorPicker, true);
                });

                document.getElementById("other-elements").querySelectorAll("div").forEach(d => {
                    d.style.height = "0";
                    d.style.padding = "0 15px";
                    d.querySelectorAll('*').forEach(e => {
                        e.style.display = "none";
                    });
                });
            }
        });
    });
}, false);
