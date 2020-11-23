let url = new URL(window.location.href);

//******************************************************************************
let lineSpacing = document.getElementById("line-spacing");
let focusHighlight = document.getElementById("focus-highlight");
let distinguishVisitedLinks = document.getElementById("distinguish-visited-links");
let fontColor = document.getElementById("font-color");
let backgroundColor = document.getElementById("background-color");
let originalColor = document.getElementById("original-color");
let fbgColor;

//color picker******************************************************************

var colors = [
    ["#000000", "黑色"], ["#4F2F4F", "紫罗兰"], ["#5C4033", "深棕"], ["#2F4F2F", "深绿"], ["#23238E", "海军蓝"],
    ["#871F78", "深紫色"], ["#3232CD", "中蓝色"], ["#236B8E", "钢蓝色"], ["#8E6B23", "赭色"], ["#238E23", "森林绿"],
    ["#A67D3D", "棕色"], ["#FF0000", "红色"], ["#0000FF", "蓝色"], ["#9F5F9F", "蓝紫色"], ["#DB7093", "紫红色"],
    ["#FF1CAE", "粉红"], ["#FF00FF", "牡丹红"], ["#DB70DB", "淡紫色"], ["#E47833", "桔黄色"], ["#A68064", "中木色"],
    ["#DB9370", "棕褐色"], ["#FF7F00", "橙色"], ["#A8A8A8", "灰色"], ["#C0C0C0", "浅灰色"],  ["#E9C2A6", "浅木色"],
    ["#00FF00", "绿色"], ["#99CC32", "黄绿色"], ["#D9D919", "金色"], ["#EAADEA", "李子色"], ["#D8D8BF", "麦黄色"],
    ["#66CCFF", "天蓝色"], ["#C0D0D9", "浅蓝色"], ["#D9D9F3", "石英色"], ["#DBDB70", "鲜黄色"], ["#00FF7F", "春绿色"],
    ["#FFFF00", "黄色"], ["#00FFFF", "青色"], ["#E6E8FA", "银色"], ["#F9F9DF", "米色"], ["#FFFFFF", "白色"],
];

let colorPicker = document.getElementById("color-picker");
for (let i = 0; i < colors.length; i++) {
    let colorButton = document.createElement("BUTTON");
    colorButton.type = "button";
    colorButton.id = "color-picker-" + i;
    colorButton.style.backgroundColor = colors[i][0];
    colorButton.style.margin = "0 3px";
    colorButton.title = colors[i][1];
    colorButton.onclick = function() {
        console.log("onclick: " + this);
        changeColor(this, colors[i][0]);
    }
    colorButton.onkeydown = (event) => keyboardNavigation(event);
    colorPicker.appendChild(colorButton);
}

function changeColor(button, c) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        chrome.storage.local.get(url, data => {
            if (!data[url]) data[url] = {};
            if (fbgColor === "fontColor") {
                data[url].fontColor = c;
                fontColor.style.backgroundColor = c;
                chrome.storage.local.set({[url]: data[url]}, () => {
                    fetch('src/contentScripts/fontColor/fontColor.js')
                        .then(response => response.text())
                        .then(text => {
                            chrome.tabs.executeScript(tabs[0].id,
                                {code: text.substring(text.indexOf("var")), allFrames: true});
                        });
                });
            }
            else {
                data[url].backgroundColor = c;
                backgroundColor.style.backgroundColor = c;
                chrome.storage.local.set({[url]: data[url]}, () => {
                    fetch('src/contentScripts/backgroundColor/backgroundColor.js')
                        .then(response => response.text())
                        .then(text => {
                            chrome.tabs.executeScript(tabs[0].id,
                                {code: text.substring(text.indexOf("var")), allFrames: true});
                        });
                });
            }
        });
    });
};

function keyboardNavigation(event) {
    let i = parseInt(document.activeElement.id.substring(13));
    switch(event.which) {
        case 37:
            if (i === 0) document.getElementById("original-color").focus();
            document.getElementById("color-picker-"+(i-1)).focus();
            break;
        case 38:
            if (i === 0) document.getElementById("original-color").focus();
            if (i < 10) break;
            document.getElementById("color-picker-"+(i-10)).focus();
            break;
        case 39:
            if (i === 39) break;
            document.getElementById("color-picker-"+(i+1)).focus();
            break;
        case 40:
            if (i > 29) break;
            document.getElementById("color-picker-"+(i+10)).focus();
            break;
        case 90:
            colorPicker.style.display = "none";
            fontColor.focus();
            break;
        default:
            break;
    }
}

//******************************************************************************

fontColor.onclick = () => {
    if (colorPicker.style.display === "") colorPicker.style.display = "none";
    colorPicker.style.display = colorPicker.style.display === "none" || fbgColor === "backgroundColor" ? "block" : "none";
    fbgColor = "fontColor";
    if (document.activeElement === fontColor && colorPicker.style.display === "block") {
        fontColor.blur();
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            let url = (new URL(tabs[0].url)).hostname;
            chrome.storage.local.get(url, data => {
                if (!data[url] || (data[url] && !data[url].fontColor)) originalColor.focus();
                else {
                    for (let i = 0; i < colors.length; i++) {
                        if (colors[i][0] === data[url].fontColor) {
                            document.getElementById("color-picker-"+i).focus();
                            break;
                        }
                    }
                }
            });
        });
    }
};

