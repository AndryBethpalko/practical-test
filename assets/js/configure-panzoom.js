const svg = document.querySelector('svg');
const step = 0.5;

params.zoom ||= 1.0;

var panzoom = Panzoom(svg, {
  zoomEnabled: true,
  disablePan: false,
  animate: false,
  duration: 300,
  contain: 'outside',
  easing: 'ease',
  maxScale: 9,
  roundPixels: true,
});

function setQueryStringParameterAndSaveItInBrowserHistory(name, value) {
  params[name] = value;
  const pan = panzoom.getPan();
  params.x = pan.x.toFixed(0);
  params.y = pan.y.toFixed(0);
  window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params.target}`));
}

svg.addEventListener('wheel', (event) => {
  // if (!event.ctrlKey) return;
  // only use zoom with Ctrl, to not disturb scrolling

  event.preventDefault();

  // Fixed by https://github.com/timmywil/panzoom/issues/586
  const delta =
    event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY;
  const scale = panzoom.getScale();
  const toScale = scale * Math.exp((delta * step * -1) / 300);

  panzoom.zoom(toScale);

  setQueryStringParameterAndSaveItInBrowserHistory('zoom', toScale.toFixed(2));
}, { passive: false });

const startScale = params.zoom || 1;
const startX = params.x || 0;
const startY = params.y || 0;

setTimeout(() => panzoom.zoom(startScale));
setTimeout(() => panzoom.pan(startX, startY), 100);
