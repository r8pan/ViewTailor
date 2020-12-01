export { RGB2Hex, Hex2RGB, cc2Dash, dash2cc, fetchScripts };

function RGB2Hex(rgb) {
    return '#' + rgb.substring(4, rgb.length-1).replace(/\s+/g, '').split(',')
        .map(c => {
            let result = parseInt(c).toString(16);
            if (result < 10) result = '0' + result;
            return result;
        }).join('');
}

function Hex2RGB(hex) {
    return "rgb(" + hex.substring(1).match(/.{2}/g).map(c => parseInt(c, 16))
        .join(',') + ')';
}

function cc2Dash(string) {
    return string.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
}

function dash2cc(string) {
    return string.replace(/-([a-z])/g, m => m[1].toUpperCase());
}

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
