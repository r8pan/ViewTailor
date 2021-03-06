import { RGB2Hex, dash2cc, fetchScripts } from "../utilities/utils.js";

export { initColorPicker, updateColorHistory, setCollapsedColorPickerAnimation, setColorPickerAnimation };

function initColorPicker(type) {
    let c = document.getElementById(type + "-color");
    let cs = document.getElementById(type + "-color-switch");
    let cp = document.getElementById(type + "-color-picker");
    initColorHistory(cp, type);

    c.onchange = () => {
        updateColorHistory(type, c.value);
        changeColor(false, c.value, type);
    };

    cs.onclick = () => {
        c.disabled = !c.disabled;
        setColorPickerAnimation(cp, c.disabled);
        changeColor(c.disabled, c.value, type);
    };
}

function initColorHistory(cp, type) {
    for (let i = 0; i < 5; i++) {
        let colorButton = document.createElement("BUTTON");
        colorButton.type = "button";
        colorButton.id = type + "-color-picker-" + i;
        colorButton.style.marginRight = "8px";
        colorButton.onclick = function() {
            let cp = document.getElementById(type + "-color");
            cp.value = RGB2Hex(this.style.backgroundColor);
            cp.dispatchEvent(new Event("change"));
        }
        colorButton.onkeyup = (event) => colorPickerKeyboardNavigation(event, type);
        cp.appendChild(colorButton);
    }
    cp.style.height = "0";
}

function colorPickerKeyboardNavigation(event, type) {
    let i = parseInt(document.activeElement.id.substring(document.activeElement.id.length-1));
    switch(event.which) {
        case 37:
            if (i === 0) break;
            document.getElementById(type+"-color-picker-"+(i-1)).focus();
            break;
        case 39:
            if (i === 4) break;
            document.getElementById(type+"-color-picker-"+(i+1)).focus();
            break;
        default:
            break;
    }
}

function updateColorHistory(type, color) {
    let key = dash2cc(type) + "ColorHistory";
    chrome.storage.local.get(key, data => {
        if (!data[key]) data[key] = [];
        console.log(type, data[key]);
        // if (data[key].length > 0) setColorHistory(type, data[key]);
        if (color) {
            if (data[key].length > 0 && !data[key].includes(color)) {
                data[key].unshift(color);
            }
            else data[key].push(color);
            data[key] = data[key].slice(0,5);
            chrome.storage.local.set({[key]: data[key]}, () => setColorHistory(type, data[key]));
        }
        else {
            setColorHistory(type, data[key])
        }
    });
}

function setColorHistory(type, colors) {
    let container = document.getElementById(type+"-color-picker");
    colors = colors.slice(0, 5);
    let cbs = container.querySelectorAll("button");
    for (let i = 0; i < colors.length; i++) {
        cbs[i].style.backgroundColor = colors[i];
    }
}

function changeColor(disabled, color, type) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.get(url, data => {
            if (!data[url]) data[url] = {};
            if (type.indexOf('-') > 0) {
                data[url][dash2cc(type)+"Color"] = disabled ? null : color;
                chrome.storage.local.set({[url]: data[url]}, () => {
                    let state = type.substring(0,type.indexOf('-'));
                    fetchScripts(["../contentScripts/"+state+"State/"+state+"State.js",
                        "../contentScripts/distinguishVisitedLinks/distinguishVisitedLinks.js"], tabs);
                });
            }
            else {
                data[url][type+"Color"] = disabled ? null : color;
                chrome.storage.local.set({[url]: data[url]}, () => {
                    fetchScripts(["../contentScripts/"+type+"Color/"+type+"Color.js",
                        "../contentScripts/distinguishVisitedLinks/distinguishVisitedLinks.js"], tabs);
                });
            }
        });
    });
}

function setCollapsedColorPickerAnimation(type, isExpanded, settings) {
    document.getElementById(type+"-state-elements").querySelectorAll('div[class="row1"]').forEach(d => {
        d.style.padding = isExpanded ? "15px" : "0 15px";
        d.querySelectorAll("span,input,label").forEach(e => {
            e.style.display = isExpanded ? "inline-block" : "none";
        });
        setColorPickerAnimation(document.getElementById(type+"-font-color-picker"), !isExpanded
            || !settings[type+"FontColor"]);
        setColorPickerAnimation(document.getElementById(type+"-background-color-picker"), !isExpanded
            || !settings[type+"BackgroundColor"]);
        if (type === "focus") {
            setColorPickerAnimation(document.getElementById(type+"-outline-color-picker"), !isExpanded
                || !settings[type+"OutlineColor"]);
        }
    });
}

function setColorPickerAnimation(cp, disabled) {
    cp.style.height = disabled ? "0" : "20px";
    cp.style.marginTop = disabled ? "0" : "8px";
    cp.querySelectorAll("button").forEach(b => {
        b.style.display = disabled ? "none" : "inline-block";
    });
}
