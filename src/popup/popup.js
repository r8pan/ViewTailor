import { RGB2Hex } from "../utilities/utilities.js";

let url = new URL(window.location.href);

//******************************************************************************

let fontColor = document.getElementById("font-color");
let fontColorSwitch = document.getElementById("font-color-switch");
let fontColorPicker = document.getElementById("font-color-picker");
let backgroundColor = document.getElementById("background-color");
let backgroundColorSwitch = document.getElementById("background-color-switch");
let backgroundColorPicker = document.getElementById("background-color-picker");
let lineSpacing = document.getElementById("line-spacing");
let focusHighlight = document.getElementById("focus-highlight");
let distinguishVisitedLinks = document.getElementById("distinguish-visited-links");

//color picker******************************************************************

// var colors = [
//     ["#000000", "黑色"], ["#4F2F4F", "紫罗兰"], ["#5C4033", "深棕"], ["#2F4F2F", "深绿"], ["#23238E", "海军蓝"],
//     ["#871F78", "深紫色"], ["#3232CD", "中蓝色"], ["#236B8E", "钢蓝色"], ["#8E6B23", "赭色"], ["#238E23", "森林绿"],
//     ["#A67D3D", "棕色"], ["#FF0000", "红色"], ["#0000FF", "蓝色"], ["#9F5F9F", "蓝紫色"], ["#DB7093", "紫红色"],
//     ["#FF1CAE", "粉红"], ["#FF00FF", "牡丹红"], ["#DB70DB", "淡紫色"], ["#E47833", "桔黄色"], ["#A68064", "中木色"],
//     ["#DB9370", "棕褐色"], ["#FF7F00", "橙色"], ["#A8A8A8", "灰色"], ["#C0C0C0", "浅灰色"],  ["#E9C2A6", "浅木色"],
//     ["#00FF00", "绿色"], ["#99CC32", "黄绿色"], ["#D9D919", "金色"], ["#EAADEA", "李子色"], ["#D8D8BF", "麦黄色"],
//     ["#66CCFF", "天蓝色"], ["#C0D0D9", "浅蓝色"], ["#D9D9F3", "石英色"], ["#DBDB70", "鲜黄色"], ["#00FF7F", "春绿色"],
//     ["#FFFF00", "黄色"], ["#00FFFF", "青色"], ["#E6E8FA", "银色"], ["#F9F9DF", "米色"], ["#FFFFFF", "白色"],
// ];
//
initHistoryColors("font");
initHistoryColors("background");

function initHistoryColors(type) {
    let cp = document.getElementById(type + "-color-picker");
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
        colorButton.onkeyup = (event) => keyboardNavigation(event, type);
        cp.appendChild(colorButton);
    }
    cp.style.height = "0";
}

function updateColorHistory(type, color) {
    let key = type+"ColorHistory";
    chrome.storage.local.get(key, data => {
        if (!data[key]) data[key] = [];
        console.log(type, data[key]);
        if (data[key].length > 0) setColorHistory(type, data[key]);
        if (color) {
            if (data[key].length > 0 && !data[key].includes(color)) {
                data[key].unshift(color);
                data[key] = data[key].slice(0,5);
            }
            else data[key].push(color);
            chrome.storage.local.set({[key]: data[key]}, () => setColorHistory(type, data[key]));
        }
    });
}

function setColorHistory(type, colors) {
    let containers = document.getElementsByClassName(type+"-color-history");
    colors = colors.slice(0, 5);
    [...containers].forEach(ch => {
        let cbs = ch.querySelectorAll("button");
        for (let i = 0; i < colors.length; i++) {
            console.log(colors, cbs);
            cbs[i].style.backgroundColor = colors[i];
        }
    });
}

function keyboardNavigation(event, type) {
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

fontColor.onchange = () => {
    updateColorHistory("font", fontColor.value);
    changeFontColor(false, fontColor.value);
};

fontColorSwitch.onclick = () => {
    fontColor.disabled = !fontColor.disabled;
    fontColorPicker.style.height = fontColor.disabled ? "0" : "20px";
    fontColorPicker.style.marginTop = fontColor.disabled ? "0" : "5px";
    fontColorPicker.querySelectorAll("button").forEach(b => {
        b.style.display = fontColor.disabled ? "none" : "inline-block";
    });
    changeFontColor(fontColor.disabled, fontColor.value);
};

function changeFontColor(disabled, color) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.get(url, data => {
            if (!data[url]) data[url] = {};
            data[url].fontColor = disabled ? null : color;
            chrome.storage.local.set({[url]: data[url]}, () => {
                fetchScripts(["../contentScripts/fontColor/fontColor.js",
                    "../contentScripts/distinguishVisitedLinks/distinguishVisitedLinks.js"], tabs);
            });
        });
    });
}

