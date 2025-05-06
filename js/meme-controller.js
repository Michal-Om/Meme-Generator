'use strict';

let gElCanvas
let gCtx
let gIsMouseDown = false


function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    renderGallery()
    const firstLine = gMeme.lines[0].txt
    const elInput = document.querySelector(`.text-line[data-index="0"]`)
    elInput.value = firstLine
    renderMeme()
}

function renderMeme() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);

    if (gMeme.img) {
        gElCanvas.height = (gMeme.img.naturalHeight / gMeme.img.naturalWidth) * gElCanvas.width
        gCtx.drawImage(gMeme.img, 0, 0, gElCanvas.width, gElCanvas.height)
    }
    gMeme.emojis.forEach(emoji => {
        gCtx.drawImage(emoji.img, emoji.pos.x, emoji.pos.y, emoji.size, emoji.size)
    })
    gMeme.lines.forEach(line => { //render all existing text lines 
        if (line.txt) {
            renderText(line)
        }
    })
}

function onSetText(text, idx) {
    setLineText(text, idx)
    renderMeme()
}

function renderText(line) {
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.textAlign = line.align
    gCtx.textBaseline = 'middle'
    gCtx.fillStyle = line.color
    gCtx.fillText(line.txt, line.pos.x, line.pos.y)

    if (line.isOutline) {
        gCtx.strokeStyle = 'black'
        gCtx.lineWidth = 1
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y)
    }
}

