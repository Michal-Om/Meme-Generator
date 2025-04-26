
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
            pos: { x: 150, y: 50 },// default pos
        }
    ],
    img: null,
}
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}


function setLineText(text) {
    const line = getSelectedLine()
    line.txt = text
}

function getSelectedLine() {
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

