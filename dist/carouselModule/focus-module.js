"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.focusModule = void 0;

var focusModule = function focusModule() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var img;
  var nextElem;
  addEventListener("load", function (event) {
    var setLargeImg = args[0],
        resizeLargeImg = args[1],
        elementByCoords = args[2];

    var renderContainer = function renderContainer() {
      /*wrapper*/
      var wrapper = document.createElement('div');
      wrapper.id = 'largeImg-wrapper';
      document.querySelector('#carousel-wrapper').insertBefore(wrapper, document.querySelector('#carouselContainer'));
      /*overflow to avoid slider/height changing*/

      wrapper.setAttribute('style', 'overflow-y: hidden;');
      /*img inside wrapper*/

      var container = document.createElement('img');
      container.id = 'largeImg';
      document.querySelector('#largeImg-wrapper').appendChild(container);
    };

    window.runImgInsert = function (srcoffset, resizeLargeImg) {
      var animatePhoto = function animatePhoto(elem, duration, changeSrc) {
        var root = document.documentElement;
        img.style.transition = "all ".concat(duration, "s");
        root.style.setProperty('--changingTransition', "all ".concat(duration, "s"));
        if (img.classList.contains("img-change--off")) img.classList.remove("img-change--off");
        img.classList.add("img-change");
        setTimeout(function () {
          changeSrc();
          img.classList.add("img-change--off");
          img.classList.remove("img-change");
        }, duration * 1000);
      };

      var setImgHref = function setImgHref(href) {
        img = document.querySelector('#largeImg');

        if (resizeLargeImg !== undefined) {
          var setSrcWrapper = function setSrcWrapper() {
            return img.setAttribute('src', href);
          };

          for (var n in resizeLargeImg) {
            resizeLargeImg[n].transition === true ? animatePhoto(img, '0.2', setSrcWrapper) : animatePhoto(img, '0.2', setSrcWrapper);
          }
        } else {
          img.setAttribute('src', href);
        }
      };

      nextElem = elementByCoords(srcoffset);

      try {
        /*Desktop*/
        var nextElemSrc = nextElem.src;
      } catch (err) {
        /*Mobile*/
        var nextElemSrc = '';
      }

      setImgHref(nextElemSrc, 500, 500);
      setLargeImg();
    };

    window.bgModule = function (
    /*direction, */
    nextElem) {
      /*since there is no filter prop for background-image, background is a IMG*/
      var setBackground = function setBackground(hookElem) {
        var background = document.createElement('img');
        background.id = 'bg-image';
        background.src = document.querySelector('#largeImg').src;
        document.body.insertBefore(background, hookElem);
      };

      var replaceImgHref = function replaceImgHref() {
        setTimeout(function () {
          try {
            document.querySelector('#bg-image').src = nextElem.src;
          } catch (err) {
            null;
          }
        }, 190);
      };

      var placeBg = function placeBg() {
        if (!document.querySelector("#bg-image")) setBackground(document.querySelector("#carousel-wrapper"));
        replaceImgHref();
      };

      placeBg();
    };

    renderContainer(300, 300);
    runImgInsert(0);
    bgModule(elementByCoords(0));
  });
};

exports.focusModule = focusModule;