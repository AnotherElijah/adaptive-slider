"use strict";

var _focusModule = require("./focus-module.js");

var _carouselButtons = require("./carousel-buttons.js");

function slider() {
  for (var _len = arguments.length, resizeSets = new Array(_len), _key = 0; _key < _len; _key++) {
    resizeSets[_key] = arguments[_key];
  }

  var arrayFromArgs = resizeSets[0];
  var resizeLargeImg = resizeSets[1];
  var carouselContainer = document.querySelector('#carouselContainer');
  var carouselWrapper;

  var carouselCoords = function carouselCoords(elem) {
    return elem.getBoundingClientRect();
  };

  var centerOfCarousel = function centerOfCarousel(coordinates, elem) {
    var focus = {
      x: coordinates(elem).x + coordinates(elem).width / 2,
      y: coordinates(elem).y + coordinates(elem).height / 2
    };
    return focus;
  };
  /*
  * !FOR FOCUS MODULE!
  * Takes IMG src from point
  * offset = central picture of track
  * offset +/- when track moves forward/back
   */


  var elementByCoords = function elementByCoords() {
    var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var elemPoint = centerOfCarousel(carouselCoords, carouselContainer);
    return document.elementFromPoint(elemPoint.x + offset, elemPoint.y);
  };
  /*if there is no maxWidth setting in settings, makes it 3000px*/


  var setObj = arrayFromArgs.map(function (item) {
    if (!item.maxWidth) {
      item.maxWidth = 3000;
    }

    return item;
  });
  console.log(setObj);
  /*sort array of objects by maxWidth. [0]-largest maxWidth*/

  setObj.sort(function (a, b) {
    return b.maxWidth - a.maxWidth;
  });
  console.log(setObj);
  var sliderParams = {
    largeImgW: setObj[0].largeImgW,
    maxWidth: setObj[0].maxWidth,
    elemW: setObj[0].elemW,
    elemH: setObj[0].elemH,
    mainTrackW: setObj[0].elemW * setObj[0].photos.length * 3,
    visibleNum: setObj[0].visible,
    photos: setObj[0].photos,
    step: setObj[0].step,
    animationDuration: setObj[0].animation.duration,
    animationTransitionTiming: setObj[0].animation.transitionTiming
  };

  var resizeFunctions = function resizeFunctions(setObj, actualInnerWidth) {
    var arrOfFuncs = setObj.map(function (newSetObj) {
      return function () {
        /*total 3 same sections
        *every time when FORWARD section slides out from visible area, BACKWARD section takes FORWARD position
        */
        if (actualInnerWidth < newSetObj.maxWidth) {
          document.querySelector("#carouselContainer").removeChild(document.querySelector("#carouselContainer").lastElementChild);
          sliderParams = {
            elemW: newSetObj.elemW,
            elemH: newSetObj.elemH,
            largeImgW: newSetObj.largeImgW,
            mainTrackW: newSetObj.elemW * newSetObj.photos.length * 3,
            visibleNum: newSetObj.visible,
            photos: newSetObj.photos,
            step: newSetObj.step,
            animationDuration: newSetObj.animation.duration,
            animationTransitionTiming: newSetObj.animation.animationTransitionTiming
          };

          if (document.querySelector("#largeImg")) {
            document.querySelector("#largeImg").setAttribute("style", "width:".concat(newSetObj.largeImgW, "px"));
          }

          render();
        }
      };
    });
    return arrOfFuncs;
  };

  function debounce(f, ms) {
    var timer = null;
    return function () {
      var _this = this;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var onComplete = function onComplete() {
        f.apply(_this, args);
        timer = null;
      };

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(onComplete, ms);
    };
  }
  /*place tracks on first position*/


  var centralize = function centralize(parentContainer) {
    for (var i = 0; i < parentContainer.childNodes.length; i++) {
      /*total 3 same sections
      *every time when FORWARD section slides out from visible area, BACKWARD section takes FORWARD position
      */
      var wrapper = document.querySelector("#wrapper-".concat(i));
      if (parentContainer.childNodes[i].nodeType === 3) continue;
      if (i !== parentContainer.childNodes.length - 1) wrapper.style.cssText = "transform: translate3d(-".concat(sliderParams.elemW * sliderParams.photos.length + sliderParams.elemW * sliderParams.step, "px, 0px, 0px)");
    }
  };

  var sliderConstantStyles = function sliderConstantStyles() {
    /*permanent styles for container*/
    if (!document.querySelector('style')) document.body.insertAdjacentHTML("beforeEnd", "<style></style>");
    var styleTag = document.getElementsByTagName('style')[0];
    styleTag.insertAdjacentHTML('beforeEnd', '#carouselContainer section div{display: inline-block; ' + 'position: relative; ' + 'z-index: 3;}');
    styleTag.insertAdjacentHTML('beforeEnd', '.hidden{visibility: hidden; transition: all 0.0s ease!important;}');
    styleTag.insertAdjacentHTML('beforeEnd', '.transit{transition: transform 0s!important;}');
  };

  var sliderSets = function sliderSets() {
    var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.7;
    var transitionTiming = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ease';

    /*TRANSITION style for every track
    * takes from {sliderParams.animationDuration, sliderParams.animationTransitionTiming}
    */
    var imgElems = document.querySelectorAll("#main-track div");
    imgElems = Array.from(imgElems);
    imgElems.map(function () {
      document.getElementsByTagName('style')[0].insertAdjacentHTML('beforeEnd', "#main-track div{ transition: transform ".concat(duration, "s ").concat(transitionTiming, ";}"));
    });
  };
  /*incoming url => DOM elems*/


  var prepareImgs = function prepareImgs() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var currentElemW = args[0],
        currentElemH = args[1];
    var elemArr = sliderParams.photos.map(function (link, i) {
      return "<img width='".concat(currentElemW, "px' height=\"").concat(Math.floor(currentElemH), "px\" id=\"pic").concat(i, "\" src=").concat(link, ">");
    });
    elemArr = elemArr.join('');
    return elemArr;
  };

  var elementToHide;

  var spinSlider = function spinSlider(incoming, elemW) {
    var section = document.querySelector("#main-track");
    var permission = false;
  };
  /*sliderParams.photos, sliderParams.elemW, sliderParams.number*/


  var wrappsArr = [];

  var createPositionArr = function createPositionArr() {
    wrappsArr = [{
      startPosition: -(sliderParams.elemW * sliderParams.photos.length),
      currentPosition: -(sliderParams.elemW * sliderParams.photos.length + sliderParams.elemW * sliderParams.step),
      visibility: true,
      makeInvisible: function makeInvisible() {
        if (this.visibility === false) {
          this.visibility = true;
          return 'visibility: hidden!important';
        } else {
          return 'visibility: visible!important';
        }
      }
    }, {
      startPosition: -(sliderParams.elemW * sliderParams.photos.length),
      currentPosition: -(sliderParams.elemW * sliderParams.photos.length + sliderParams.elemW * sliderParams.step),
      visibility: true,
      makeInvisible: function makeInvisible() {
        if (this.visibility === false) {
          this.visibility = true;
          return 'visibility: hidden!important';
        } else {
          return 'visibility: visible!important';
        }
      }
    }, {
      startPosition: -(sliderParams.elemW * sliderParams.photos.length),
      currentPosition: -(sliderParams.elemW * sliderParams.photos.length + sliderParams.elemW * sliderParams.step),
      visibility: true,
      makeInvisible: function makeInvisible() {
        if (this.visibility === false) {
          this.visibility = true;
          return 'visibility: hidden!important';
        } else {
          return 'visibility: visible!important';
        }
      }
    }];
  };

  var permission = false;

  var makeStep = function makeStep(step, event, elemW, direction) {
    var section = document.querySelector("#main-track");
    if (direction === "back") elemW = -elemW;
    var newPosition = wrappsArr.map(function (item) {
      return item.currentPosition - elemW * sliderParams.step;
    });

    var hideElem = function hideElem(elem) {
      elem.classList.add('transit');
      setTimeout(function () {
        elem.classList.remove('transit');
      }, sliderParams.animationDuration);
      permission = false;
    };

    if (permission) hideElem(elementToHide);
    section.childNodes[0].style.cssText = "transform: translate3d(".concat(newPosition[0], "px, 0px, 0px);");
    section.childNodes[1].style.cssText = "transform: translate3d(".concat(newPosition[1], "px, 0px, 0px);");
    section.childNodes[2].style.cssText = "transform: translate3d(".concat(newPosition[2], "px, 0px, 0px);");
    wrappsArr.forEach(function (elem, i) {
      elem.currentPosition = newPosition[i];
    });

    var getPosition = function getPosition(elem) {
      var positionStr = elem.style.transform;
      positionStr = positionStr.replace('translate3d(', '').replace('px, 0px, 0px)', '');
      return positionStr;
    };

    var forwardHandler = function forwardHandler() {
      var elemFarthestPosition = function elemFarthestPosition(arr, elem) {
        return elem.startPosition + elem.startPosition * (arr.indexOf(elem) + 1);
      };

      var arr = Array.from(section.childNodes);
      arr.forEach(function (elem, i) {
        if (getPosition(section.childNodes[i]) - elemW * sliderParams.step < elemFarthestPosition(wrappsArr, wrappsArr[i])) {
          wrappsArr[i].currentPosition = wrappsArr[i].currentPosition + sliderParams.elemW * sliderParams.photos.length * 3;
          elementToHide = section.childNodes[i];
          permission = true;
        }
      });
    };

    var backwardHandler = function backwardHandler() {
      var elemFarthestPosition = function elemFarthestPosition(arr, elem) {
        arr = Array.from(arr);
        arr = arr.reverse();
        return elem.startPosition - elem.startPosition * arr.indexOf(elem);
      };

      for (var i = 2; i >= 0; i--) {
        if (getPosition(section.childNodes[i]) - elemW * sliderParams.step > elemFarthestPosition(wrappsArr, wrappsArr[i])) {
          wrappsArr[i].currentPosition = wrappsArr[i].currentPosition - sliderParams.elemW * sliderParams.photos.length * 3;
          elementToHide = section.childNodes[i];
          permission = true;
        }
      }
    };

    direction !== "back" ? forwardHandler() : direction === "back" ? backwardHandler() : null;
  };
  /***CONTROLLS***/

  /*add btns*/


  var controlls = function controlls() {
    console.log('controlls');
    var flag = true;

    var makeFlagTrue = function makeFlagTrue() {
      setTimeout(function () {
        flag = true;
        console.log(flag);
      }, 700);
    };
    /*for touchscreen*/


    var touchHandler = function touchHandler() {
      var start, move, end;
      carouselWrapper.addEventListener("touchstart", function (event) {
        start = event.touches[0].clientX;
      });
      carouselWrapper.addEventListener("touchmove", function (event) {
        move = null;
        move = event.touches[0].clientX;
      });
      carouselWrapper.addEventListener("touchend", function (event) {
        end = null;
        end = start - move;

        if (flag) {
          flag = false;
          makeFlagTrue();
          end > 0 && move > 0 ? (makeStep(sliderParams.step, event, sliderParams.elemW), runImgInsert(sliderParams.elemW, resizeSets), bgModule(elementByCoords(sliderParams.elemW))) : end < 0 && move > 0 ? (makeStep(sliderParams.step, event, sliderParams.elemW, "back"), runImgInsert(-sliderParams.elemW, resizeSets), bgModule(elementByCoords(-sliderParams.elemW))) : event.target.classList.contains("carousel-next") ? (makeStep(sliderParams.step, event, sliderParams.elemW), runImgInsert(sliderParams.elemW, resizeSets), bgModule(elementByCoords(sliderParams.elemW))) : event.target.classList.contains("carousel-prev") ? (makeStep(sliderParams.step, event, sliderParams.elemW, "back"), runImgInsert(-sliderParams.elemW, resizeSets), bgModule(elementByCoords(-sliderParams.elemW))) : null;
        }

        start = null;
        move = null;
        end = null;
      });
    };
    /*for mouse*/


    var clickHandler = function clickHandler() {
      document.querySelector(".carousel-next").addEventListener("click", function (event) {
        if (flag) {
          flag = false;
          makeStep(sliderParams.step, event, sliderParams.elemW);
          runImgInsert(sliderParams.elemW, resizeSets);
          bgModule(elementByCoords(sliderParams.elemW));
          makeFlagTrue();
        }
      });
      document.querySelector(".carousel-prev").addEventListener("click", function (event) {
        if (flag) {
          flag = false;
          makeStep(sliderParams.step, event, sliderParams.elemW, "back");
          runImgInsert(-sliderParams.elemW, resizeSets);
          bgModule(elementByCoords(-sliderParams.elemW));
          makeFlagTrue();
        }
      });
    };

    touchHandler();
    clickHandler();
  };

  var checkWidth = function checkWidth() {
    var actualInnerWidth = document.body.clientWidth;
    resizeFunctions(setObj, actualInnerWidth).forEach(function (f) {
      f();
    });
  };
  /*resizeCounter: calls of resize function. If < 5 - checkWidth() for every call. If>=5 calls with setTimeout (debounde())*/


  var resizeCounter = 0;

  function resizeCheck(resizeSets) {
    window.addEventListener("resize", function () {
      if (resizeCounter < 5) {
        resizeCounter++;
        checkWidth();
        setTimeout(function () {
          resizeCounter = 0;
        }, 100);
      } else if (resizeCounter >= 5) {
        debounce(function () {
          checkWidth();
        }, 300);
      }
    });
  }
  /*if there is #largeImg*/

  /*TEMPORARY GLOBAL*/


  var setLargeImg = function setLargeImg() {
    if (document.querySelector("#largeImg")) {
      document.querySelector("#largeImg").setAttribute("style", "width:".concat(sliderParams.largeImgW, "px"));
    }
  };
  /*********************/


  var renderWrapper = function renderWrapper() {
    var wrapper = document.createElement('section');
    wrapper.id = "carousel-wrapper";
    carouselContainer.parentNode.insertBefore(wrapper, carouselContainer);
    wrapper.appendChild(carouselContainer);
    carouselWrapper = document.querySelector("#carousel-wrapper");
  };

  var makeWrapper = function makeWrapper(elem) {
    var wrapper = document.createElement('div');
    wrapper.id = 'carouselContainer-btnWrapper';
    elem.parentNode.insertBefore(wrapper, elem);
    wrapper.appendChild(elem);
  };

  function render() {
    var mainTrack = document.createElement('section');
    mainTrack.id = 'main-track';
    mainTrack.style.cssText = "width: ".concat(sliderParams.mainTrackW, "px;");
    document.querySelector('#carouselContainer').style.cssText = "width: ".concat(sliderParams.elemW * sliderParams.visibleNum, "px; overflow: hidden;");
    /***********CSS**********/

    document.querySelector('#carouselContainer').appendChild(mainTrack);
    /***********CSS**********/

    var parentContainer = document.querySelector("#main-track");

    for (var i = 0; i <= 2; i++) {
      var wrapper = document.createElement('div');
      wrapper.id = "wrapper-".concat(i);
      parentContainer.appendChild(wrapper);
      document.querySelector("#wrapper-".concat(i)).insertAdjacentHTML("afterBegin", prepareImgs(sliderParams.elemW, sliderParams.elemH));
    }

    sliderSets(sliderParams.animationDuration, sliderParams.animationTransitionTiming);
    spinSlider(sliderParams.photos, sliderParams.elemW, sliderParams.number);
    centralize(parentContainer);
    createPositionArr();
  }

  ;
  resizeCheck(resizeSets, render);
  resizeCheck(resizeSets, render);
  renderWrapper();
  /*create style tag*/

  sliderConstantStyles();
  render();
  checkWidth();

  try {
    (0, _focusModule.focusModule)(setLargeImg, resizeLargeImg, elementByCoords);
  } catch (err) {}

  (0, _carouselButtons.btn)();
  controlls();
}

