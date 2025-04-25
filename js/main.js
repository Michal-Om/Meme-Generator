'use strict';

console.log('hello');

let gElCanvas
let gCtx


let gText = {
    text: '',
    pos: { x: 200, y: 200 },// default pos
    font: 'Arial',
    color: 'black',
    size: 20,
}

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
}


function onSetText(text) {
    gText.text = text
    renderCanvas()
}


function renderCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    if (gText.text) {
        renderText()
    }
}

function renderText() {
    gCtx.font = `${gText.size}px ${gText.font}`
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillStyle = gText.color
    gCtx.fillText(gText.text, gText.pos.x, gText.pos.y)
}


function onDownloadCanvas(elLink) {
    const dataUrl = gElCanvas.toDataURL() //converts graphics data to an img format
    elLink.href = dataUrl //move img data to the link
    elLink.download = 'my-meme' //set a name for the downloded file
}


//Text Color
function onSetColor(color) {
    gText.color = color
    console.log('color:', color);
    renderCanvas()
}

//Text-size
function onSetSize(size) {
    gText.size = +size
    renderCanvas()
}

// function getEvPos(ev) {
//     const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

//     let pos = {
//         x: ev.offsetX,
//         y: ev.offsetY,
//     }

//     if (TOUCH_EVS.includes(ev.type)) {
//         // Prevent triggering the mouse ev
//         ev.preventDefault()
//         // Gets the first touch point
//         ev = ev.changedTouches[0]
//         // Calc the right pos according to the touch screen
//         pos = {
//             x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
//             y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
//         }
//     }
//     return pos
// }


function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}