function getEvPos(ev) {

    const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        // Prevent triggering the mouse ev
        ev.preventDefault()
        // Gets the first touch point
        ev = ev.changedTouches[0]
        // Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

//Emojis
function onSelectEmoji(elEmoji) {
    elEmoji.classList.add('selected')
    if (gMeme.selectedEmoji) gMeme.selectedEmoji.classList.remove('selected')
    if (gMeme.selectedEmoji === elEmoji) {
        gMeme.selectedEmoji = null
    } else {
        gMeme.selectedEmoji = elEmoji
    }
    console.log('selected emoji:', gMeme.selectedEmoji);
}

function unSelectEmoji() {
    const elEmoji = document.querySelector('.emojis-container img.selected')
    if (!elEmoji) return
    elEmoji.classList.remove('selected')
    gMeme.selectedEmoji = null
}

function onDown(ev) {
    console.log('onDown');
    gIsMouseDown = true
    if (gMeme.selectedEmoji) {
        const pos = getEvPos(ev)
        gCtx.drawImage(gMeme.selectedEmoji, pos.x - 20, pos.y - 20, 40, 40)
        gMeme.emojis.push({
            img: gMeme.selectedEmoji,
            pos: { x: pos.x - 20, y: pos.y - 20 },
            size: 40,
        })
        return
    }
}

function onUp() {
    gIsMouseDown = false
}

//Pages toggle
function showEditor() {
    document.querySelector('.editor').classList.add('active')
    document.querySelector('.gallery').classList.remove('active')
    document.querySelector('.saved-memes').classList.remove('active')
}

function showGallery() {
    document.querySelector('.gallery').classList.add('active')
    document.querySelector('.editor').classList.remove('active')
    document.querySelector('.saved-memes').classList.remove('active')
}

function showSavedMemes() {
    document.querySelector('.saved-memes').classList.add('active')
    document.querySelector('.gallery').classList.remove('active')
    document.querySelector('.editor').classList.remove('active')
    renderSavedMemes()
}

//Font changes
function onFontSizeUp(size) {
    const line = getSelectedLine()
    if (!line) {
        showMsg('Please Select a Line To Edit')
        return
    }
    if (line.size >= 100) return
    line.size += size
    unSelectEmoji()
    renderMeme()
}

function onFontSizeDown(size) {
    const line = getSelectedLine()
    if (!line) {
        showMsg('Please Select a Line To Edit')
        return
    }
    if (line.size <= 10) return
    line.size -= size
    unSelectEmoji()
    renderMeme()
}

function onFontChange(font) {
    const line = getSelectedLine()
    if (!line) {
        showMsg('Please Select a Line To Edit')
        return
    }
    line.font = font
    unSelectEmoji()
    renderMeme()
}

function onAlignLeft() {
    const line = getSelectedLine()
    if (!line) {
        showMsg('Please Select a Line To Edit')
        return
    }
    line.align = 'left'
    line.pos.x = 20
    unSelectEmoji()
    renderMeme()
}

function onAlignCenter() {
    const line = getSelectedLine()
    if (!line) {
        showMsg('Please Select a Line To Edit')
        return
    }
    line.align = 'center'
    line.pos.x = gElCanvas.width / 2.
    unSelectEmoji()
    renderMeme()
}

function onAlignRight() {
    const line = getSelectedLine()
    if (!line) {
        showMsg('Please Select a Line To Edit')
        return
    }
    line.align = 'right'
    line.pos.x = gElCanvas.width - 20
    unSelectEmoji()
    renderMeme()
}

function onFontOutline() {
    const line = getSelectedLine()
    if (!line) {
        showMsg('Please Select a Line To Edit')
        return
    }
    line.isOutline = !line.isOutline
    renderMeme()
}

//Text Color
function onSetColor(color) {
    const line = getSelectedLine()
    if (!line) {
        showMsg('Please Select a Line To Edit')
        return
    }
    line.color = color
    unSelectEmoji()
    renderMeme()
}

//Text lines Actions
function onAddLine() {
    createLine()
}

function onRemoveLine() {
    if (gMeme.lines.length === 1) {
        showMsg('Last Line Cannot Be Deleted!');
        return
    }
    removeLastLine()
    const elInputs = document.querySelectorAll('.text-line') //node list
    const elLastInput = elInputs[elInputs.length - 1]

    const inputContainer = document.querySelector('.text-lines-container') //parent
    inputContainer.removeChild(elLastInput)
    renderMeme()
}

function onMoveLineUp() {
    const line = getSelectedLine();
    if (!line) {
        showMsg('Please Select a Line To Edit')
        return
    }
    line.pos.y -= 1
    console.log(line.pos.y);
    unSelectEmoji()
    renderMeme()
}

function onMoveLineDown() {
    const line = getSelectedLine();
    if (!line) {
        showMsg('Please Select a Line To Edit')
        return
    }
    line.pos.y += 3
    unSelectEmoji()
    renderMeme()
}

function renderNewLine(idx) {
    console.log('rendering new line input with idx:', idx)
    const elNewLine = document.createElement('input')

    //set input attributes (like properties in an object)
    elNewLine.type = 'search'
    elNewLine.classList.add('text-line')
    elNewLine.name = 'text'
    elNewLine.placeholder = `Line ${idx + 1}`

    elNewLine.setAttribute('oninput', `onSetText(this.value, ${idx})`)
    elNewLine.setAttribute('data-index', idx) //data-index="1"
    //to retrieve: elNewLine.dataset.index; or .getAttribute('data-index')

    elNewLine.addEventListener('click', () => onSelectLine(elNewLine, idx))

    const inputDiv = document.querySelector('.text-lines-container')
    inputDiv.appendChild(elNewLine)
}

function onSelectLine(elLine, idx) {
    gMeme.lines.forEach(line => line.isSelected = false)
    gMeme.selectedLineIdx = idx
    const selectedLine = gMeme.lines[idx]

    selectedLine.isSelected = true

    const elInputs = document.querySelectorAll('.text-line')
    elInputs.forEach(input => input.classList.remove('selected'))
    elLine.classList.add('selected')
    unSelectEmoji()
    renderMeme()

    if (!selectedLine.txt) return
    drawRect(selectedLine.pos.x, selectedLine.pos.y)
}

function unSelectLine(line) {
    //model
    line.isSelected = false
    //unselect all in dom
    const elInputs = document.querySelectorAll('.text-line')
    elInputs.forEach(input => input.classList.remove('selected'))

    renderMeme()
}

function onSwitchLine() {
    //collect all inputs
    const elInputs = document.querySelectorAll('.text-line')
    const currNumLines = elInputs.length

    //find currently selected input
    const currInput = document.querySelector('.text-line.selected')
    if (!currInput) return

    let currInputIdx = +currInput.dataset.index
    console.log('Input Idx before switch:', currInputIdx);

    //remove class selected from all -> maybe not needed from all?
    elInputs.forEach(input => input.classList.remove('selected'))

    let nextInputIdx = currInputIdx + 1
    if (nextInputIdx === currNumLines) {
        nextInputIdx = 0
    }
    elInputs[nextInputIdx].classList.add('selected')
    console.log('Input Idx after switch:', nextInputIdx);

    //update model
    gMeme.selectedLineIdx = nextInputIdx
    const nextInputLine = gMeme.lines[nextInputIdx]
    nextInputLine.isSelected = true
    clearRect()
    drawRect(nextInputLine.pos.x, nextInputLine.pos.y)
    console.log(gMeme.lines);

}

function onCanvasClick(ev) {
    const { offsetX, offsetY } = ev
    // console.log('offsetX, offsetY:', offsetX, offsetY);
    const clickedLine = findLineAtPosition(offsetX, offsetY) // returns object
    if (!clickedLine) return

    // Find the position of the selected line and draw rect arount it
    drawRect(clickedLine.pos.x, clickedLine.pos.y)

    //unselect if already selected
    if (clickedLine.isSelected) {
        unSelectLine(clickedLine)
        clearRect()
        return
    } else {
        gMeme.lines.forEach(line => line.isSelected = false)
        clickedLine.isSelected = true
    }
    const idx = gMeme.lines.indexOf(clickedLine);
    //select line input
    const elInput = document.querySelector(`.text-line[data-index="${idx}"]`)
    onSelectLine(elInput, idx)
}

function drawRect(x, y) {
    gCtx.beginPath();
    const line = getSelectedLine()

    if (!line) return
    line.isSelected = true
    gCtx.font = `${line.size}px ${line.font}`
    const textHeight = line.size
    const textWidth = gCtx.measureText(line.txt).width

    //padding around the text
    const padding = 10

    //text is centered so position rect accordingly
    const rectX = x - textWidth / 2 - padding // start with more space to the left
    const rectY = y - textHeight / 2 - padding // more space to the top

    gCtx.strokeStyle = 'red'
    gCtx.strokeRect(rectX, rectY, textWidth + padding * 2, textHeight + padding * 2)
}

function clearRect() {
    const line = getSelectedLine();
    if (!line) return;

    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height); // Clear the entire canvas

    // re-render image if there's one set
    if (gMeme.img) {
        gCtx.drawImage(gMeme.img, 0, 0, gElCanvas.width, gElCanvas.height);
    }
    renderMeme();
}

