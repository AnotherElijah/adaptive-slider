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

        document.querySelector('#carouselContainer').style.cssText = `width: ${(sliderParams.elemW * sliderParams.visibleNum)-sliderParams.elemW*1}px; overflow: hidden;`;
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
            if (i !== parentContainer.childNodes.length - 1) wrapper.style.cssText = `transform: translate3d(-${(elemW * incoming.length)+elemW}px, 0px, 0px)`;
        }
    };

    this.spinSlider = (incoming, elemW) => {

        const section = document.querySelector("#main-track");

        let wrappsArr = [
            {
                startPosition: -(elemW * incoming.length),
                currentPosition: -((elemW * incoming.length)+elemW),
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
                startPosition: -(elemW * incoming.length),
                currentPosition: -((elemW * incoming.length)+elemW),
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
                startPosition: -(elemW * incoming.length),
                currentPosition: -((elemW * incoming.length)+elemW),
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

        let permission = false;
        let elementToHide;

        let makeStep = (step, event, elemW) => {

            if(event.target.classList.contains('prev')) elemW = -elemW;

            let newPosition = wrappsArr.map(item => {
                return item.currentPosition - elemW*sliderParams.step;
            });

            let hideElem = elem => {
                console.log(elem);
                elem.classList.add('transit');
                setTimeout(()=>{
                    elem.classList.remove('transit');
                }, parameters.duration);
                permission = false;
            };

            if(permission) hideElem(elementToHide);

            section.childNodes[0].style.cssText = `transform: translate3d(${newPosition[0]}px, 0px, 0px);`;
            section.childNodes[1].style.cssText = `transform: translate3d(${newPosition[1]}px, 0px, 0px);`;
            section.childNodes[2].style.cssText = `transform: translate3d(${newPosition[2]}px, 0px, 0px);`;

            wrappsArr.forEach((elem, i) => {
                elem.currentPosition = newPosition[i];
            });

            let getPosition = (elem) =>{
                let positionStr = elem.style.transform;
                positionStr = positionStr.replace('translate3d(', '')
                    .replace('px, 0px, 0px)', '');
                return positionStr;
            };

            let forwardHandler = () =>{

                let elemFarthestPosition = (arr, elem) => {
                    return (elem.startPosition)+elem.startPosition*(arr.indexOf(elem)+1);
                };

                let arr = Array.from(section.childNodes);

                arr.forEach(
                    (elem, i)=>{
                        if (getPosition(section.childNodes[i])-(elemW*sliderParams.step)<elemFarthestPosition(wrappsArr, wrappsArr[i])){
                            console.log('move');
                            wrappsArr[i].currentPosition = (wrappsArr[i].currentPosition + (sliderParams.elemW * incoming.length * 3));
                            elementToHide = section.childNodes[i];
                            permission = true;
                        }
                    }
                );
            };

            let backwardHandler = () =>{

                let elemFarthestPosition = (arr, elem) => {
                    arr = Array.from(arr);
                    arr = arr.reverse();
                    return (elem.startPosition)-elem.startPosition*(arr.indexOf(elem));
                };

                for(let i = 2; i >= 0; i--){
                    console.log('i: '+i);
                    console.log('childnodes'+section.childNodes[i]);
                    if (getPosition(section.childNodes[i])-(elemW*sliderParams.step)>elemFarthestPosition(wrappsArr, wrappsArr[i])){
                        console.log(elemFarthestPosition(wrappsArr, wrappsArr[i])+'---'+wrappsArr[i]);
                        wrappsArr[i].currentPosition = (wrappsArr[i].currentPosition - (sliderParams.elemW * incoming.length * 3));
                        elementToHide = section.childNodes[i];
                        permission = true;
                    }
                }
            };
            event.target.classList.contains('next')? forwardHandler():event.target.classList.contains('prev')? backwardHandler():null;
        };

        document.querySelector(".next").onclick = (event) => {
            makeStep(sliderParams.step, event, elemW);
        };
        document.querySelector(".prev").onclick = (event) => {
            makeStep(sliderParams.step, event, elemW);
        }
    };

    document.body.onload = () => this.spinSlider(incoming, elemW, sliderParams.number);

}

let incoming = [
    "https://thumbs-prod.si-cdn.com/Ww78WE-L6T6Cwkz0fd74030skzY=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/46/9e/469e0cd2-8ded-47b2-825a-63e293072c47/space_debris_1.jpg",
    "https://cdn.spacetelescope.org/archives/images/screen/heic1808a.jpg",
    "https://images.financialexpress.com/2018/07/MAIN-PIC.jpg",
    "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg",
    "https://i.kym-cdn.com/entries/icons/mobile/000/025/734/7GXG21i.jpg",
    "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg"
    // "https://i.kym-cdn.com/entries/icons/mobile/000/025/734/7GXG21i.jpg",
    // "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg",
    // "https://i.kym-cdn.com/entries/icons/mobile/000/025/734/7GXG21i.jpg",
    // "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg",
    // "https://i.kym-cdn.com/entries/icons/mobile/000/025/734/7GXG21i.jpg",
    // "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg",
    // "https://i.kym-cdn.com/entries/icons/mobile/000/025/734/7GXG21i.jpg"
];

/**********************************************************************temporary*/
let parameters = new Object();
parameters.duration = 0.3;
parameters.transitionTiming = 'ease-in';
/**********************************************************************************/
let slider1 = new Slider(incoming, 100, 5, 2, parameters);

slider1.render();
