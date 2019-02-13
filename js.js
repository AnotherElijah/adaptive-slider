function Slider(incoming, elemW, visibleNum, step, parameters) {

    sliderParams = {
        elemW: elemW,
        mainTrackW: elemW * incoming.length * 3,
        visibleNum: visibleNum,
        number: incoming.length,
        step: step
    };

    sliderConstantStyles = () => {
        document.body.insertAdjacentHTML("beforeEnd", "<style></style>");
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
    args = incoming.map((link, i) => {
        return `<img width='${sliderParams.elemW}px' id="pic${i}" src=${link}>`;
    });

    this.render = function () {

        args = args.join('');
        const mainTrack = document.createElement('section');
        mainTrack.id = 'main-track';
        mainTrack.style.cssText = `width: ${sliderParams.mainTrackW}px;`;

        document.querySelector('#carouselContainer').style.cssText = `width: ${sliderParams.elemW * sliderParams.visibleNum}px; overflow: hidden;`;
        /***********CSS**********/

        document.body.firstElementChild.appendChild(mainTrack);
        /***********CSS**********/
        const parentContainer = document.querySelector("#main-track");

        for (let i = 0; i <= 2; i++) {
            const wrapper = document.createElement('div');
            wrapper.id = `wrapper-${i}`;
            parentContainer.appendChild(wrapper);

            document.querySelector(`#wrapper-${i}`).insertAdjacentHTML("afterBegin", args);
        }
        this.centralize(parentContainer);
        sliderConstantStyles();
        sliderSets(parameters.duration, parameters.transitionTiming);
    };

    this.centralize = function (parentContainer) {

        for (let i = 0; i < parentContainer.childNodes.length; i++) {
            const wrapper = document.querySelector(`#wrapper-${i}`);

            if (parentContainer.childNodes[i].nodeType === 3) continue;

            if (i === parentContainer.childNodes.length - 1) {
                wrapper.style.cssText = `transform: translate3d(-${elemW * incoming.length}px, 0px, 0px)`;
            } else {
                wrapper.style.cssText = `transform: translate3d(-${elemW * incoming.length}px, 0px, 0px)`;
            }
        }

    };

    this.forward = (incoming, elemW) => {

        let counter = 0;
        const section = document.querySelector("#main-track");
        let wrappsArr = [
            {
                currentPosition: -(elemW * incoming.length),
                visibility: true,
                makeInvisible(){
                    if(this.visibility === false){
                        this.visibility = true;
                        return 'visibility: hidden!important';
                    }else{
                        return 'visibility: visible!important';
                    }
                }
            },
            {
                currentPosition: -(elemW * incoming.length),
                visibility: true,
                makeInvisible(){
                    if(this.visibility === false){
                        this.visibility = true;
                        return 'visibility: hidden!important';
                    }else{
                        return 'visibility: visible!important';
                    }
                }
            },
            {
                currentPosition: -(elemW * incoming.length),
                visibility: true,
                makeInvisible(){
                    if(this.visibility === false){
                        this.visibility = true;
                        return 'visibility: hidden!important';
                    }else{
                        return 'visibility: visible!important';
                    }
                }
            }
        ];

        let makeStep = (step) => {

            let newPosition = wrappsArr.map(item => {
                return item.currentPosition - elemW
            });
            section.childNodes[0].style.cssText = `transform: translate3d(${newPosition[0]}px, 0px, 0px);`;
            section.childNodes[1].style.cssText = `transform: translate3d(${newPosition[1]}px, 0px, 0px);`;
            section.childNodes[2].style.cssText = `transform: translate3d(${newPosition[2]}px, 0px, 0px);`;

            wrappsArr.forEach((elem, i) => {
                elem.currentPosition = newPosition[i];
            });
            counter++;
            console.log(
                'counter: ' + counter);

            if ((counter) % sliderParams.number === 0 || counter===sliderParams.number*3-1) {
                switch ((counter) / sliderParams.number) {
                    case 1:
                        console.log(
                            'counter: ' + counter,
                            'number: '+sliderParams.number,
                            '(counter) % sliderParams.number = '+(counter) % sliderParams.number
                        );
                        section.childNodes[0].classList.add('transit');
                        setTimeout(()=>{
                            section.childNodes[0].classList.remove('transit');
                        }, parameters.duration);
                        break;
                    case 2:
                        console.log(
                            'counter: ' + counter,
                            'number: '+sliderParams.number,
                            '(counter) % sliderParams.number = '+(counter) % sliderParams.number
                        );
                        section.childNodes[1].classList.add('transit');
                        setTimeout(()=>{
                            section.childNodes[1].classList.remove('transit');
                        }, parameters.duration);
                        break;
                    default:
                        console.log(
                            'counter: ' + counter,
                            'number: '+sliderParams.number,
                            '(counter) % sliderParams.number = '+(counter) % sliderParams.number
                        );
                        section.childNodes[2].classList.add('transit');
                        setTimeout(()=>{
                            section.childNodes[2].classList.remove('transit');
                        }, parameters.duration);
                        break;
                }
            }

            //if (runMakeVisible.permission === true) runMakeVisible.makeVisible(counter, sliderParams.step);

            if ((counter + 1) % sliderParams.number === 0) {
                switch ((counter + 1) / sliderParams.number) {
                    case 1:
                        wrappsArr[0].currentPosition = (wrappsArr[0].currentPosition + (sliderParams.elemW * incoming.length * 3));

                        break;
                    case 2:
                        wrappsArr[1].currentPosition = (wrappsArr[1].currentPosition + (sliderParams.elemW * incoming.length * 3));
                        break;
                    case 3:
                        console.log('***');
                        wrappsArr[2].currentPosition = (wrappsArr[2].currentPosition + (sliderParams.elemW * incoming.length * 3));
                        counter = -1;
                        break;
                }
            }

            step--;
            step > 0 ? makeStep(step) : null;
        };

        document.querySelector(".move").onclick = () => {
            makeStep(sliderParams.step);
            /*      document.querySelector(".prev").onclick = () => {
                      makeStepBack(sliderParams.step);*/
        };

    };

    document.body.onload = () => this.forward(incoming, elemW, sliderParams.number);

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
let slider1 = new Slider(incoming, 100, 7, 7, parameters);

slider1.render();

