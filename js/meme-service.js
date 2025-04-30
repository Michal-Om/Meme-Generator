
'use strict';

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['Trump', 'angry'] },
    { id: 2, url: 'img/2.jpg', keywords: ['dog', 'puppies'] },
    { id: 3, url: 'img/3.jpg', keywords: ['baby', 'puppies'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cat', 'cute'] },
    { id: 5, url: 'img/5.jpg', keywords: ['baby', 'angry'] },
    { id: 6, url: 'img/6.jpg', keywords: ['hair', 'funny'] },
    { id: 7, url: 'img/7.jpg', keywords: ['baby', 'funny'] },
    { id: 8, url: 'img/8.jpg', keywords: ['wizard', 'fascinating'] },
    { id: 9, url: 'img/9.jpg', keywords: ['baby', 'funny'] },
    { id: 10, url: 'img/10.jpg', keywords: ['obama', 'funny'] },
    { id: 11, url: 'img/11.jpg', keywords: ['fight', 'angry'] },
    { id: 12, url: 'img/12.jpg', keywords: ['you', 'want'] },
    { id: 13, url: 'img/13.jpg', keywords: ['drink', 'smart'] },
    { id: 14, url: 'img/14.jpg', keywords: ['tough', 'bad'] },
    { id: 15, url: 'img/15.jpg', keywords: ['confident', 'tough'] },
    { id: 16, url: 'img/16.jpg', keywords: ['funny', 'joke'] },
    { id: 17, url: 'img/17.jpg', keywords: ['Putin', 'threat'] },
    { id: 18, url: 'img/18.jpg', keywords: ['confident', 'know'] },
]

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [

        {
            txt: '',
            font: 'Impact',
            size: 20,
            color: 'black',
            pos: { x: 200, y: 50 },// default pos top text
            isSelected: false,
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
    // console.log(gMeme);
}

function getSelectedLine() {
    // return gMeme.lines[gMeme.selectedLineIdx]
    return gMeme.lines.find(line => line.isSelected)
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
        font: 'Impact',
        size: 20,
        color: 'black',
        pos: { x: 200, y: 50 + (lineIdx * 40) },
        isSelected: false,
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = lineIdx
    console.log('gMeme lines:', gMeme.lines)
    console.log('new line idx:', lineIdx);

    renderNewLine(lineIdx)
}

//bounds of text
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

function removeLastLine() {
    //remove from model
    gMeme.lines.pop()
}