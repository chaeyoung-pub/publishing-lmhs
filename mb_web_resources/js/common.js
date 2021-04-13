"use strict";

document.addEventListener("DOMContentLoaded", function () {
  viewportHeight();
});

window.addEventListener("resize", function () {
  viewportHeight();
});

window.addEventListener("touchend", function () {
  viewportHeight();
});

// 뷰포트높이
function viewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// 스크롤에 따른 컨텐츠 활성화
function handleScroll() {
  const targets = document.querySelectorAll("[scroll-check]");
  const className = "active";

  targets.forEach(function (target) {
    const targetTop = window.pageYOffset + target.getBoundingClientRect().top;

    window.addEventListener("scroll", function () {
      window.scrollY >= targetTop
        ? setTimeout(function () {
            target.classList.add(className);
          }, 500)
        : target.classList.remove(className);
    });
  });
}

// 스크롤에 따른 하단영역 고정
function fixedBottomArea(containerClass) {
  const container = document.querySelector(`.${containerClass}`);
  const introArea = document.querySelector(".intro-area");
  const target = container.querySelector(".bottom-area");
  let scrollTop = window.pageYOffset + introArea.getBoundingClientRect().bottom;
  let scrollPosition;
  const className = "fixed";

  window.addEventListener("scroll", function () {
    scrollTop = window.pageYOffset + introArea.getBoundingClientRect().bottom;
    scrollPosition = window.scrollY || document.documentElement.scrollTop;
    scrollPosition >= scrollTop
      ? target.classList.add(className)
      : target.classList.remove(className);
  });
}

// 레이어팝업
function handleLayerPopup(id) {
  const body = document.querySelector("body");
  const target = document.querySelector(`#${id}`);
  const className = "active";
  const overflowClass = "ov-hidden";
  let popDim = document.querySelector(".ly-pop-dim");

  // 열기
  const openLayerPopup = function (target) {
    target.classList.add(className);
    body.classList.add(overflowClass);
    if (popDim === null) {
      popDim = document.createElement("div");
      popDim.classList.add("ly-pop-dim");
      popDim.classList.add("active");
      document.querySelector("body").appendChild(popDim);
    } else {
      popDim.classList.add("active");
    }
  };

  openLayerPopup(target);

  // 닫기
  const closeBtns = target.querySelectorAll("[pop-close]");

  const closeLayerPopup = function (target) {
    target.classList.remove(className);
    body.classList.remove(overflowClass);
  };

  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      popDim.classList.remove("active");
      closeLayerPopup(target);
    });
  });

  // 레이어팝업 내 swiper 관련
  let swiperContainer = target.querySelector(".swiper-container");

  let handleSwiper = function (container) {
    const swiper = new Swiper(swiperContainer, {
      pagination: {
        el: `#${id} .swiper-pagination`,
      },
    });

    swiper.update();

    closeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        swiper.destroy();
      });
    });
  };

  swiperContainer != null ? handleSwiper(swiperContainer) : false;
}

// 서비스소개 버튼 클릭시 스크롤 이동
function moveToContents() {
  const introArea = document.querySelector(".intro-area");
  let introAreaEnd = introArea.getBoundingClientRect().height;
  let scrollTop;

  scrollTop = introAreaEnd + 5;
  scrollMove(window, "top", scrollTop, 300);
  // window.scroll({
  //   left: 0,
  //   top: scrollTop,
  //   behavior: "smooth",
  // });
}

function easeInOutQuad(t, b, c, d) {
  var x = t / (d / 2);

  if (x < 1) {
    return (c / 2) * x * x + b;
  }

  x--;

  return (-c / 2) * (x * (x - 2) - 1) + b;
}

function scrollMove(element, direction, distance, duration) {
  if (!element) {
    return;
  }

  var start;
  var directionProp;

  if (element === window) {
    start = direction === "left" ? element.scrollX : element.scrollY;
  } else {
    start = direction === "left" ? element.scrollLeft : element.scrollTop;
    directionProp = direction === "left" ? "scrollLeft" : "scrollTop";
  }

  var change = distance - start;
  var startTime = new Date().getTime();
  var endTime = new Date().getTime() + duration;

  function animateScroll() {
    var now = new Date().getTime();
    var time = now - startTime;
    // console.log(time, start, change, duration)
    if (now <= endTime) {
      var val = easeInOutQuad(time, start, change, duration);

      if (element === window) {
        // console.log(val);
        window.scrollTo(0, val);
      } else {
        element[directionProp] = val;
      }

      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}