var incoming = ["images/0.jpg", "images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg", "images/6.jpg", "images/7.jpg", "images/8.jpg"];
var obj = [{
  photos: incoming,
  largeImgW: 1000,
  elemW: 142,
  elemH: 142 * 0.55,
  visible: 7,
  step: 1,
  animation: {
    duration: 0.7,
    transitionTiming: 'ease-out'
  }
}, {
  maxWidth: 1600,
  largeImgW: 800,
  photos: incoming,
  elemW: 160,
  elemH: 160 * 0.55,
  visible: 5,
  step: 1,
  animation: {
    duration: 0.5,
    transitionTiming: 'ease-out'
  }
}, {
  maxWidth: 1200,
  largeImgW: 750,
  photos: incoming,
  elemW: 150,
  elemH: 150 * 0.55,
  visible: 5,
  step: 1,
  animation: {
    duration: 0.5,
    transitionTiming: 'ease-out'
  }
}, {
  maxWidth: 900,
  largeImgW: 0,
  photos: incoming,
  elemW: 667,
  elemH: 667 * 0.55,
  visible: 1,
  step: 1,
  animation: {
    duration: 0.5,
    transitionTiming: 'ease-out'
  }
}, {
  maxWidth: 500,
  largeImgW: 0,
  photos: incoming,
  elemW: 360,
  elemH: 360 * 0.55,
  visible: 1,
  step: 1,
  animation: {
    duration: 0.5,
    transitionTiming: 'ease-out'
  }
}];
var resizeLargeImg = [{
  transition: true
  /*,
  maxWidth: 3000,
  elemW: 1400*/

  /*,
  {
     maxWidth: 1500,
     elemW: 1200
  },
  {
     maxWidth: 1200,
     elemW: 600
  },
  {
     maxWidth: 738,
     elemW: 600
  }*/

}];
slider(obj, resizeLargeImg);