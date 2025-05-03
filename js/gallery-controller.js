'use strict';

function renderGallery() {
    const elImgs = document.querySelector('.img-grid')
    elImgs.innerHTML = gImgs.map(img => {
        return `
            <article>
                <img src="${img.url}" class="gallery-img" onclick="onImgSelect('${img.id}')">
            </article>
            `
    }).join('')

}
