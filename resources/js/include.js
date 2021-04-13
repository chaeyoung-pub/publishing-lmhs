// system admin css
document.write('<link rel="stylesheet" href="../../../resources/css/common.css" />');
// hr admin css
// document.write('<link rel="stylesheet" href="../../../resources/css/common_hr.css" />');

// js
document.write('<script src="../../../resources/js/library/jquery-3.4.1.min.js"></script>');
document.write('<script src="../../../resources/js/library/jquery-ui.min.js"></script>');
document.write('<script src="../../../resources/js/library/Chart.min.js"></script>');
document.write('<script src="../../../resources/js/common.js"></script>');

// 퍼블화면 확인용 레이아웃 불러오기 (temp)
document.addEventListener('DOMContentLoaded', function () {
  $('.admin-wrap:not(.admin-login) .admin-header').load('../layout/layout.html .admin-header>*', function () {

  });

  $('.admin-login .admin-header').load('../layout/layout.html .admin-header>*:not(.info)', function () {

  });

  $('.admin-lnb').load('../layout/layout.html .admin-lnb>*', function () {
    admin_lnb();
  });

  $('.admin-content .area-path').load('../layout/layout.html .admin-content > .area-path > *', function () {

  });

  $('.admin-footer').load('../layout/layout.html .admin-footer>*', function () {

  });
})