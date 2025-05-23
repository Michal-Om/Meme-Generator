
'use strict'

const STORAGE_KEY = 'memeDB'

var gMemes = loadFromStorage(STORAGE_KEY) || []

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [

        {
            txt: 'Sometimes I eat Falafel',
            font: 'Impact',
            size: 20,
            color: 'white',
            pos: { x: 200, y: 50 },// default pos top text
            align: 'center',
            isOutline: false,
            isSelected: false,
        },

    ],
    emojis: [],
    selectedEmoji: null,
    img: null,
}

var gRandomLines = [
    'When you wanna shoot, shoot',
    'Am I high maintenance??',
    'Go ahead, make my day',
    'Show me the money!',
    'Fun fact,'
]

//get data from gMemes:
function getMemeImg() {
    return gMeme.img;
}

function getMemeTextLines() {
    return gMeme.lines;
}

// handle ready memes
function getMemes() {
    return gMemes
}

function removeMeme(memeId) {
    const memeIdx = gMemes.findIndex(meme => memeId === meme.id)
    gMemes.splice(memeIdx, 1)
    _saveMemesToStorage()
}

function addMeme(data) {
    const meme = _createMeme(data)
    //add to beginning of array
    gMemes.unshift(meme)
    _saveMemesToStorage()
    return meme
}

function getMemeById(memeId) {
    const meme = gMemes.find(meme => memeId === meme.id)
    return meme
}

function creatRandomMeme() {
    var randomSelectedImg = getRandImg()
    var randomSelectedLine = gRandomLines[Math.floor(Math.random() * gRandomLines.length)]

    gMeme.lines = [{
        txt: randomSelectedLine,
        font: 'Impact',
        size: 30,
        color: 'white',
        pos: { x: 200, y: 50 },
        align: 'center',
        isSelected: true,
        isOutline: false,
    }]
    gMeme.selectedLineIdx = 0
    gMeme.selectedImgId = randomSelectedImg.id
    onImgSelect(randomSelectedImg.id)

    return randomSelectedLine
}

function _createMeme(data) {
    return {
        id: makeId(),
        createdAt: Date.now(),
        data
    }
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gMemes)
}

//Handle emojis
function getMemeEmojis() {
    return gMeme.emojis;
}

function getSelectedEmoji() {
    return gMeme.selectedEmoji
}

function setSelectedEmoji(elEmoji) {
    gMeme.selectedEmoji = elEmoji
}

function addEmojiToMeme(img, pos, size) {
    gMeme.emojis.push(img, pos, size)
}


//Handle Text Lines
function setLineText(text, idx) {
    const line = gMeme.lines[idx]
    line.txt = text
}

function getSelectedLine() {
    return gMeme.lines.find(line => line.isSelected)
}

function setSelectedLineIdx(idx) {
    gMeme.selectedLineIdx = idx
    gMeme.lines[idx].isSelected = true
}

function createLine() {
    const lineIdx = gMeme.lines.length //curr length

    const newLine = {
        txt: '',
        font: 'Impact',
        size: 20,
        color: 'black',
        pos: { x: 200, y: 50 + (lineIdx * 40) },
        align: 'center',
        isSelected: false,
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = lineIdx
    console.log('gMeme lines:', gMeme.lines)
    console.log('new line idx:', lineIdx);

    renderNewLine(lineIdx)
}

function getFirstLine() {
    return gMeme.lines[0].txt
}

function unSelectAllLines() {
    gMeme.lines.forEach(line => line.isSelected = false)
}

//bounds of text
function findLineAtPosition(offsetX, offsetY) {
    const line = gMeme.lines.find(line => {
        gCtx.font = `${line.size}px ${line.font}` //curr font settings
        const textHeight = line.size //font size is height
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





