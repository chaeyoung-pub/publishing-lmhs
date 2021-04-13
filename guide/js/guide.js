document.addEventListener('DOMContentLoaded', function () {
  $('.guide-lnb').load('../../html/layout/layout.html .guide-lnb>*', function () {
    var guideLnb = document.querySelectorAll('.guide-lnb ul li a');

    Array.prototype.forEach.call(guideLnb, function (lnb) {
      var guideTitle = document.querySelector('.guide>h1').innerHTML;

      if (lnb.innerHTML === guideTitle) {
        lnb.classList.add('active');
      }
    })
  });
})