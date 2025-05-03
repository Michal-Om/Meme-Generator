'use strict';

let gElCanvas
let gCtx


function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    renderGallery()
    const firstLine = gMeme.lines[0].txt
    const elInput = document.querySelector(`.text-line[data-index="0"]`)
    elInput.value = firstLine
    renderMeme()

}

function onSetText(text, idx) {
    console.log('onSetText:', text, 'at idx:', idx)
    setLineText(text, idx)
    renderMeme()
}

function renderMeme() {
    // console.log('Rendering Meme...');

    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);

    if (gMeme.img) {
        gElCanvas.height = (gMeme.img.naturalHeight / gMeme.img.naturalWidth) * gElCanvas.width
        gCtx.drawImage(gMeme.img, 0, 0, gElCanvas.width, gElCanvas.height)
    }
    gMeme.lines.forEach(line => { //render all existing text lines 
        if (line.txt) {
            renderText(line)
        }
    })
}

function renderText(line) {
    // console.log('curr line at render text:', line)
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.textAlign = line.align
    gCtx.textBaseline = 'middle'
    gCtx.fillStyle = line.color
    gCtx.fillText(line.txt, line.pos.x, line.pos.y)
    // console.log('Rendering text:', line.txt, 'at position:', line.pos)
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


//Images
//Choose Img from gallery
function onImgSelect(imgId) {
    setImg(imgId)
    showEditor()
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

//Font changes
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

function onFontChange(font) {
    const line = getSelectedLine()
    line.font = font
    renderMeme()
}

function onFontAlignLeft() {
    const line = getSelectedLine()
    line.align = 'left'
    line.pos.x = 20
    renderMeme()
}

function onFontAlignCenter() {
    const line = getSelectedLine()
    line.align = 'center'
    line.pos.x = gElCanvas.width / 2
    renderMeme()
}

function onFontAlignRight() {
    const line = getSelectedLine()
    line.align = 'right'
    line.pos.x = gElCanvas.width - 20
    renderMeme()
}

//Text Color
function onSetColor(color) {
    const line = getSelectedLine()
    line.color = color
    renderMeme()
}

//Text lines Actions
function onAddLine() {
    createLine() //model
}

function onRemoveLine() {
    if (gMeme.lines.length === 1) {
        console.log('last line cannot be deleted');
        return
    }
    removeLastLine()
    console.log('deleting text input');

    //remove from dom
    const elInputs = document.querySelectorAll('.text-line') //node list
    const elLastInput = elInputs[elInputs.length - 1]

    const inputContainer = document.querySelector('.text-lines-container') //parent
    inputContainer.removeChild(elLastInput)

    renderMeme()
}

function onMoveLineUp() {
    const line = getSelectedLine();
    line.pos.y -= 1
    console.log(line.pos.y);
    renderMeme()
}

function onMoveLineDown() {
    const line = getSelectedLine();
    line.pos.y += 1
    // console.log(line.pos.y);
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
    elNewLine.setAttribute('data-index', idx)

    elNewLine.addEventListener('click', () => onSelectLine(elNewLine, idx))

    const inputDiv = document.querySelector('.text-lines-container')
    inputDiv.appendChild(elNewLine)
}

//maybe redundant??
function onFocusLine(idx) {
    gMeme.selectedLineIdx = idx
}

function onSelectLine(elLine, idx) {
    console.log('onSelectLine called with idx:', idx)
    //model
    gMeme.lines.forEach(line => line.isSelected = false)
    gMeme.selectedLineIdx = idx
    const selectedLine = gMeme.lines[idx]

    selectedLine.isSelected = true
    //dom
    const elInputs = document.querySelectorAll('.text-line')
    elInputs.forEach(input => input.classList.remove('selected'))
    elLine.classList.add('selected')
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

    console.log(gMeme);

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
}

function toggleMenu() {
    document.body.classList.toggle("menu-open");
}

