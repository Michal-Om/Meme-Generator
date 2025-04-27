
'use strict';

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['Trump'] },
    { id: 2, url: 'img/2.jpg', keywords: ['dog', 'puppies'] }
]

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [

        {
            txt: '',
            font: 'Arial',
            size: 20,
            color: 'black',
            pos: { x: 150, y: 50 },// default pos top text
        },

    ],
    img: null,
}
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function setLineText(text, idx) {
    const line = gMeme.lines[idx]
    line.txt = text
    console.log('updated line:', line.txt);
    console.log(gMeme);
}

function getSelectedLine() { //used for actions on a specific line, like editing
    return gMeme.lines[gMeme.selectedLineIdx]
}


function getImgById(imgId) {
    const img = gImgs.find(img => +imgId === img.id)
    return img
}


function setImg(imgId) {
    const selectedImg = getImgById(imgId)
    const img = new Image()
    img.src = selectedImg.url
    img.onload = () => {
        gMeme.img = img  // store selected img in object
        renderMeme() // render only after image is loaded
    }
}

function createLine() {
    const lineIdx = gMeme.lines.length //curr length

    const newLine = {
        txt: '',
        font: 'Arial',
        size: 20,
        color: 'black',
        pos: { x: 150, y: 50 + (lineIdx * 40) },
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = lineIdx
    console.log('gMeme lines:', gMeme.lines)
    console.log('new line idx:', lineIdx);

    renderNewLine(lineIdx)
}

function findLineAtPosition(offsetX, offsetY) {
    const line = gMeme.lines.find(line => {
        gCtx.font = `${line.size}px ${line.font}` //curr font settings
        const textHeight = line.size
        const textWidth = gCtx.measureText(line.txt).width

        const xStart = line.pos.x - (textWidth / 2)
        const xEnd = line.pos.x + (textWidth / 2)
        const yStart = line.pos.y - (textHeight / 2)
        const yEnd = line.pos.y + (textHeight / 2)

        return offsetX >= xStart && offsetX <= xEnd
            && offsetY >= yStart && offsetY <= yEnd
    })
    // console.log('line found at position:', line);
    return line
}