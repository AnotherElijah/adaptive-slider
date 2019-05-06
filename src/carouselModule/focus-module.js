let focusModule = (...args) => {
    let img;
    let nextElem;
    addEventListener("load", (event) => {
            let [setLargeImg, resizeLargeImg, elementByCoords] = args;
            let renderContainer = () => {
                /*wrapper*/
                let wrapper = document.createElement('div');
                wrapper.id = 'largeImg-wrapper';
                document.querySelector('#carousel-wrapper').insertBefore(wrapper, document.querySelector('#carouselContainer'));
                /*overflow to avoid slider/height changing*/
                wrapper.setAttribute('style', 'overflow-y: hidden;');
                /*img inside wrapper*/
                let container = document.createElement('img');
                container.id = 'largeImg';
                document.querySelector('#largeImg-wrapper').appendChild(container);
            };

            window.runImgInsert = (srcoffset, resizeLargeImg) => {
                let animatePhoto = (elem, duration, changeSrc) => {
                    let root = document.documentElement;
                    img.style.transition = `all ${duration}s`;
                    root.style.setProperty('--changingTransition', `all ${duration}s`);

                    if (img.classList.contains("img-change--off")) img.classList.remove("img-change--off");
                    img.classList.add("img-change");

                    setTimeout(
                        () => {
                            changeSrc();
                            img.classList.add("img-change--off");
                            img.classList.remove("img-change");
                        }
                        , duration * 1000
                    );
                };

                let setImgHref = (href) => {
                    img = document.querySelector('#largeImg');
                    if (resizeLargeImg !== undefined) {
                        let setSrcWrapper = () => img.setAttribute('src', href);
                        for (let n in resizeLargeImg) {
                            resizeLargeImg[n].transition === true ? animatePhoto(img, '0.2', setSrcWrapper) : animatePhoto(img, '0.2', setSrcWrapper);
                        }
                    } else {
                        img.setAttribute('src', href);
                    }
                };

                nextElem = elementByCoords(srcoffset);

                try{
                    /*Desktop*/
                    var nextElemSrc = nextElem.src;
                }catch (err){
                    /*Mobile*/
                    var nextElemSrc = '';
                }
                setImgHref(nextElemSrc, 500, 500);
                setLargeImg();
            };

            window.bgModule = (/*direction, */nextElem) => {
                /*since there is no filter prop for background-image, background is a IMG*/
                let setBackground = hookElem => {
                    let background = document.createElement('img');
                    background.id = 'bg-image';
                    background.src = document.querySelector('#largeImg').src;
                    document.body.insertBefore(background, hookElem);
                };
                let replaceImgHref = () => {
                    setTimeout(() => {
                            try{document.querySelector('#bg-image').src = nextElem.src}catch(err){null;}
                        }, 190
                    )
                };

                let placeBg = () => {
                    if (!document.querySelector("#bg-image")) setBackground(document.querySelector("#carousel-wrapper"));
                    replaceImgHref();
                };
                placeBg();
            };

            renderContainer(300, 300);
            runImgInsert(0);
            bgModule(elementByCoords(0));
        }
    )
};

export {focusModule};

