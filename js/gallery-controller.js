'use strict';

function renderGallery() {
    const filteredImgs = getImgs(gfilterByKeyword)
    const elImgs = document.querySelector('.img-grid')
    elImgs.innerHTML = filteredImgs.map(img => {
        return `
            <article>
                <img src="${img.url}" class="gallery-img" onclick="onImgSelect('${img.id}')">
            </article>
            `
    }).join('')

}

//Choose Img from gallery
function onImgSelect(imgId) {
    gMeme.selectedImgId = imgId
    setImg(imgId)
    showEditor()
    console.log('imgId', imgId);
    console.log('curr gMeme after setting imgId', gMeme);
}

//Filter
function onFilter() {
    // gFilterBy = value; //.value gets the value entered
    const elKeyWord = document.querySelector('.filter-input')
    gfilterByKeyword = elKeyWord.value
    renderGallery()
}


function onResetFilter() {
    //reset global var
    gfilterByKeyword = ''
    renderGallery()
    //clear the input
    const elKeyword = document.querySelector('.filter-input')
    elKeyword.value = ''
}