backgroundColor.onclick = () => {
    if (colorPicker.style.display === "") colorPicker.style.display = "none";
    colorPicker.style.display = colorPicker.style.display === "none" || fbgColor === "fontColor" ? "block" : "none";
    fbgColor = "backgroundColor";
    if (document.activeElement === backgroundColor && colorPicker.style.display === "block") {
        backgroundColor.blur();
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            let url = (new URL(tabs[0].url)).hostname;
            chrome.storage.local.get(url, data => {
                if (!data[url] || (data[url] && !data[url].backgroundColor)) originalColor.focus();
                else {
                    for (let i = 0; i < colors.length; i++) {
                        if (colors[i][0] === data[url].backgroundColor) {
                            document.getElementById("color-picker-"+i).focus();
                            break;
                        }
                    }
                }
            });
        });
    }
};

originalColor.onclick = () => {
    changeColor(this, null);
};

originalColor.onkeydown = (event) => {
    if (event.which === 39 || event.which === 40) {
        document.getElementById("color-picker-0").focus();
    }
    if (event.which === 90) {
        colorPicker.style.display = "none";
        fontColor.focus();
    }
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
                fetch('src/contentScripts/lineSpacing/lineSpacing.js')
                    .then(response => response.text())
                    .then(text => {
                        chrome.tabs.executeScript(tabs[0].id,
                            {code: text.substring(text.indexOf("var")), allFrames: true});
                    });
            });
        });
    });
};


//**focus highlight*************************************************************
focusHighlight.onclick = element => {
    console.log("received focusHighlight click event");
    let isChecked = document.getElementById("focus-highlight").checked;
    if (isChecked) {
        console.log("Enabled");
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.executeScript(tabs[0].id,
                {file: "src/contentScripts/focusHighlight/enable.js", allFrames: true});
            });
    }
    else {
        console.log("Disabled");
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.executeScript(tabs[0].id,
                {file: "src/contentScripts/focusHighlight/disable.js", allFrames: true});
            });
    }
}

//**distinguish visited links***************************************************
distinguishVisitedLinks.onclick = element => {
    console.log("received distinguishVisitedLinks click event");
    let isChecked = document.getElementById("distinguish-visited-links").checked;
    if (isChecked) {
        console.log("Enabled");
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.executeScript(tabs[0].id,
                {file: "src/contentScripts/distinguishVisitedLinks/enable.js", allFrames: true});
            });
    }
    else {
        console.log("Disabled");
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.executeScript(tabs[0].id,
                {file: "src/contentScripts/distinguishVisitedLinks/disable.js", allFrames: true});
            });
    }
}


//**on opening the popup********************************************************

document.addEventListener('DOMContentLoaded', () => {
    console.log();
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = (new URL(tabs[0].url)).hostname;
        console.log("current tab url: " + url);
        chrome.storage.local.get(url, data => {
            console.log(data[url]);
            if (data[url]) {
                fontColor.style.backgroundColor = data[url].fontColor;
                backgroundColor.style.backgroundColor = data[url].backgroundColor;
                if (data[url].fontColor) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        fetch('src/contentScripts/fontColor/fontColor.js')
                            .then(response => response.text())
                            .then(text => {
                                chrome.tabs.executeScript(tabs[0].id,
                                    {code: text.substring(text.indexOf("var")), allFrames: true});
                            });
                    });
                }
                if (data[url].backgroundColor) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        fetch('src/contentScripts/backgroundColor/backgroundColor.js')
                            .then(response => response.text())
                            .then(text => {
                                chrome.tabs.executeScript(tabs[0].id,
                                    {code: text.substring(text.indexOf("var")), allFrames: true});
                            });
                    });
                }
                if (data[url].lineSpacing) {
                    lineSpacing.value = data[url].lineSpacing;
                    console.log("on opening popup");
                    document.getElementById("line-spacing-value").textContent = data[url].lineSpacing + "%";
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        fetch('src/contentScripts/lineSpacing/lineSpacing.js')
                            .then(response => response.text())
                            .then(text => {
                                chrome.tabs.executeScript(tabs[0].id,
                                    {code: text.substring(text.indexOf("var")), allFrames: true});
                            });
                    });
                }
                else {
                    lineSpacing.value = 100;
                    document.getElementById("line-spacing-value").textContent = "100%";
                }

                focusHighlight.checked = data[url].focusHighlight;
                if (data[url].focusHighlight) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        chrome.tabs.executeScript(tabs[0].id,
                            {file: "src/contentScripts/focusHighlight/enable.js", allFrames: true});
                        });
                }
                else if (data[url].focusHighlight == false) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        chrome.tabs.executeScript(tabs[0].id,
                            {file: "src/contentScripts/focusHighlight/disable.js", allFrames: true});
                        });
                }

                distinguishVisitedLinks.checked = data[url].distinguishVisitedLinks;
                if (data[url].distinguishVisitedLinks) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        chrome.tabs.executeScript(tabs[0].id,
                            {file: "src/contentScripts/distinguishVisitedLinks/enable.js", allFrames: true});
                        });
                }
                else if (data[url].distinguishVisitedLinks == false) {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        chrome.tabs.executeScript(tabs[0].id,
                            {file: "src/contentScripts/distinguishVisitedLinks/disable.js", allFrames: true});
                        });
                }
            }
        });
    });
}, false);
