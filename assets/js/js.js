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

let maxImgNumber = 3;
let minImgNumber = 1;

class imgLoader{
    constructor(){
        let self = this;
        this._imgLoaderData = {
            svg: document.querySelectorAll('svg'), // We do not need it if use one svg object
            image: 0,
            dots: [],
            timeout: null
        };

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
                        bottom: '40px'
                    }
                }
            ),
            {
                style: {
                    display: 'flex',
                    margin: 'auto'
                }
            }
        );
        for (let i = minImgNumber; i <= maxImgNumber; i++) {
            this.dots.push(createDot(i));
        }
        this.image = params.image;
        this.setInterval(3000);

        function createDot(image) {
            let dot = createHtmlElem(
                'div',
                envelope,
                {
                    style: {
                        margin: '0 5px',
                        border: '1px solid white',
                        borderRadius: '7px',
                        zIndex: '999',
                        width: '15px',
                        height: '15px',
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

    set image(value) {
        let image = parseInt(value);
        image = image >= minImgNumber && image <= maxImgNumber ? image : minImgNumber;
        this._imgLoaderData.image = image;
        setParamsImage(image);

        // It is not clear from the task whether we should have one svg element or three

        // So for one element we should set xlink:href

        document.getElementById('image2077').setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'xlink:href',
            `/assets/imgs/B1_${image}.jpg`
        );



        for (let k = minImgNumber, i = 0; k <= maxImgNumber; k++, i++) {
            this.dots[i].style.backgroundColor = image === k ? 'white' : '';
            // this.svg[i].style.display = image === k ? '' : 'none'; // This code we use for multiple svg objects
        }
        this.setInterval(3000);
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
}

function setParamsImage (image) {
    params.image = image;
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params.target}`));
}

let imageLoader;

window.addEventListener(
    'load',
    function () {
        imageLoader = new imgLoader();
    }
);
