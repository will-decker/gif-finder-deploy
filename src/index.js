import Macy from 'macy';

const searchBox = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const gifGrid = document.querySelector('#gif-grid');
const gifBlocks = document.getElementsByClassName('gif-block');
const trending = document.getElementById('trending');

let searchTerm = '';
const limit = 30;
let paginate = 0;
const searchEndPoint = 'http://localhost:5000/api/v1/giphy-search/?';
let searchUrl = `${searchEndPoint}limit=${limit}&q=`;
let searchParams;
const trendingEndPoint = 'http://localhost:5000/api/v1/giphy-trending/?';
let trendingUrl = `${trendingEndPoint}limit=${limit}`;

var macy = Macy({
  container: '#gif-grid',
  trueOrder: false,
  waitForImages: true,
  margin: 12,
  columns: 4,
  breakAt: {
    940: 3,
    520: 2,
    400: 1,
  },
});

init();

searchBtn.addEventListener('click', findGIFs);
searchBox.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    findGIFs();
  }
});

trending.addEventListener('click', getTrendingGIFs);

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (clientHeight + scrollTop >= scrollHeight - 5) {
    paginate += limit;
    searchParams = `${searchUrl}${searchTerm}&offset=${paginate}`;
    if (searchTerm != '') {
      getGIFs(searchParams);
    } else {
      getGIFs(`${trendingUrl}&offset=${paginate}`);
    }
  }
});

function addGIFToDOM(imgSrc, gifTitle) {
  const GIF = document.createElement('div');
  GIF.classList.add('gif-block');
  GIF.classList.add('hide');
  GIF.innerHTML = `
  <img src="${imgSrc}">
  <div class="gif-title">${gifTitle}</div>`;
  gifGrid.appendChild(GIF);
  GIF.onclick = gifZoom;
}

function gifZoom() {
  alert('hey');
}

function gifsReveal() {
  for (var i = 0; i < gifBlocks.length; i++) {
    gifBlocks[i].classList.remove('hide');
  }
}

function addGIFsToDOM(srcGIFs) {
  for (let i = 0; i < srcGIFs.data.length; i++) {
    let imgGIF = srcGIFs.data[i].images.downsized.url;
    let titleGIF = srcGIFs.data[i].title;
    addGIFToDOM(imgGIF, titleGIF);
  }

  macy.runOnImageLoad(function () {
    gifsReveal();
    macy.recalculate(true, true);
  });
}

function getTrendingGIFs() {
  searchTerm = '';
  clearDOM();
  getGIFs(trendingUrl);
  macy.reInit();
}

function findGIFs() {
  searchTerm = searchBox.value;
  clearDOM();
  searchParams = `${searchUrl}${searchTerm}&offset=${paginate}`;
  getGIFs(searchParams);
  macy.reInit();
  clearSearch();
}

function getGIFs(url) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onload = function () {
    if (this.status == 200) {
      const dataGIFs = JSON.parse(this.responseText);
      addGIFsToDOM(dataGIFs);
    }
  };
  xhr.send();
}

function clearSearch() {
  searchInput.value = '';
}

function clearDOM() {
  while (gifGrid.firstChild) {
    gifGrid.removeChild(gifGrid.firstChild);
  }
}

function init() {
  getTrendingGIFs();
}
