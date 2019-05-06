import {focusModule} from "./focus-module.js";
import {btn} from "./carousel-buttons.js";

function slider(...resizeSets) {
    let arrayFromArgs = resizeSets[0];
    let resizeLargeImg = resizeSets[1];
    const carouselContainer = document.querySelector('#carouselContainer');
    let carouselWrapper;
    let carouselCoords = elem => {
        return elem.getBoundingClientRect();
    };
    let centerOfCarousel = (coordinates, elem) => {
        let focus = {
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
    let elementByCoords = (offset = 0) => {
        let elemPoint = centerOfCarousel(carouselCoords, carouselContainer);
        return document.elementFromPoint(elemPoint.x + offset, elemPoint.y);
    };
    /*if there is no maxWidth setting in settings, makes it 3000px*/
    let setObj = arrayFromArgs.map(item => {
            if (!item.maxWidth) {
                item.maxWidth = 3000;
            }
            return item
        }
    );
    console.log(setObj);
    /*sort array of objects by maxWidth. [0]-largest maxWidth*/
    setObj.sort(function (a, b) {
        return b.maxWidth - a.maxWidth;
    });

    console.log(setObj);

    let sliderParams = {
        largeImgW: setObj[0].largeImgW,
        maxWidth: setObj[0].maxWidth,
        elemW: setObj[0].elemW,
        elemH: setObj[0].elemH,
        mainTrackW: setObj[0].elemW * setObj[0].photos.length * 3,
        visibleNum: setObj[0].visible,
        photos: setObj[0].photos,
        step: setObj[0].step,
        animationDuration: setObj[0].animation.duration,
        animationTransitionTiming: setObj[0].animation.transitionTiming,
    };

    let resizeFunctions = (setObj, actualInnerWidth) => {
        let arrOfFuncs = setObj.map((newSetObj) => {
            return () => {
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
                        document.querySelector("#largeImg").setAttribute("style", `width:${newSetObj.largeImgW}px`)
                    }
                    render();
                }
            };
        });

        return arrOfFuncs;
    };

    function debounce(f, ms) {
        let timer = null;
        return function (...args) {
            const onComplete = () => {
                f.apply(this, args);
                timer = null;
            };
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(onComplete, ms);
        };
    }

    /*place tracks on first position*/
    let centralize = function (parentContainer) {
        for (let i = 0; i < parentContainer.childNodes.length; i++) {
            /*total 3 same sections
            *every time when FORWARD section slides out from visible area, BACKWARD section takes FORWARD position
            */
            const wrapper = document.querySelector(`#wrapper-${i}`);
            if (parentContainer.childNodes[i].nodeType === 3) continue;
            if (i !== parentContainer.childNodes.length - 1) wrapper.style.cssText = `transform: translate3d(-${(sliderParams.elemW * sliderParams.photos.length) + sliderParams.elemW * sliderParams.step}px, 0px, 0px)`;
        }
    };

    const sliderConstantStyles = () => {
        /*permanent styles for container*/
        if (!document.querySelector('style')) document.body.insertAdjacentHTML("beforeEnd", "<style></style>");
        const styleTag = document.getElementsByTagName('style')[0];
        styleTag.insertAdjacentHTML('beforeEnd', '#carouselContainer section div{display: inline-block; ' +
            'position: relative; ' +
            'z-index: 3;}');
        styleTag.insertAdjacentHTML('beforeEnd', '.hidden{visibility: hidden; transition: all 0.0s ease!important;}');
        styleTag.insertAdjacentHTML('beforeEnd', '.transit{transition: transform 0s!important;}');
    };

    const sliderSets = (duration = 0.7, transitionTiming = 'ease') => {
        /*TRANSITION style for every track
        * takes from {sliderParams.animationDuration, sliderParams.animationTransitionTiming}
        */
        let imgElems = document.querySelectorAll(`#main-track div`);
        imgElems = Array.from(imgElems);
        imgElems.map(
            () => {
                document.getElementsByTagName('style')[0].insertAdjacentHTML('beforeEnd', `#main-track div{ transition: transform ${duration}s ${transitionTiming};}`)
            })
    };

    /*incoming url => DOM elems*/
    let prepareImgs = (...args) => {
        let [currentElemW, currentElemH] = args;

        let elemArr = sliderParams.photos.map((link, i) => {
            return `<img width='${currentElemW}px' height="${Math.floor(currentElemH)}px" id="pic${i}" src=${link}>`;
        });
        elemArr = elemArr.join('');
        return elemArr;
    };

    let elementToHide;
    let spinSlider = (incoming, elemW) => {
        const section = document.querySelector("#main-track");
        let permission = false;
    };

    /*sliderParams.photos, sliderParams.elemW, sliderParams.number*/
    let wrappsArr = [];
    let createPositionArr = () => {
        wrappsArr = [
            {
                startPosition: -(sliderParams.elemW * sliderParams.photos.length),
                currentPosition: -((sliderParams.elemW * sliderParams.photos.length) + sliderParams.elemW * sliderParams.step),
                visibility: true,
                makeInvisible() {
                    if (this.visibility === false) {
                        this.visibility = true;
                        return 'visibility: hidden!important';
                    } else {
                        return 'visibility: visible!important';
                    }
                }
            },
            {
                startPosition: -(sliderParams.elemW * sliderParams.photos.length),
                currentPosition: -((sliderParams.elemW * sliderParams.photos.length) + sliderParams.elemW * sliderParams.step),
                visibility: true,
                makeInvisible() {
                    if (this.visibility === false) {
                        this.visibility = true;
                        return 'visibility: hidden!important';
                    } else {
                        return 'visibility: visible!important';
                    }
                }
            },
            {
                startPosition: -(sliderParams.elemW * sliderParams.photos.length),
                currentPosition: -((sliderParams.elemW * sliderParams.photos.length) + sliderParams.elemW * sliderParams.step),
                visibility: true,
                makeInvisible() {
                    if (this.visibility === false) {
                        this.visibility = true;
                        return 'visibility: hidden!important';
                    } else {
                        return 'visibility: visible!important';
                    }
                }
            }
        ];
    };

    let permission = false;
    let makeStep = (step, event, elemW, direction) => {


        const section = document.querySelector("#main-track");
        if (direction === "back") elemW = -elemW;
        let newPosition = wrappsArr.map(item => {

            return item.currentPosition - elemW * sliderParams.step;
        });

        let hideElem = elem => {
            elem.classList.add('transit');
            setTimeout(() => {
                elem.classList.remove('transit');
            }, sliderParams.animationDuration);
            permission = false;
        };

        if (permission) hideElem(elementToHide);

        section.childNodes[0].style.cssText = `transform: translate3d(${newPosition[0]}px, 0px, 0px);`;
        section.childNodes[1].style.cssText = `transform: translate3d(${newPosition[1]}px, 0px, 0px);`;
        section.childNodes[2].style.cssText = `transform: translate3d(${newPosition[2]}px, 0px, 0px);`;

        wrappsArr.forEach((elem, i) => {
            elem.currentPosition = newPosition[i];
        });

        let getPosition = (elem) => {
            let positionStr = elem.style.transform;
            positionStr = positionStr.replace('translate3d(', '')
                .replace('px, 0px, 0px)', '');
            return positionStr;
        };

        let forwardHandler = () => {
            let elemFarthestPosition = (arr, elem) => {
                return (elem.startPosition) + elem.startPosition * (arr.indexOf(elem) + 1);
            };

            let arr = Array.from(section.childNodes);
            arr.forEach(
                (elem, i) => {
                    if (getPosition(section.childNodes[i]) - (elemW * sliderParams.step) < elemFarthestPosition(wrappsArr, wrappsArr[i])) {
                        wrappsArr[i].currentPosition = (wrappsArr[i].currentPosition + (sliderParams.elemW * sliderParams.photos.length * 3));
                        elementToHide = section.childNodes[i];
                        permission = true;
                    }
                }
            );
        };


        let backwardHandler = () => {

            let elemFarthestPosition = (arr, elem) => {
                arr = Array.from(arr);
                arr = arr.reverse();
                return (elem.startPosition) - elem.startPosition * (arr.indexOf(elem));
            };

            for (let i = 2; i >= 0; i--) {
                if (getPosition(section.childNodes[i]) - (elemW * sliderParams.step) > elemFarthestPosition(wrappsArr, wrappsArr[i])) {
                    wrappsArr[i].currentPosition = (wrappsArr[i].currentPosition - (sliderParams.elemW * sliderParams.photos.length * 3));
                    elementToHide = section.childNodes[i];
                    permission = true;
                }
            }
        };
        direction !== "back" ? forwardHandler() : direction === "back" ? backwardHandler() : null;
    };
    /***CONTROLLS***/
    /*add btns*/
    let controlls = () => {
        console.log('controlls')
        let flag = true;
        let makeFlagTrue = () => {
            setTimeout(() => {
                flag = true;
                console.log(flag);
            }, 700);
        };
        /*for touchscreen*/
        let touchHandler = () => {
            let start, move, end;
            carouselWrapper.addEventListener("touchstart", (event) => {
                start = event.touches[0].clientX;
            });
            carouselWrapper.addEventListener("touchmove", (event) => {
                move = null;
                move = event.touches[0].clientX;
            });
            carouselWrapper.addEventListener("touchend", (event) => {
                end = null;
                end = start - move;
                if (flag) {
                    flag = false;
                    makeFlagTrue();
                    end > 0 && move > 0 ?
                        (makeStep(sliderParams.step, event, sliderParams.elemW),
                            runImgInsert(sliderParams.elemW, resizeSets),
                            bgModule(elementByCoords(sliderParams.elemW)))
                        :
                        end < 0 && move > 0 ?
                            (makeStep(sliderParams.step, event, sliderParams.elemW, "back"), runImgInsert(-sliderParams.elemW, resizeSets),
                                bgModule(elementByCoords(-sliderParams.elemW)))
                            :
                            event.target.classList.contains("carousel-next")? (makeStep(sliderParams.step, event, sliderParams.elemW), runImgInsert(sliderParams.elemW, resizeSets),
                                    bgModule(elementByCoords(sliderParams.elemW)))
                                :
                                event.target.classList.contains("carousel-prev")?
                                    (makeStep(sliderParams.step, event, sliderParams.elemW, "back"), runImgInsert(-sliderParams.elemW, resizeSets),
                                        bgModule(elementByCoords(-sliderParams.elemW)))
                                    :
                                    null;}
                start = null;
                move = null;
                end = null;
            })
        };

        /*for mouse*/
        let clickHandler = () => {
            document.querySelector(".carousel-next").addEventListener("click", (event) => {
                if (flag) {
                    flag = false;
                    makeStep(sliderParams.step, event, sliderParams.elemW);
                    runImgInsert(sliderParams.elemW, resizeSets);
                    bgModule(elementByCoords(sliderParams.elemW));
                    makeFlagTrue();
                }
            });
            document.querySelector(".carousel-prev").addEventListener("click", (event) => {
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

    let checkWidth = () => {
        let actualInnerWidth = document.body.clientWidth;
        resizeFunctions(setObj, actualInnerWidth).forEach(
            function (f) {
                f();
            }
        );
    };
    /*resizeCounter: calls of resize function. If < 5 - checkWidth() for every call. If>=5 calls with setTimeout (debounde())*/
    let resizeCounter = 0;

    function resizeCheck(resizeSets) {
        window.addEventListener("resize", () => {
            if (resizeCounter < 5) {
                resizeCounter++;
                checkWidth();
                setTimeout(() => {
                    resizeCounter = 0
                }, 100)
            } else if (resizeCounter >= 5) {
                debounce(function () {
                    checkWidth();
                }, 300)
            }

        });
    }

    /*if there is #largeImg*/
    /*TEMPORARY GLOBAL*/
    let setLargeImg = () => {
        if (document.querySelector("#largeImg")) {
            document.querySelector("#largeImg").setAttribute("style", `width:${sliderParams.largeImgW}px`)
        }
    };
    /*********************/

    let renderWrapper = () => {
        let wrapper = document.createElement('section');
        wrapper.id = "carousel-wrapper";
        carouselContainer.parentNode.insertBefore(wrapper, carouselContainer);
        wrapper.appendChild(carouselContainer);
        carouselWrapper = document.querySelector("#carousel-wrapper");
    };

    const makeWrapper = (elem) => {
        const wrapper = document.createElement('div');
        wrapper.id = 'carouselContainer-btnWrapper';
        elem.parentNode.insertBefore(wrapper, elem);
        wrapper.appendChild(elem);
    };

    function render() {
        const mainTrack = document.createElement('section');
        mainTrack.id = 'main-track';
        mainTrack.style.cssText = `width: ${sliderParams.mainTrackW}px;`;

        document.querySelector('#carouselContainer').style.cssText = `width: ${(sliderParams.elemW * sliderParams.visibleNum)}px; overflow: hidden;`;
        /***********CSS**********/

        document.querySelector('#carouselContainer').appendChild(mainTrack);
        /***********CSS**********/

        const parentContainer = document.querySelector("#main-track");

        for (let i = 0; i <= 2; i++) {
            const wrapper = document.createElement('div');
            wrapper.id = `wrapper-${i}`;
            parentContainer.appendChild(wrapper);
            document.querySelector(`#wrapper-${i}`).insertAdjacentHTML("afterBegin", prepareImgs(sliderParams.elemW, sliderParams.elemH));
        }
        sliderSets(sliderParams.animationDuration, sliderParams.animationTransitionTiming);
        spinSlider(sliderParams.photos, sliderParams.elemW, sliderParams.number);
        centralize(parentContainer);
        createPositionArr();
    };

    resizeCheck(resizeSets, render);
    resizeCheck(resizeSets, render);
    renderWrapper();

    /*create style tag*/
    sliderConstantStyles();
    render();
    checkWidth();
    try {
        focusModule(setLargeImg, resizeLargeImg, elementByCoords);
    } catch (err) {

    }
    btn();
    controlls();

}

let incoming = [
    "images/0.jpg",
    "images/1.jpg",
    "images/2.jpg",
    "images/3.jpg",
    "images/4.jpg",
    "images/5.jpg",
    "images/6.jpg",
    "images/7.jpg",
    "images/8.jpg",
];
let obj = [{
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
},
    {
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
    },
    {
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
    },
    {
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
    },
    {
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

let resizeLargeImg = [
    {
        transition: true/*,
        maxWidth: 3000,
        elemW: 1400*/
    }/*,
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
];

slider(obj, resizeLargeImg);