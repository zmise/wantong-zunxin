$(function () {

  // 手机是否已绑定
  $.ajax({
    url: '/qfang-credit/userCenter/userInfo.json',
    type: 'GET',
    dataType: 'json'
  }).done(function (res) {
    // console.log(res);
    if (!res.data.cellphone) {
      $('#invitation').attr('href', './personal-cell.html?turnTo=' + $('#invitation').attr('href'));
    }
  });



  $('.slide-box').height($(window).height() - 8.3 * parseInt($('html').css('font-size'), 10));

  TouchSlide({
    slideCell: '#imgBox',
    titCell: '#slideIndex',
    mainCell: '.slide-content',
    effect: 'leftLoop',
    autoPage: true
  });

  // var list = $('.slide-item');
  // var width = $('.slide-box').width();
  // var conBox = list.parent()[0];
  // var len = list.length;
  // var conWidth = width * (len + 2);
  // list.width(width);
  // //前面增加 后面增加 
  // list.parent().prepend(list.last().clone()).append(list.first().clone());
  // list.parent().width(conWidth);
  // $(conBox).css({
  //   '-webkit-transform': 'translate3d(' + -width + 'px,0,0)',
  //   transform: 'translate3d(' + -width + 'px,0,0)'
  // });

  // function setIndex(index) {
  //   $('#slideIndex li').eq(index).addClass('slide-current').siblings().removeClass('slide-current');
  // }
  // function turnTo(index) {
  //   var tansformX = -1 * index * width;
  //   // console.log(index);
  //   $(conBox).css({
  //     '-webkit-transform': 'translate3d(' + tansformX + 'px,0,0)',
  //     transform: 'translate3d(' + tansformX + 'px,0,0)',
  //     transition: 'transform 500ms'
  //   });

  //   setIndex(index - 1);
  //   setTimeout(function () {
  //     $(conBox).css('transition', '');
  //   }, 500);
  // }

  // function getIndex(number) {
  //   //小数位大于0.3 就 +1
  //   var nubs = number.toFixed(1).split('.');
  //   return nubs[1] > 3 ? +nubs[0] + 1 : +nubs[0];
  // }

  // function getTranslateX(el) {
  //   //只有在用css 设置transform 的时候有效 
  //   var x = $(el).css('transform').replace(/[^0-9\-]+/g, ' ').split(' ')[2] * 1;
  //   if (isNaN(x)) {
  //     x = 0;
  //   }
  //   return x;
  // }

  // var distX, startX, startY, starT;
  // //触摸开始函数
  // var tStart = function (e) {
  //   distX = 0;
  //   var point = e.touches[0];
  //   startX = point.pageX;
  //   startY = point.pageY;
  //   starT = getTranslateX(conBox);

  //   //添加“触摸移动”事件监听
  //   conBox.addEventListener('touchmove', tMove, false);
  //   //添加“触摸结束”事件监听
  //   conBox.addEventListener('touchend', tEnd, false);
  // }

  // //触摸移动函数
  // var tMove = function (e) {
  //   var point = e.touches[0];
  //   distX = point.pageX - startX;
  //   distY = point.pageY - startY;
  //   var transformX = starT + distX;
  //   $(conBox).css({
  //     '-webkit-transform': 'translate3d(' + transformX + 'px,0,0)',
  //     transform: 'translate3d(' + transformX + 'px,0,0)'
  //   });
  // }

  // //触摸结束函数
  // var tEnd = function (e) {
  //   if (distX == 0) return;
  //   e.preventDefault();
  //   var transformX = getTranslateX(conBox);
  //   var index = getIndex(transformX / -width);

  //   if (distX > 0) {
  //     if (distX > 0.3 * width && distX < 0.65 * width) {
  //       index--;
  //       // } else if (distX > 0.5 * width) {
  //       //   index -= 2;
  //     }

  //   }

  //   if (index > len) {
  //     index = 1;
  //     transformX = conWidth + transformX - width * 2;
  //     // console.log(transformX, 'e');
  //     $(conBox).css({
  //       '-webkit-transform': 'translate3d(' + transformX + 'px,0,0)',
  //       transform: 'translate3d(' + transformX + 'px,0,0)'
  //     });
  //   } else if (index < 1) {
  //     index = len;
  //     $(conBox).css({
  //       '-webkit-transform': 'translate3d(' + -(width * len - transformX) + 'px,0,0)',
  //       transform: 'translate3d(' + -(width * len - transformX) + 'px,0,0)'
  //     });
  //   }

  //   setTimeout(function () {
  //     turnTo(index);
  //   }, 20);


  //   conBox.removeEventListener('touchmove', tMove, false);
  //   conBox.removeEventListener('touchend', tEnd, false);
  // }


  // //添加“触摸开始”事件监听
  // conBox.addEventListener('touchstart', tStart, false);


  // $('#slideIndex').on('click', 'li', function () {
  //   var $this = $(this);
  //   if ($this.hasClass('slide-current')) {
  //     return;
  //   }

  //   turnTo($this.index() + 1);
  // });

});