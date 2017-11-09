$(function () {
  var yearBlur, businessBlur, fundBlur, businessRateBlur, fundRateBlur;

  /* 提示信息 */
  function infoPrompt(info) {
    if ($('.popup-body').length) {
      $('.popup-body').find('.info-prompt').text(info);
      $('.popup-body').removeAttr('style');
    } else {
      $('body').append('<div class="popup-body box-align"><p class="info-prompt">' + info + '</p></div>');
    }
    setTimeout(function () {
      $('.popup-body').hide();
    }, 2000);
  };

  // 商贷 时长 & 折扣 ==> 利率 
  function forBRate(year) {
    var number = '4.35';
    var discount = $('#brate').val();
    if (year > 1 && year <= 5) {
      number = '4.75';
    } else if (year > 5) {
      number = '4.90';
    }
    if (discount < 0) {
      return;
    }
    number = (number * discount).toFixed(2);
    $('#businessRate').val(number);
  }

  // 公积金  时长 & 折扣 ==> 利率 
  function forFRate(year) {
    var number = '2.75';
    var discount = $('#frate').val();
    if (year > 5) {
      number = '3.25';
    }
    number = (number * discount).toFixed(2);
    $('#fundRate').val(number);
  }

  function forRate(year) {
    forBRate(year);
    forFRate(year);
  }

  function getYear() {
    var year = $('#ayear').val();
    return +(year > 0 ? year : $('#year').val());
  }

  /* 初始化 */
  function init() {
    // 隐藏贷款期限输入框及单位
    $('#year').hide().next().hide();
    // 隐藏公积金贷款
    $('.js-fund').hide();
  };

  init();

  // 贷款年限
  $('#ayear').on('change', function () {
    var $obj = $(this).next();
    var value = this.value;
    // 其他年限
    if (!value) {
      $obj.css('display', '').next().css('display', '');
    } else {
      $obj.hide().next().hide();
      forRate(value);
    }
  });

  /* 贷款年限 */
  $('#year').on('blur', yearBlur = function () {
    var $year = $('#year');
    var year = $year.val();
    var reg = /^\d+(\.5)?$/;
    if (year > 30 || year < 0.5) {
      infoPrompt('贷款期限不能少于0.5年，且不能大于30年！');
      return false;
    } else if (!reg.test(year)) {
      infoPrompt('贷款期限格式不正确，半年为最小单元！');
    } else {
      forRate(+year);
      return true;
    }

    // var reg = /^\d+(\.\d)?$/;
    // if (!reg.test(year)) {
    //   infoPrompt('贷款期限只能是数字!');
    //   return false;
    // } else if (year > 30 || year < 0.5) {
    //   infoPrompt('贷款期限不能少于0.5年，且不能大于30年！');
    //   return false;
    // } else {

    //   // 若有多个小数位，失去焦点时只取第1位，第2位以后的小数直接去掉
    //   // console.log(year, year.length - year.indexOf('.'));
    //   var index = year.indexOf('.');
    //   if (index > -1 && year.length - index > 2) {
    //     year = year.substring(0, index + 2);
    //     // console.log(year);
    //     $year.val(year);
    //   }
    //   forRate(+year);
    //   return true;
    // }
  });

  // 利率
  $('#brate').on('change', function () {
    forBRate(getYear());
  });
  $('#businessRate').on('blur', businessRateBlur = function () {
    var reg = /^\d{1,2}(\.\d{1,2})?$/;
    var value = $('#businessRate').val();
    // console.log(value, reg.test(value));

    if (value <= 0 || !reg.test(value)) {
      infoPrompt('商贷利率在大于0%且小于99.99%范围且小数不能超过两位！');
      return false;
    } else {
      return true;
    }

  });
  $('#frate').on('change', function () {
    forFRate(getYear());
  });
  // 利率
  $('#fundRate').on('blur', fundRateBlur = function () {
    var reg = /^\d{1,2}(\.\d{1,2})?$/;
    var value = $('#fundRate').val();
    // console.log(value, reg.test(value));

    if (value <= 0 || !reg.test(value)) {
      infoPrompt('公积金利率在大于0%且小于99.99%范围且小数不能超过两位！');
      return false;
    } else {
      return true;
    }

  });



  /* 单选 */
  $('.radio').on('click', function () {
    $(this).siblings('.radio').removeClass('current')
    $(this).addClass('current');
  });
  /* 商业贷款 */
  $('#business').on('click', function () {
    $('.js-business').css('display', '');
    $('.js-fund').hide();
  });
  /* 公积金贷款 */
  $('#fund').on('click', function () {
    $('.js-business').hide();
    $('.js-fund').css('display', '');
  });
  /* 组合贷款 */
  $('#combo').on('click', function () {
    $('.js-business').css('display', '');
    $('.js-fund').css('display', '');
  });

  /* 商业贷款 */
  $('#businessLoan').on('blur', businessBlur = function () {
    var reg = /^[1-9]\d{0,2}(\.\d{1,2})?$/;
    if ($.trim($('#businessLoan').val()) === '') {
      infoPrompt('商业贷款不能为空！');
      return false;
    } else if (!reg.test($('#businessLoan').val())) {
      infoPrompt('商业贷款在0-999,999.99万之间的数且小数不能超过两位！');
      return false;
    } else {
      return true;
    }
  });
  /* 公积金贷款 */
  $('#fundLoan').on('blur', fundBlur = function () {
    // var reg = /^[1-9]\d{1,5}(\.\d{1,2})?$/;
    var reg1 = /^[1-9]\d{0,2}(\.\d{1,2})?$/;
    if ($.trim($('#fundLoan').val()) === '') {
      infoPrompt('公积金贷款不能为空！');
      return false;
    } else if (!reg1.test($('#fundLoan').val()) || parseFloat($('#fundLoan').val()) > 90) {
      infoPrompt('公积金贷款在0-90万之间的数且小数不能超过两位！');
      return false;
    } else {
      return true;
    }
  });

  /* 提交 */
  $('#submit').on('click', function () {
    var loanType = 1;
    var repayment = 1;
    var loanTotal = 0;
    var loanBusiness = 0;
    var loanFund = 0;
    var loanYear = 0.5;
    var loanRate = 4.90;
    var fundRate = 3.25;

    // 商业贷款
    if ($('#business').hasClass('current')) {
      loanType = 1;
      if (businessBlur()) {
        loanTotal = $('#businessLoan').val();
      } else {
        return false;
      }
    }

    // 公积金
    if ($('#fund').hasClass('current')) {
      loanType = 2;
      if (fundBlur()) {
        loanTotal = $('#fundLoan').val();
      } else {
        return false;
      }
    }

    // 组合
    if ($('#combo').hasClass('current')) {
      loanType = 3;
      if (businessBlur()) {
        loanBusiness = $('#businessLoan').val();
      } else {
        return false;
      }
      if (fundBlur()) {
        loanFund = $('#fundLoan').val();
      } else {
        return false;
      }
    }

    // 还款方式
    if ($('#equalRate').hasClass('current')) {
      repayment = 1;
    }
    if ($('#equalMoney').hasClass('current')) {
      repayment = 2;
    }

    // 贷款期限
    if ($('#year').is(':hidden')) {
      loanYear = getYear();
    } else if (yearBlur()) {
      loanYear = getYear();
    } else {
      return false;
    }

    // 贷款利率
    if ($('#businessRate').is(':visible')) {
      if (businessRateBlur()) {
        loanRate = $('#businessRate').val();
      } else {
        return false;
      }
    }

    if ($('#fundRate').is(':visible')) {
      if (fundRateBlur()) {
        fundRate = $('#fundRate').val();
      } else {
        return false;
      }
    }

    window.location.href = 'calc-result-page.html?loanType=' + loanType + '&repayment=' + repayment + '&loanTotal=' + loanTotal + '&loanBusiness=' + loanBusiness + '&loanFund=' + loanFund + '&loanYear=' + loanYear + '&loanRate=' + loanRate + '&fundRate=' + fundRate;
  });

  // 房贷计算器改版 问号提示信息
  $(document).on('click.modal', '#businessMark,#fundMark', function () {
    var $item = $(this);
    var id = $item.data('tipsfor');
    var text = '';

    if (!id) {
      text = $item.data('tips');
    } else {
      text = $('#' + id)[0].innerHTML;
    }
    $.modal({
      extraClass: 'icon-tips',
      title: $item.text(),
      text: text,
      buttons: [
        {
          text: '关闭',
          close: true
        },
      ]
    })
  });
});