document.addEventListener("DOMContentLoaded", function () {
  admin_lnb();
  datepicker();
  lyPop();
  toggle();
  allCheck();
  buttonSort();
  textOverflow();
  inputFile();
});

window.addEventListener("resize", function () {
  textOverflow();
});

/*****************
  admin_lnb
******************/
function admin_lnb() {
  // 드롭다운
  const dropTrigger = $(".admin-menu>li>a:not(:only-child)");

  if (dropTrigger.hasClass("active")) {
    $(this).parent("li").addClass("toggle");
  }

  $(dropTrigger).on("click", function (e) {
    e.preventDefault();
    $(this).next().slideToggle();

    if ($(this).parent("li").hasClass("toggle")) {
      dropTrigger.parent("li").removeClass("toggle");
    } else {
      dropTrigger.not($(this)).next().slideUp();
      dropTrigger.parent("li").removeClass("toggle");
      $(this).parent("li").addClass("toggle");
    }
  });
}

/*****************
  datepicker
******************/
function datepicker() {
  const currunt = new Date();
  const currentYear = currunt.getFullYear();
  const set_datepicker = {
    dateFormat: "yy-mm-dd",
    showOn: "both",
    yearRange: currentYear + ":+10",
    monthNamesShort: [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ], //달력의 월 부분 텍스트
    monthNames: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ], //달력의 월 부분 Tooltip 텍스트
    dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"], //달력의 요일 부분 텍스트
    dayNames: [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ], //달력의 요일 부분 Tooltip 텍스트
    showMonthAfterYear: true,
    changeYear: true,
    changeMonth: true,
    buttonImage: "../../../resources/img/common/ico_calendar.png",
    buttonImageOnly: true,
    hideIfNoPrevNext: true,
    showButtonPanel: true,
    buttonText: "",
    currentText: "",
    prevText: "",
    nextText: "",
    // minDate: 0,
  };

  $(".datepicker").each(function () {
    const el_date = $(this).find(".date");

    el_date.attr("maxlength", "8");
    el_date.addClass("readonly");
    el_date.attr("readonly", "readonly");
    el_date.attr("placeholder", "YYYY-MM-DD");

    if (el_date.length > 1) {
      // 기간선택
      const id_date_start = el_date.eq(0).attr("id");
      const id_date_end = el_date.eq(1).attr("id");

      $("#" + id_date_start)
        .datepicker(set_datepicker)
        .datepicker("option", "onSelect", function (dateText) {
          $("#" + id_date_end).datepicker("option", "minDate", dateText);
        });

      $("#" + id_date_end)
        .datepicker(set_datepicker)
        .datepicker("option", "onSelect", function (dateText) {
          $("#" + id_date_start).datepicker("option", "maxDate", dateText);
        });
    } else {
      // 날짜 선택
      const id_date = $(this).find(".date").eq(0).attr("id");
      $("#" + id_date).datepicker(set_datepicker);
    }
  });
}

/*****************
  레이어 팝업
******************/
function lyPop() {
  const popTrigger = document.querySelectorAll("[data-ly-pop-trigger]");
  let popDim;

  if (popTrigger.length) {
    popDim = document.createElement("div");
    popDim.classList.add("ly-pop-dim");
    document.querySelector("body").appendChild(popDim);
  }

  Array.prototype.forEach.call(popTrigger, function (pop) {
    const getPopId = pop.getAttribute("data-ly-pop-trigger");
    const setPopId = document.querySelector("#" + getPopId);

    pop.addEventListener("click", function (e) {
      e.preventDefault();

      setPopId.classList.add("active");
      popDim.classList.add("active");
      openCallBack();
    });

    const popClose = setPopId.querySelectorAll("[data-pop-close]");

    Array.prototype.forEach.call(popClose, function (pop1) {
      pop1.addEventListener("click", function (e) {
        e.preventDefault();

        setPopId.classList.remove("active");
        popDim.classList.remove("active");
      });
    });
  });
}
function openCallBack() {
  return 1;
}

/*****************
  toggle
******************/
function toggle() {
  const buttons = document.querySelectorAll("[data-toggle-trigger]");

  Array.prototype.forEach.call(buttons, function (btn) {
    // 라디오 체크여부에 따른 토글
    if (btn.tagName === "INPUT") {
      const parent = btn.parentElement;
      const container = parent.parentElement;
      const contents = container.querySelectorAll(".toggle-content");
      let getId = btn.getAttribute("data-toggle-trigger");
      let content = container.querySelector("#" + getId);
      const getName = btn.getAttribute("name");
      const items = container.querySelectorAll('input[name="' + getName + '"]');

      btn.checked
        ? content.classList.add("active")
        : content.classList.remove("active");

      Array.prototype.forEach.call(items, function (item) {
        item.addEventListener("change", function () {
          Array.prototype.forEach.call(contents, function (content1) {
            content1.classList.remove("active");
          });

          if (item.hasAttribute("data-toggle-trigger")) {
            getId = item.getAttribute("data-toggle-trigger");
            content = container.querySelector("#" + getId);

            item.checked
              ? content.classList.add("active")
              : content.classList.remove("active");
          } else {
            btn.checked
              ? content.classList.add("active")
              : content.classList.remove("active");
          }
        });
      });
    }
    // 버튼 이벤트에 따른 토글
    else {
      const container2 = btn.parentElement;
      const getId2 = btn.getAttribute("data-toggle-trigger");
      const content2 = container2.querySelector("#" + getId2);

      btn.addEventListener("click", function () {
        container2.classList.toggle("active");
        content2.classList.toggle("active");
      });
    }
  });
}