//Saved Memes actions
function renderSavedMemes() {
    const memes = getMemes()
    const elMemes = document.querySelector('.saved-memes-grid')
    elMemes.innerHTML = memes.map(meme => {
        return `
        <article>
            <button onclick="onRemoveMeme('${meme.id}')" class="remove-btn btn flex align-center justify-center">x</button>
            <img src="${meme.data}" onclick="onSelectMeme('${meme.id}')">
        </article>
        `
    }).join('')
}

function onSelectMeme(memeId) {
    const meme = getMemeById(memeId)
    const img = new Image()
    img.src = meme.data
    renderImg(img)
}

function onRemoveMeme(memeId) {
    removeMeme(memeId)
    renderSavedMemes()
}

function onSave() {
    showMsg('Your Meme Has Been Saved Successfully🎈')
    const data = gElCanvas.toDataURL()
    addMeme(data)
    renderSavedMemes()

}

function showMsg(msg) {
    const elMsg = document.querySelector('.saved-msg')
    elMsg.innerText = msg
    elMsg.classList.remove('hide')

    setTimeout(() => {
        elMsg.classList.add('hide')
    }, 2000)
}

//more actions
function onDownloadCanvas(elLink) {
    const dataUrl = gElCanvas.toDataURL() //converts graphics data to an img format
    elLink.href = dataUrl //move img data to the link
    elLink.download = 'my-meme' //set a name for the downloded file
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    gMeme.lines.forEach(line => {
        line.isSelected = false
        line.txt = ''
    })
    gMeme.img = null
    gMeme.emojis = []
    gMeme.selectedEmoji = null
}

function toggleMenu() {
    document.body.classList.toggle("menu-open");
}

function onCreateRandomMeme() {
    var randomSelectedImg = gImgs[Math.floor(Math.random() * gImgs.length)]
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

    onImgSelect(randomSelectedImg.id)
    gMeme.selectedImgId = randomSelectedImg.id

    const randomLine = gMeme.lines[0].txt
    const elInput = document.querySelector(`.text-line[data-index="0"]`)
    elInput.value = randomLine
}
