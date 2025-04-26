'use strict';

let gElCanvas
let gCtx


function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    renderGallery()
}


function onSetText(text, idx) {
    console.log('onSetText:', text, 'at idx:', idx)
    setLineText(text, idx)
    renderMeme()
}


function renderMeme() {
    // const line = getSelectedLine() // renders only one line
    console.log('Rendering Meme...');

    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);

    if (gMeme.img) {
        gCtx.drawImage(gMeme.img, 0, 0, gElCanvas.width, gElCanvas.height)
    }
    gMeme.lines.forEach(line => { //render all existing text lines 
        if (line.txt) {
            renderText(line)
        }
    })

}


function renderText(line) {
    console.log('curr line at render text:', line)

    gCtx.font = `${line.size}px ${line.font}`
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillStyle = line.color
    gCtx.fillText(line.txt, line.pos.x, line.pos.y)
    console.log('Rendering text:', line.txt, 'at position:', line.pos)
}

//Text Color
function onSetColor(color) {
    const line = getSelectedLine()
    line.color = color
    renderMeme()
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

function onDownloadCanvas(elLink) {
    const dataUrl = gElCanvas.toDataURL() //converts graphics data to an img format
    elLink.href = dataUrl //move img data to the link
    elLink.download = 'my-meme' //set a name for the downloded file
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

//Images

function onImgSelect(imgId) {
    setImg(imgId)
    showEditor()// toggle somehow
}

//Pages toggle
function showEditor() {
    document.querySelector('.editor').classList.add('active')
    document.querySelector('.gallery').classList.remove('active')

}

function showGallery() {
    document.querySelector('.gallery').classList.add('active')
    document.querySelector('.editor').classList.remove('active')

}

//Font Size changes
function onFontSizeUp(size) {
    const line = getSelectedLine()
    if (line.size >= 100) return
    line.size += size
    console.log('current font size:', line.size);
    renderMeme()
}

function onFontSizeDown(size) {
    const line = getSelectedLine()
    if (line.size <= 10) return
    console.log('font size before:', line.size);
    line.size -= size
    console.log('current font size:', line.size);
    renderMeme()
}

//Add Text lines
function onAddLine() {
    createLine() //model
}

function renderNewLine(idx) {
    console.log('rendering new line input with idx:', idx)
    const elNewLine = document.querySelector('.text-lines-container')
    elNewLine.innerHTML += `
<input 
type="search" 
class="text-line" 
name="text" 
placeholder="Line ${idx + 1}" 
onclick="onSelectLine(this, ${idx})" 
onfocus="onFocusLine(${idx})" 
oninput="onSetText(this.value, ${idx})">
`
}

function onFocusLine(idx) {
    gMeme.selectedLineIdx = idx
}

function onSelectLine(elLine, idx) {
    console.log('onSelectLine called with idx:', idx)

    gMeme.selectedLineIdx = idx  //model
    const elInputs = document.querySelectorAll('.text-line')
    elInputs.forEach(input => input.classList.remove('selected'))
    elLine.classList.add('selected')
}

