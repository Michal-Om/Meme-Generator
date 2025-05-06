'use strict';

let gFilterByKeyword = null
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
var gSpanScaleValue = 1

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


function setImg(imgId) {
    const selectedImg = getImgById(imgId)
    const img = new Image()
    img.src = selectedImg.url
    img.onload = () => {
        gElCanvas.width = 400
        gElCanvas.height = 400
        gMeme.img = img
        renderMeme()
    }
}

function _filterImgs(keyword) {
    if (!keyword) return gImgs
    var imgs = gImgs
    const regex = new RegExp(keyword, 'i')
    imgs = imgs.filter(img => regex.test(img.keywords.join(' ')))
    return imgs
}

function getImgs(keyword) {
    if (!gFilterByKeyword) return gImgs
    var imgs = gImgs
    imgs = _filterImgs(keyword)
    return imgs
}

function getKeywordStats(elKeyword) {
    if (!elKeyword || elKeyword === '') return
    const countMap = gKeywordSearchCountMap
    var keyword = elKeyword.toLowerCase()
    if (!countMap[keyword]) {
        countMap[keyword] = 1
    } else {
        countMap[keyword]++
        renderKeywords(gFilterByKeyword)
    }
    console.log('countmap:', countMap);

    return countMap
}