backgroundColor.onchange = () => {
    updateColorHistory("background", backgroundColor.value);
    changeBackgroundColor(false, backgroundColor.value);
};

backgroundColorSwitch.onclick = () => {
    backgroundColor.disabled = !backgroundColor.disabled;
    backgroundColorPicker.style.height = backgroundColor.disabled ? "0" : "20px";
    backgroundColorPicker.style.marginTop = backgroundColor.disabled ? "0" : "5px";
    backgroundColorPicker.querySelectorAll("button").forEach(b => {
        b.style.display = backgroundColor.disabled ? "none" : "inline-block";
    });
    changeBackgroundColor(backgroundColor.disabled, backgroundColor.value);
};

function changeBackgroundColor(disabled, color) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.get(url, data => {
            if (!data[url]) data[url] = {};
            data[url].backgroundColor = disabled ? null : color;
            chrome.storage.local.set({[url]: data[url]}, () => {
                fetchScripts(["../contentScripts/backgroundColor/backgroundColor.js",
                    "../contentScripts/distinguishVisitedLinks/distinguishVisitedLinks.js"], tabs);
            });
        });
    });
}

//**line-spacing****************************************************************

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


//**focus highlight*************************************************************
focusHighlight.onclick = element => {
    console.log("received focusHighlight click event");
    let isChecked = document.getElementById("focus-highlight").checked;
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.get(url, data => {
            if (!data[url]) data[url] = {};
            data[url].focusHighlight = isChecked;
            chrome.storage.local.set({[url]: data[url]}, () => {
                fetchScripts(["../contentScripts/focusHighlight/focusHighlight.js"], tabs);
            });
        });
    });
}

//**distinguish visited links***************************************************
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


//**on opening the popup********************************************************

document.addEventListener('DOMContentLoaded', () => {
    fontColor.disabled = true;
    backgroundColor.disabled = true;
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        console.log("current tab url: " + url);
        chrome.storage.local.get(url, data => {
            console.log(data[url]);
            if (data[url]) {

                fontColor.disabled = !data[url].fontColor;
                fontColor.value = data[url].fontColor ? data[url].fontColor : "#101010";
                fontColorPicker.style.height = fontColor.disabled ? "0" : "20px";
                fontColorPicker.style.marginTop = fontColor.disabled ? "0" : "5px";
                fontColorSwitch.checked = !!data[url].fontColor;
                fontColorPicker.querySelectorAll("button").forEach(b => {
                    b.style.display = fontColor.disabled ? "none" : "inline-block";
                });
                updateColorHistory("font");
                if (data[url].fontColor) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        fetchScripts(["../contentScripts/fontColor/fontColor.js"], tabs);
                    });
                }

                backgroundColor.disabled = !data[url].backgroundColor;
                backgroundColor.value = data[url].backgroundColor ? data[url].backgroundColor : "#FFFFFF";
                backgroundColorPicker.style.height = backgroundColor.disabled ? "0" : "20px";
                backgroundColorPicker.style.marginTop = backgroundColor.disabled ? "0" : "5px";
                backgroundColorSwitch.checked = !!data[url].backgroundColor;
                backgroundColorPicker.querySelectorAll("button").forEach(b => {
                    b.style.display = backgroundColor.disabled ? "none" : "inline-block";
                });
                updateColorHistory("background");
                if (data[url].backgroundColor) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        fetchScripts(["../contentScripts/backgroundColor/backgroundColor.js"], tabs);
                    });
                }

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

                focusHighlight.checked = data[url].focusHighlight;
                fetchScripts(["../contentScripts/focusHighlight/focusHighlight.js"], tabs);

                distinguishVisitedLinks.checked = data[url].distinguishVisitedLinks;
                fetchScripts(["../contentScripts/distinguishVisitedLinks/distinguishVisitedLinks.js"], tabs);
            }
        });
    });
}, false);

function fetchScripts(scripts, tabs) {
    if (scripts.length === 1) {
        fetch(scripts[0])
            .then(response => response.text())
            .then(text => {
                chrome.tabs.executeScript(tabs[0].id,
                    {code: text.substring(text.indexOf("var")), allFrames: true});
            });
    }
    else {
        fetch(scripts[0])
            .then(response => response.text())
            .then(text => {
                chrome.tabs.executeScript(tabs[0].id,
                    {code: text.substring(text.indexOf("var")), allFrames: true});
            })
            .then(() => {
                scripts.shift();
                fetchScripts(scripts, tabs);
            });
    }
}
