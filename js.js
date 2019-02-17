function Slider(setObj, ...resizeSets) {

    sliderParams = {
        elemW: setObj.elemW,
        mainTrackW: setObj.elemW * setObj.photos.length * 3,
        visibleNum: setObj.visible,
        photos: setObj.photos,
        step: setObj.step,
        animationDuration: setObj.animation.duration,
        animationTransitionTiming: setObj.animation.transitionTiming,
    };


    let resizeFunctions = (resizeObj, actualInnerWidth)=> {

        let arrOfFuncs = resizeObj.map((newSetObj) => {

            return ()=> {
                if (actualInnerWidth < newSetObj.maxWidth) {
                    document.querySelector("#carouselContainer").removeChild(document.querySelector("#carouselContainer").lastElementChild);
                    sliderParams.elemW = newSetObj.elemW;
                    console.log(newSetObj.elemW);
                    console.log(newSetObj.elemW * newSetObj.photos.length * 3);
                    console.log(newSetObj.photos.length);
                    sliderParams.mainTrackW = newSetObj.elemW * newSetObj.photos.length * 3;
                    sliderParams.visibleNum = newSetObj.visible;
                    sliderParams.photos = newSetObj.photos;
                    sliderParams.step = newSetObj.step;
                    sliderParams.animationDuration = newSetObj.animation.duration;
                    sliderParams.animationTransitionTiming = newSetObj.animation.animationTransitionTiming;
                    this.render();
                }
            };

        });
/*
        maxWidth: 1200,
        photos: incoming,
        elemW: 150,
        visible: 7,
        step: 1,
        animation: {
            duration: 0.5,
            transitionTiming: 'ease-out'
        }
 */


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

    centralize = function (parentContainer) {

        for (let i = 0; i < parentContainer.childNodes.length; i++) {
            const wrapper = document.querySelector(`#wrapper-${i}`);
            if (parentContainer.childNodes[i].nodeType === 3) continue;
            if (i !== parentContainer.childNodes.length - 1) wrapper.style.cssText = `transform: translate3d(-${(sliderParams.elemW * sliderParams.photos.length) + sliderParams.elemW * sliderParams.step}px, 0px, 0px)`;
        }
    };
    sliderConstantStyles = () => {
        if(!document.querySelector('style')) document.body.insertAdjacentHTML("beforeEnd", "<style></style>");
        let styleTag = document.getElementsByTagName('style')[0];
        styleTag.insertAdjacentHTML('beforeEnd', '#carouselContainer section div{display: inline-block; ' +
            'position: relative; ' +
            'z-index: 3;}');
        styleTag.insertAdjacentHTML('beforeEnd', '.hidden{visibility: hidden; transition: all 0.0s ease!important;}');
        styleTag.insertAdjacentHTML('beforeEnd', '.transit{transition: transform 0s!important;}');
    };

    sliderSets = (duration = 0.7, transitionTiming = 'ease') => {
        let imgElems = document.querySelectorAll(`#main-track div`);
        imgElems = Array.from(imgElems);
        imgElems.map(() => document.getElementsByTagName('style')[0].insertAdjacentHTML('beforeEnd', `#main-track div{ transition: transform ${duration}s ${transitionTiming};}`));
    };

    /*incoming url => DOM elems*/
    let prepareImgs = currentElemWidth => {
        let elemArr = sliderParams.photos.map((link, i) => {
            console.log(currentElemWidth);
            return `<img width='${currentElemWidth}px' id="pic${i}" src=${link}>`;
        });
        elemArr = elemArr.join('');
        return elemArr;
    };




    spinSlider = (incoming, elemW) => {
        console.log('spinSlider');
        const section = document.querySelector("#main-track");

        let wrappsArr = [
            {
                startPosition: -(elemW * incoming.length),
                currentPosition: -((elemW * incoming.length) + elemW * sliderParams.step),
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
                startPosition: -(elemW * incoming.length),
                currentPosition: -((elemW * incoming.length) + elemW * sliderParams.step),
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
                startPosition: -(elemW * incoming.length),
                currentPosition: -((elemW * incoming.length) + elemW * sliderParams.step),
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

        let permission = false;
        let elementToHide;

        let makeStep = (step, event, elemW) => {
            console.log('makestep');
            if (event.target.classList.contains('prev')) elemW = -elemW;

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
                console.log('forwardhandl');
                let elemFarthestPosition = (arr, elem) => {
                    return (elem.startPosition) + elem.startPosition * (arr.indexOf(elem) + 1);
                };

                let arr = Array.from(section.childNodes);

                arr.forEach(
                    (elem, i) => {
                        if (getPosition(section.childNodes[i]) - (elemW * sliderParams.step) < elemFarthestPosition(wrappsArr, wrappsArr[i])) {
                            wrappsArr[i].currentPosition = (wrappsArr[i].currentPosition + (sliderParams.elemW * incoming.length * 3));
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
                        wrappsArr[i].currentPosition = (wrappsArr[i].currentPosition - (sliderParams.elemW * incoming.length * 3));
                        elementToHide = section.childNodes[i];
                        permission = true;
                    }
                }
            };
            event.target.classList.contains('next') ? forwardHandler() : event.target.classList.contains('prev') ? backwardHandler() : null;
        };

        document.querySelector(".next").onclick = (event) => {
            makeStep(sliderParams.step, event, sliderParams.elemW);
        };
        document.querySelector(".prev").onclick = (event) => {
            makeStep(sliderParams.step, event, sliderParams.elemW);
        }
    };

    function resizeCheck(resizeSets) {
        window.onresize = debounce(function () {

            let actualInnerWidth = document.body.clientWidth;

            resizeFunctions(resizeSets, actualInnerWidth).forEach(
                function (f) {
                    f();
                }
            );

        }, 500);
    }

    /*[first_function, ..., nth_function].forEach (function(f) {
    f('a string');
}); */

    this.render = function () {

        const mainTrack = document.createElement('section');
        mainTrack.id = 'main-track';
        mainTrack.style.cssText = `width: ${sliderParams.mainTrackW}px;`;

        document.querySelector('#carouselContainer').style.cssText = `width: ${(sliderParams.elemW * sliderParams.visibleNum)}px; overflow: hidden;`;
        /***********CSS**********/

        document.body.firstElementChild.appendChild(mainTrack);
        /***********CSS**********/

        const parentContainer = document.querySelector("#main-track");

        prepareImgs(sliderParams.elemW);

        for (let i = 0; i <= 2; i++) {
            const wrapper = document.createElement('div');
            wrapper.id = `wrapper-${i}`;
            parentContainer.appendChild(wrapper);
            document.querySelector(`#wrapper-${i}`).insertAdjacentHTML("afterBegin", prepareImgs(sliderParams.elemW));
        }

        centralize(parentContainer);
        sliderConstantStyles();
        sliderSets(sliderParams.animationDuration, sliderParams.animationTransitionTiming);
        spinSlider(sliderParams.photos, sliderParams.elemW, sliderParams.number);
        resizeCheck(resizeSets, this.render);
    };
}

let incoming = [
    "https://thumbs-prod.si-cdn.com/Ww78WE-L6T6Cwkz0fd74030skzY=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/46/9e/469e0cd2-8ded-47b2-825a-63e293072c47/space_debris_1.jpg",
    "https://cdn.spacetelescope.org/archives/images/screen/heic1808a.jpg",
    "https://images.financialexpress.com/2018/07/MAIN-PIC.jpg",
    "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg",
    "https://i.kym-cdn.com/entries/icons/mobile/000/025/734/7GXG21i.jpg",
    "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg",
    "https://i.kym-cdn.com/entries/icons/mobile/000/025/734/7GXG21i.jpg",
    "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg",
    "https://i.kym-cdn.com/entries/icons/mobile/000/025/734/7GXG21i.jpg",
    "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg",
    "https://i.kym-cdn.com/entries/icons/mobile/000/025/734/7GXG21i.jpg",
    "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg",
    "https://i.kym-cdn.com/entries/icons/mobile/000/025/734/7GXG21i.jpg"
];

/**********************************************************************temporary*/
let parameters = new Object();
parameters.duration = 0.3;
parameters.transitionTiming = 'ease-in';
/**********************************************************************************/

let slider1 = new Slider({
        photos: incoming,
        elemW: 200,
        visible: 7,
        step: 3,
        animation: {
            duration: 0.5,
            transitionTiming: 'ease-out'
        }
    },
    {
        maxWidth: 1600,
        photos: incoming,
        elemW: 150,
        visible: 7,
        step: 1,
        animation: {
            duration: 0.5,
            transitionTiming: 'ease-out'
        }
    },
    {
        maxWidth: 1200,
        photos: incoming,
        elemW: 150,
        visible: 7,
        step: 1,
        animation: {
            duration: 0.5,
            transitionTiming: 'ease-out'
        }
    }
);
slider1.render();
