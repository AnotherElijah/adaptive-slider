"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.btn = btn;

/*wrapper for buttons needed for #carouselContainer*/
function btn() {
  var largeImgWrapper = document.querySelector("#carousel-wrapper");
  console.log("qwerty");

  var createBtn = function createBtn() {
    var insertBtn = function insertBtn(elem, btn) {
      largeImgWrapper.appendChild(btnPrev);
      largeImgWrapper.appendChild(btnNext);
    };

    var btnPrev = document.createElement('button'),
        btnNext = document.createElement('button');
    btnPrev.classList.add('carousel-prev');
    btnNext.classList.add('carousel-next');
    insertBtn(largeImgWrapper);
  };

  var addInnerTxt = function addInnerTxt(arrowElem, txt) {
    arrowElem.innerHTML = txt;
    arrowElem.innerHTML = txt;
  };

  createBtn();
  addInnerTxt(document.querySelector('.carousel-next'), '');
  addInnerTxt(document.querySelector('.carousel-prev'), '');
}