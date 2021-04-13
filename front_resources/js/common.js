"use strict";

document.addEventListener("DOMContentLoaded", function () {
  tblCover();
});

/*****************
  테이블커버
******************/
function tblCover() {
  const tblCoverContainer = document.querySelectorAll("[tbl-cover]");
  let txt;

  const createCoverText = function (container) {
    container.classList.add("tbl-cover");
    txt = document.createElement("p");
    txt.classList.add("tbl-cover-txt");
    txt.innerHTML = "좌우 스크롤로<br />확인해 보세요";
    container.appendChild(txt);
  };

  const paintCover = function () {
    Array.prototype.forEach.call(tblCoverContainer, function (container) {
      createCoverText(container);
    });
  };

  const handleEvent = function (target) {
    target.addEventListener("click", function (e) {
      txt = target.querySelector(".tbl-cover-txt");
      target.removeChild(txt);
      target.classList.remove("tbl-cover");
    });
  };

  tblCoverContainer.length >= 1 ? paintCover() : false;
  Array.prototype.forEach.call(tblCoverContainer, function (container) {
    handleEvent(container);
  });
}

/*****************
  로딩
******************/
function loadingStart() {
  let container = document.querySelector(".loading-wrap");
  const paintingLoadingbar = function () {
    container = document.createElement("div");
    const loadingBar = document.createElement("div");
    container.classList.add("loading-wrap");
    loadingBar.classList.add("loading");
    document.body.appendChild(container);
    container.appendChild(loadingBar);
  };
  const showLoadingBar = function () {
    container.classList.remove("dp-none");
  };

  container == null ? paintingLoadingbar() : showLoadingBar();
}

function loadingStop() {
  const container = document.querySelector(".loading-wrap");
  container.classList.add("dp-none");
}
