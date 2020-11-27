export { RGB2Hex, Hex2RGB };

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