/*****************
  전체동의
******************/
function allCheck() {
  const containers = document.querySelectorAll("[data-checkbox-all]");

  Array.prototype.forEach.call(containers, function (container) {
    const allCheck = container.querySelector("[data-checkbox-trigger]");
    const getName = allCheck.getAttribute("name");
    const checkboxes = container.querySelectorAll(
      'input[name="' +
        getName +
        '"]:not(:disabled):not([data-checkbox-trigger])'
    );

    // 전체동의 체크박스 이벤트에 따른 체크박스 상태변경
    allCheck.addEventListener("change", function () {
      if (allCheck.checked) {
        Array.prototype.forEach.call(checkboxes, function (checkbox) {
          checkbox.checked = true;
        });
      } else {
        Array.prototype.forEach.call(checkboxes, function (checkbox) {
          checkbox.checked = false;
        });
      }
    });

    // 체크박스 이벤트에 따른 전체동의체크 상태변경
    Array.prototype.forEach.call(checkboxes, function (checkbox) {
      checkbox.addEventListener("change", function () {
        let countChecked = 0;

        Array.prototype.forEach.call(checkboxes, function (checkbox2) {
          if (checkbox2.checked) {
            countChecked += 1;
          }
        });

        if (checkboxes.length === countChecked) {
          allCheck.checked = true;
        } else {
          allCheck.checked = false;
        }
      });
    });
  });
}

/*****************
  정렬버튼
******************/
function buttonSort() {
  const btns = document.querySelectorAll(".btn-icon-sort");
  let active = false;

  Array.prototype.forEach.call(btns, function (btn) {
    btn.classList.contains("active") ? (active = true) : false;

    btn.addEventListener("click", function () {
      // 오름차순
      const handleAsc = function () {
        Array.prototype.forEach.call(btns, function (all) {
          all.classList.remove("active");
          all.classList.remove("asc");
          all.classList.remove("desc");
        });

        btn.classList.add("asc");
        btn.classList.add("active");
      };

      // 내림차순
      const handleDesc = function () {
        Array.prototype.forEach.call(btns, function (all) {
          all.classList.remove("active");
          all.classList.remove("desc");
          all.classList.remove("asc");
        });

        btn.classList.add("desc");
        btn.classList.add("active");
      };

      if ((active = true)) {
        btn.classList.contains("asc") ? handleDesc() : handleAsc();
      } else {
        active = false ? handleAsc() : handleDesc();
      }
    });
  });
}

/*****************
  말줄임 툴팁
******************/
function textOverflow() {
  const targets = document.querySelectorAll(".tbl-type2 tbody td");

  Array.prototype.forEach.call(targets, function (target) {
    if (target.offsetWidth < target.scrollWidth) {
      target.addEventListener("mouseenter", function (e) {
        const text = this.innerText;
        this.title = text;
      });
    }
  });
}

/*****************
  윈도우 팝업
******************/
function winPopup(url, name, w, h) {
  const dualScreenLeft =
    window.screenLeft != undefined ? window.screenLeft : screen.left;
  const dualScreenTop =
    window.screenTop != undefined ? window.screenTop : screen.top;
  width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width;
  height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height;
  const left = width / 2 - w / 2 + dualScreenLeft;
  const top = height / 2 - h / 2 + dualScreenTop;
  window.open(
    url,
    name,
    "scrollbars=auto, location=no, status=no, menubar=no, toolbar=no, resizable=no, width=" +
      w +
      ", height=" +
      h +
      ", top=" +
      top +
      ", left=" +
      left
  );
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

/*****************
  파일찾기
******************/
function inputFile() {
  const targets = document.querySelectorAll(".input-file");

  Array.prototype.forEach.call(targets, function (target) {
    const inp = target.querySelector(".text");
    const btnDel = target.querySelector(".btn-icon-delete-type3");

    inp.value.length > 1
      ? btnDel.classList.add("dp-block")
      : btnDel.classList.remove("dp-block");
  });
}

/*****************
  차트색상
******************/
const chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  navy: "rgb(0, 0, 128)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};
