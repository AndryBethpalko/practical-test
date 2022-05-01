/**
 *
 * @param {string} type
 * @param {HTMLElement} container
 * @param {Object} properties
 * @return {HTMLElement}
 */
function createHtmlElem(type, container, properties) {
    var elem = document.createElement(type);
    setElementProperty(elem, properties);
    container && container.appendChild(elem);
    return (elem);
}

/**
 *
 * @param {Object} elem
 * @param {Object} properties
 */
function setElementProperty(elem, properties) {
    if (properties) {
        for (var key in properties) {
            if (typeof properties[key] === 'object') {
                setElementProperty(elem[key], properties[key]);
            }
            else {
                elem[key] = properties[key];
            }
        }
    }
}

const maxImgNumber = 3;
const minImgNumber = 1;
const afterUserChangeInterval = 15000;
const defaultInterval = 3000;

class imgLoader {
    constructor() {
        let self = this;
        this._imgLoaderData = {
            svg: document.querySelectorAll('svg'), // We do not need it if use one svg object
            panzoom: [], // We do not need it if use one svg object
            image: 0,
            dots: [],
            timeout: null
        };

        for (let i = 0; i < this.svg.length; i++) {
            this._imgLoaderData.panzoom.push(
                {
                    target: createPanZoom(
                        this.svg[i],
                        function () {
                            this.setInterval(afterUserChangeInterval);
                        }.bind(this)
                    ),
                    resized: true
                }
            );
        }

        let envelope = createHtmlElem(
            'div',
            createHtmlElem(
                'div',
                document.getElementById('en'),
                {
                    style: {
                        display: 'flex',
                        position: 'absolute',
                        width: '100%',
                        bottom: '20vh'
                    }
                }
            ),
            {
                style: {
                    display: 'flex',
                    margin: 'auto',
                    backgroundColor: 'rgb(128 128 128 /35%)',
                    borderRadius: '5px'
                }
            }
        );
        createArrow(
            '&lt',
            function () {
                let image = this.image;
                this.image = image <= minImgNumber ? maxImgNumber : image - 1;
                this.setInterval(afterUserChangeInterval);
            }.bind(this)
        );
        for (let i = minImgNumber; i <= maxImgNumber; i++) {
            this.dots.push(createDot(i));
        }
        createArrow(
            '&gt',
            function () {
                this.image++;
                this.setInterval(afterUserChangeInterval);
            }.bind(this)
        );
        window.addEventListener(
            'resize',
            this.onResize.bind(this)
        );
        setTimeout(
            function () {
                this.image = params.image;
            }.bind(this),
            200
        );


        function createArrow(sign, collBack) {
            let arrow = createHtmlElem(
                'div',
                envelope,
                {
                    innerHTML: sign,
                    className: 'floating-text-button',
                    style: {
                        margin: 'auto 5px',
                        zIndex: '999',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }
                }
            );
            arrow.addEventListener(
                'click',
                collBack
            );
        }

        function createDot(image) {
            let dot = createHtmlElem(
                'div',
                envelope,
                {
                    className: 'floating-button',
                    style: {
                        margin: 'auto 5px',
                        border: '1px solid white',
                        borderRadius: '7px',
                        zIndex: '999',
                        width: '15px',
                        height: '15px',
                        cursor: 'pointer'
                    }
                }
            );

            dot.addEventListener(
                'click',
                function () {
                    self.image = image;
                }
            );
            return dot;
        }
    }

    get svg() {
        return this._imgLoaderData.svg;
    }

    get timeout() {
        return this._imgLoaderData.timeout;
    }

    set timeout(value) {
        this._imgLoaderData.timeout = value;
    }

    get dots() {
        return this._imgLoaderData.dots;
    }

    get image() {
        return this._imgLoaderData.image;
    }

    get panzoom() {
        return this._imgLoaderData.panzoom;
    }

    set image(value) {
        let image = parseInt(value);
        image = image >= minImgNumber && image <= maxImgNumber ? image : minImgNumber;
        this._imgLoaderData.image = image;
        setParamsImage(image);

        // It is not clear from the task whether we should have one svg element or three

        // So for one element we should set xlink:href

        // document.getElementById('image2077').setAttributeNS(
        //     'http://www.w3.org/1999/xlink',
        //     'xlink:href',
        //     `/assets/imgs/B1_${image}.jpg`
        // );


        for (let k = minImgNumber, i = 0; k <= maxImgNumber; k++, i++) {
            this.dots[i].style.backgroundColor = image === k ? 'white' : '';
            this.svg[i].style.display = image === k ? '' : 'none'; // This code we use for multiple svg objects
            if (image === k) {
                setQueryStringParameterAndSaveItInBrowserHistory(
                    this.panzoom[i].target,
                    'zoom',
                    this.panzoom[i].target.getScale().toFixed(2)
                );
                if (!this.panzoom[i].resized) {
                    this.panzoom[i].target.destroy();
                    this.panzoom[i].target = createPanZoom(
                        this.svg[i],
                        function () {
                            this.setInterval(afterUserChangeInterval);
                        }.bind(this)
                    );
                    this.panzoom[i].resized = true;
                }
            }
        }
        this.setInterval(defaultInterval);
        // fire Google Analytics event
        // dataLayer.push(
        //     {
        //         'event': 'ImgShow',
        //         'img': `B1_${image}.jpg`
        //     }
        // );
    }

    /**
     *
     * @param {number} value
     */
    setInterval(value) {
        clearInterval(this.timeout);
        this.timeout = setTimeout(
            function () {
                let image = this.image;
                if (++image > maxImgNumber) {
                    image = minImgNumber;
                }
                this.image = image;
            }.bind(this),
            value
        );
    }

    onResize() {
        for (let i = 0; i < this.panzoom.length; i++) {
            if (i !== this.image - minImgNumber) {
                this.panzoom[i].resized = false;
            } else {
                this.panzoom[i].target.destroy();
                this.panzoom[i].target = createPanZoom(
                    this.svg[i],
                    function () {
                        this.setInterval(afterUserChangeInterval);
                    }.bind(this)
                );
            }
        }
    }
}

function setParamsImage(image) {
    params.image = image;
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params.target}`));
}

let imageLoader = null;

window.addEventListener(
    'load',
    function () {
        imageLoader = new imgLoader();
    }
);
