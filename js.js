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
        styleTag.insertAdjacentHTML('beforeEnd', '.hidden{visibility: hidden; }')

    };

    sliderSets = (duration = 0.7, transitionTiming = 'ease') => {
        let imgElems = document.querySelectorAll(`#main-track div`);
        imgElems = Array.from(imgElems);
        imgElems.map(() => document.getElementsByTagName('style')[0].insertAdjacentHTML('beforeEnd', `#main-track div{ transition: transform ${duration}s ${transitionTiming};}`))
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

        document.querySelector('#carouselContainer').style.cssText = `width: ${sliderParams.elemW * sliderParams.visibleNum}px; overflow: hidden;`;/***********CSS**********/

        document.body.firstElementChild.appendChild(mainTrack);/***********CSS**********/
        const parentContainer = document.querySelector("#main-track");

        for (let i = 0; i <= 2; i++) {
            const wrapper = document.createElement('div');
            wrapper.id = `wrapper-${i}`;
            parentContainer.appendChild(wrapper);

            document.querySelector(`#wrapper-${i}`).insertAdjacentHTML("afterBegin", args);
        }
        this.centralize(parentContainer);
        sliderConstantStyles();
        sliderSets();
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

        let counter = 1;
        const section = document.querySelector("#main-track");
        const position = [
            [elemW * incoming.length, 1],
            [elemW * incoming.length, 1],
            [elemW * incoming.length, 1]];

        let runMakeVisible = {
            permission: false,
            saveCounter:null,
            makeVisible (counter) {
                if (counter === this.saveCounter+4) {
                    let elem = document.querySelector('.hidden').getAttribute('id');
                    document.querySelector('#' + elem).classList.remove('hidden');
                    this.permission = false;
                }
            }
        };

        let makeStep = (step) => {
            section.childNodes[0].style.cssText = `transform: translate3d(${-position[0][0] - (position[0][1] * elemW)}px, 0px, 0px)`;
            position[0][1] += 1;
            section.childNodes[1].style.cssText = `transform: translate3d(${-position[1][0] - (position[1][1] * elemW)}px, 0px, 0px)`;
            position[1][1] += 1;
            section.childNodes[2].style.cssText = `transform: translate3d(${-position[2][0] - (position[2][1] * elemW)}px, 0px, 0px)`;
            position[2][1] += 1;
            counter++;


            if(runMakeVisible.permission===true) runMakeVisible.makeVisible(counter);

            if (counter % sliderParams.number === 0) {
                switch (counter / sliderParams.number) {
                    case 1:
                        section.childNodes[0].classList.add('hidden');
                        position[0][1] = -sliderParams.number * 2;
                        runMakeVisible.permission=true;
                        runMakeVisible.saveCounter = counter;
                        console.log('1');
                        break;
                    case 2:
                        section.childNodes[1].classList.add('hidden');
                        position[0][1] = -sliderParams.number;
                        position[1][1] = -sliderParams.number;
                        runMakeVisible.permission=true;
                        runMakeVisible.saveCounter = counter;
                        break;
                    case 3:
                        section.childNodes[2].classList.add('hidden');
                        position[0][1] = 0;
                        position[1][1] = 0;
                        position[2][1] = 0;
                        counter = 0;
                        runMakeVisible.permission=true;
                        runMakeVisible.saveCounter = counter;
                        break;
                }
            }

            step--;
            step > 0 ? makeStep(step) : null;
        };
        document.querySelector(".move").onclick = () => {
            makeStep(sliderParams.step);
        };

    };

    document.body.onload = () => this.forward(incoming, elemW, sliderParams.number);

}

let incoming = [
    "https://i.redd.it/5el0ahv4l5hz.jpg",
    "https://ichef.bbci.co.uk/childrens-responsive-ichef-ck/400xn/amz/cbeebies/teletubbies-map-hero.jpg",
    "https://thumbs-prod.si-cdn.com/Ww78WE-L6T6Cwkz0fd74030skzY=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/46/9e/469e0cd2-8ded-47b2-825a-63e293072c47/space_debris_1.jpg",
    "https://cdn.spacetelescope.org/archives/images/screen/heic1808a.jpg",
    "https://images.financialexpress.com/2018/07/MAIN-PIC.jpg",
    "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg",
    "https://i.redd.it/5el0ahv4l5hz.jpg",
    "https://ichef.bbci.co.uk/childrens-responsive-ichef-ck/400xn/amz/cbeebies/teletubbies-map-hero.jpg",
    "https://thumbs-prod.si-cdn.com/Ww78WE-L6T6Cwkz0fd74030skzY=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/46/9e/469e0cd2-8ded-47b2-825a-63e293072c47/space_debris_1.jpg",
    "https://cdn.spacetelescope.org/archives/images/screen/heic1808a.jpg",
    "https://images.financialexpress.com/2018/07/MAIN-PIC.jpg",
    "https://cgfrog.com/wp-content/uploads/2014/04/play-with-sun-perfect-timing-click.jpg",
    "https://i.kym-cdn.com/entries/icons/mobile/000/025/734/7GXG21i.jpg"
];

/**********************************************************************temporary*/
let parameters = new Object();
parameters.duration = 0.5;
parameters.transitionTiming = 'ease-in';
/**********************************************************************************/
let slider1 = new Slider(incoming, 170, 5, 3);

slider1.render();

