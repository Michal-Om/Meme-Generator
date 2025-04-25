
'use strict';

let gText

function createText(text, pos) {
    gText = {
        text,
        pos,
        color: 'black',
        size: 5,
    }
}

function getText() {
    return gText
}
