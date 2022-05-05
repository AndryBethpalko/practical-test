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
const afterUserChangeInterval = 0;
const defaultInterval = 2000;

class imgLoader {
    constructor(svgContainer, img) {
        let self = this;
        this._imgLoaderData = {
            svgContainer: svgContainer,
            panzoom: null,
            htmlImg: img,
            image: 0,
            dots: [],
            timeout: null
        };
        // // this.onResize();
        // let doc = loadXMLDoc(
        //     '/assets/imgs/B1_1.svgContainer'
        // );

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
                let img = params.image;
                this.image = img;
                img === null && this.setInterval(defaultInterval);
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
                    self.setInterval(afterUserChangeInterval);
                }
            );
            return dot;
        }
    }

    get svgContainer() {
        return this._imgLoaderData.svgContainer;
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

    get htmlImg() {
        return this._imgLoaderData.htmlImg;
    }

    get panzoom() {
        return this._imgLoaderData.panzoom;
    }

    set panzoom(value) {
        this._imgLoaderData.panzoom = value;
    }

    set image(value) {
        let image = parseInt(value);
        image = image >= minImgNumber && image <= maxImgNumber ? image : minImgNumber;
        this._imgLoaderData.image = image;
        setParamsImage(image);
        this.svgContainer.innerHTML = '';
        this.loadImg(image);


        for (let k = minImgNumber, i = 0; k <= maxImgNumber; k++, i++) {
            this.dots[i].style.backgroundColor = image === k ? 'white' : '';
        }
        dataLayer.push({ecommerce: null});  // Clear the previous ecommerce object.
        dataLayer.push(
            {
                'ecommerce': {
                    'impressions': [
                        {
                            'name': `B1_${image}.jpg`,
                            'id': image,
                            'list': 'List 1'
                        }
                    ]
                },
                'event': 'gtm-ee-event',
                'gtm-ee-event-category': 'Enhanced Ecommerce',
                'gtm-ee-event-action': 'Product Impressions',
                'gtm-ee-event-label': `B1_${image}.jpg`
            }
        );
    }

    reqListener(response) {
        // this.svgContainer.appendChild(response.responseXML.children[0]);
        this.svgContainer.innerHTML = response.responseText;
        setTimeout(
            function () {
                this.onResize();
                setQueryStringParameterAndSaveItInBrowserHistory(
                    this.panzoom,
                    'zoom',
                    this.panzoom.getScale().toFixed(2)
                );
            }.bind(this)
        );
    }

    loadImg(image) {
        var oReq = new XMLHttpRequest();
        var self = this;
        oReq.addEventListener(
            "load",
            function () {
                self.reqListener(this)
            }
        );
        let time = Date.now();
        oReq.open("GET", `assets/imgs/B1_${image}.svg?${time}`);
        oReq.send();
    }

    /**
     *
     * @param {number} value
     */
    setInterval(value) {
        this.timeout && clearInterval(this.timeout);
        this.timeout = value ? setTimeout(
            function () {
                let image = this.image;
                if (++image > maxImgNumber) {
                    image = minImgNumber;
                }
                this.image = image;
                this.setInterval(defaultInterval);
            }.bind(this),
            value
        ) : null;
    }

    onResize() {
        this.panzoom && this.panzoom.destroy();
        this.panzoom = createPanZoom(
            this.svgContainer.querySelector('svg'),
            function () {
                this.setInterval(afterUserChangeInterval);
            }.bind(this)
        );
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
        imageLoader = new imgLoader(document.getElementById('svgbox'));
    }
);
