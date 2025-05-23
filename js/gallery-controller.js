'use strict'

function renderGallery() {
    const filteredImgs = getImgs(gFilterByKeyword)
    const elImgs = document.querySelector('.img-grid')
    elImgs.innerHTML = filteredImgs.map(img => {
        return `
            <article>
                <img src="${img.url}" class="gallery-img" onclick="onImgSelect('${img.id}')">
            </article>
            `
    }).join('')

}

function onImgSelect(imgId) {
    gMeme.selectedImgId = imgId
    setImg(imgId)
    showEditor()
    console.log('imgId', imgId);
    console.log('curr gMeme after setting imgId', gMeme)
}

function onFilter() {
    const elKeyWord = document.querySelector('.filter-input')
    gFilterByKeyword = elKeyWord.value
    console.log('chosen value:', gFilterByKeyword)
    renderGallery()
    getKeywordStats(gFilterByKeyword)
}

function onResetFilter() {
    gFilterByKeyword = ''
    renderGallery()
    const elKeyword = document.querySelector('.filter-input')
    elKeyword.value = ''
}

function renderKeywords(keyword) {
    var keywordLower = keyword.toLowerCase()
    var elSpans = document.querySelectorAll('.filter-container span')
    elSpans.forEach(span => {
        if (span.innerText === keywordLower) {
            let currScale = +span.style.scale || 1
            if (currScale < 1.8) {
                currScale += 0.1
                span.style.scale = currScale
            }
        }
    })
}

function handleSpanClick(elSpan) {
    const keyword = elSpan.innerText
    getKeywordStats(keyword)

}



