/*wrapper for buttons needed for #carouselContainer*/
function btn(...args) {
    const largeImgWrapper = document.querySelector("#carousel-wrapper");
    console.log("qwerty");

    const createBtn = () => {
        const insertBtn = (elem, btn) => {
            largeImgWrapper.appendChild(btnPrev);
            largeImgWrapper.appendChild(btnNext);
        };
        let btnPrev = document.createElement('button'), btnNext = document.createElement('button');
        btnPrev.classList.add('carousel-prev');
        btnNext.classList.add('carousel-next');
        insertBtn(largeImgWrapper);
    };
    const addInnerTxt = (arrowElem, txt) => {
        arrowElem.innerHTML = txt;
        arrowElem.innerHTML = txt;
    };
    createBtn();
    addInnerTxt(document.querySelector('.carousel-next'), '');
    addInnerTxt(document.querySelector('.carousel-prev'), '');

}

export {btn};