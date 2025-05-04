'use strict';

let gfilterByKeyword = null

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['Trump', 'angry'] },
    { id: 2, url: 'img/2.jpg', keywords: ['dog', 'puppies', 'cute'] },
    { id: 3, url: 'img/3.jpg', keywords: ['baby', 'dog', 'puppies', 'cute'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cat', 'cute'] },
    { id: 5, url: 'img/5.jpg', keywords: ['baby', 'angry'] },
    { id: 6, url: 'img/6.jpg', keywords: ['hair', 'funny'] },
    { id: 7, url: 'img/7.jpg', keywords: ['baby', 'funny'] },
    { id: 8, url: 'img/8.jpg', keywords: ['wizard', 'fascinating'] },
    { id: 9, url: 'img/9.jpg', keywords: ['baby', 'funny'] },
    { id: 10, url: 'img/10.jpg', keywords: ['obama', 'funny'] },
    { id: 11, url: 'img/11.jpg', keywords: ['fight', 'angry'] },
    { id: 12, url: 'img/12.jpg', keywords: ['you', 'want'] },
    { id: 13, url: 'img/13.jpg', keywords: ['drink', 'smart', 'confident'] },
    { id: 14, url: 'img/14.jpg', keywords: ['tough', 'bad'] },
    { id: 15, url: 'img/15.jpg', keywords: ['confident', 'tough'] },
    { id: 16, url: 'img/16.jpg', keywords: ['funny', 'joke'] },
    { id: 17, url: 'img/17.jpg', keywords: ['Putin', 'serious'] },
    { id: 18, url: 'img/18.jpg', keywords: ['confident', 'know'] },
    { id: 19, url: 'img2/19.jpg', keywords: ['happy', 'free'] },
    { id: 20, url: 'img2/20.jpg', keywords: ['dog', 'yoga', 'relax'] },
]

function getImgById(imgId) {
    const img = gImgs.find(img => +imgId === img.id)
    return img
}

//Set Img from gallery to original canvas size
function setImg(imgId) {
    const selectedImg = getImgById(imgId)
    const img = new Image()
    img.src = selectedImg.url
    img.onload = () => {
        gElCanvas.width = 400
        gElCanvas.height = 400
        gMeme.img = img  // store selected img in object
        renderMeme() // render only after image is loaded
    }
}

//gallery filter
function _filterImgs(keyword) {
    if (!keyword) return gImgs
    var imgs = gImgs
    const regex = new RegExp(keyword, 'i')
    imgs = imgs.filter(img => regex.test(img.keywords.join(' ')))
    // get me the img that its keyword passes the test. join because keywords is array
    return imgs
}

function getImgs(keyword) {
    if (!gfilterByKeyword) return gImgs
    var imgs = gImgs
    imgs = _filterImgs(keyword)
    return imgs
}