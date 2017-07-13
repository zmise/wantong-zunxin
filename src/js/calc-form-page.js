$(function() {
  var b = false;
  var startPot = {
    x: 0,
    y: 0
  };
  var endPot = {
    x: 0,
    y: 0
  };
  var num = 0;
  var wid = $('#rang').width();
  /* 处理数据 */
  function dealNumber(number) {
    if(number - Math.floor(number) === 0) {
      return Math.floor(number);
    } else if(number - Math.floor(number) > 0.5) {
      return Math.floor(number) + 1;
    } else {
      return Math.floor(number) + 0.5;
    }
  };
  /* 提示信息 */
  function infoPrompt(info) {
    if($('.popup-body').length) {
      $('.popup-body').find('.info-prompt').text(info);
      $('.popup-body').removeAttr('style');
    } else {
      $('body').append('<div class="popup-body box-align"><p class="info-prompt">' + info + '</p></div>');
    }
    setTimeout(function() {
      $('.popup-body').hide();
    }, 2000);
  };
  /* 基准利率 */
  function rateMark(year) {
    if(year <= 1) {
      $('#businessMark').text('4.35%');
      $('#fundMark').text('2.75%');
    } else if(year <= 5) {
      $('#businessMark').text('4.75%');
      $('#fundMark').text('2.75%');
    } else {
      $('#businessMark').text('4.9%');
      $('#fundMark').text('3.25%');
    }
  };
  /* 转换成货币格式  */
  function toCurrency(number, places) {
    number = !isNaN(number = parseFloat(number)) ? number : 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    var negative = number < 0 ? '-' : '';
    var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '';
    var j = (j = i.length) > 3 ? j % 3 : 0;
    return negative + (j ? i.substr(0, j) + ',' : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1,') + (places ? '.' + Math.abs(number - i).toFixed(places).slice(2) : '');
  };
  /* 去掉%号  */
  function textToFloat(txt) {
    return parseFloat(txt.substr(0, txt.length - 1));
  };
  /* 初始化 */
  function init() {
    $('#totalLoan').val('');
    $('#businessLoan').val('');
    $('#fundLoan').val('');
    $('#year').val(0.5);
    $('#loanRate').val(4.35);
    $('#multiple').val(1);
  };
  init();
  /* 滑块事件 */
  $('#rang').on('touchstart', '.slider', function(e) {
    $.extend(startPot, {
      x: e.originalEvent.touches[0].pageX,
      y: e.originalEvent.touches[0].pageY
    });
  });
  $('#rang').on('touchmove', '.slider', function(e) {
    e.preventDefault();
    $.extend(endPot, {
      x: e.originalEvent.touches[0].pageX,
      y: e.originalEvent.touches[0].pageY
    });
    b = true;
    num = parseFloat($(this).attr('data-number')) + endPot.x - startPot.x;
    if(num < 0) {
      num = 0;
    } else if(num > wid) {
      num = wid;
    }
    $(this).css({
      left: num - 10
    });
    $(this).siblings('.progress').css({
      width: num
    });
    var year = dealNumber(num * 29.5 / wid + 0.5);
    $('#year').val(year);
  });
  $('#rang').on('touchend', '.slider', function(e) {
    if(b) {
      b = false;
      $(this).attr('data-number', num);
      $('#year').trigger('change');
    }
  });
  /* 贷款年限 */
  $('#year').on('blur', yearBlur = function() {
    var reg = /^\d+(\.5)?$/;
    if($('#year').val() > 30 || $('#year').val() < 0.5) {
      infoPrompt('贷款期限不能少于0.5年，且不能大于30年！');
      return false;
    } else if(!reg.test($('#year').val())) {
      infoPrompt('贷款期限格式不正确，半年为最小单元！');
      return false;
    } else {
      return true;
    }
  });
  $('#year').on('change', function(e) {
    if(yearBlur()) {
      rateMark($(this).val());
      $('#rang').find('.slider').css({
        left: $(this).val() * wid / 30 - 10
      });
      $('#rang').find('.progress').css({
        width: $(this).val() * wid / 30
      });
      $('#rang').find('.slider').attr('data-number', $(this).val() * wid / 30);
      if($('#fund').hasClass('current')) {
        $('#loanRate').val(textToFloat($('#fundMark').text()));
      } else {
        $('#loanRate').val(textToFloat($('#businessMark').text()));
      }
      $('#loanRate,#multiple').trigger('change');
    }
  });
  /* 单选 */
  $('.radio').on('click', function() {
    $(this).siblings('.radio').removeClass('current')
    $(this).addClass('current');
  });
  /* 商业贷款 */
  $('#business').on('click', function() {
    $('#total').show();
    $('#combobox').hide();
    $('#loanRate,#multiple').prop('readonly', false);
    $('#loanRate').val(textToFloat($('#businessMark').text()));
    $('#loanRate,#multiple').trigger('change');
  });
  /* 公积金贷款 */
  $('#fund').on('click', function() {
    $('#total').show();
    $('#combobox').hide();
    $('#loanRate,#multiple').prop('readonly', true);
    $('#loanRate').val(textToFloat($('#fundMark').text()));
    $('#multiple').val(1);
    $('#loanRate,#multiple').trigger('change');
  });
  /* 组合贷款 */
  $('#combo').on('click', function() {
    $('#total').hide();
    $('#combobox').show();
    $('#loanRate,#multiple').prop('readonly', false);
    $('#loanRate').val(textToFloat($('#businessMark').text()));
    $('#loanRate,#multiple').trigger('change');
  });
  /* 贷款总额 */
  $('#totalLoan').on('blur', totalBlur = function() {
    if($('#fund').hasClass('current')) {
      var reg = /^\d{1,2}(\.\d{1,2})?$/;
      if($.trim($('#totalLoan').val()) === '') {
        infoPrompt('贷款总额不能为空！');
        return false;
      } else if(!reg.test($('#totalLoan').val()) || parseFloat($('#totalLoan').val()) > 60) {
        infoPrompt('贷款总额在0-60万之间的数且小数不能超过两位！');
        return false;
      } else {
        return true;
      }
    } else {
      var reg = /^\d{1,6}(\.\d{1,2})?$/;
      if($.trim($('#totalLoan').val()) === '') {
        infoPrompt('贷款总额不能为空！');
        return false;
      } else if(!reg.test($('#totalLoan').val())) {
        infoPrompt('贷款总额在0-999,999.99万之间的数且小数不能超过两位！');
        return false;
      } else {
        return true;
      }
    }
  });
  /* 商业贷款 */
  $('#businessLoan').on('blur', businessBlur = function() {
    var reg = /^[1-9]\d{1,5}(\.\d{1,2})?$/;
    if($.trim($('#businessLoan').val()) === '') {
      infoPrompt('商业贷款不能为空！');
      return false;
    } else if(!reg.test($('#businessLoan').val())) {
      infoPrompt('商业贷款在0-999,999.99万之间的数且小数不能超过两位！');
      return false;
    } else {
      return true;
    }
  });
  /* 公积金贷款 */
  $('#fundLoan').on('blur', fundBlur = function() {
    var reg = /^[1-9]\d{1,5}(\.\d{1,2})?$/;
    var reg1 = /^[1-9]\d{1,2}(\.\d{1,2})?$/;
    if($.trim($('#fundLoan').val()) === '') {
      infoPrompt('公积金贷款不能为空！');
      return false;
    } else if(!reg1.test($('#fundLoan').val()) || parseFloat($('#fundLoan').val()) > 60) {
      infoPrompt('公积金贷款在0-60万之间的数且小数不能超过两位！');
      return false;
    } else {
      return true;
    }
  });
  /* 利率  */
  $('#loanRate,#multiple').on('blur', rateBlur = function() {
    var reg = /^\d{1,2}(\.\d{1,2})?$/;
    if($('#loanRate').val() === '' || $('#multiple').val() === '') {
      infoPrompt('请填写利率和倍数！');
      return false;
    } else if(!reg.test($('#loanRate').val())) {
      infoPrompt('利率只能是0%-100%之间且小数不能超过两位！');
      return false;
    } else if(!reg.test($('#multiple').val())) {
      infoPrompt('倍数只能数字之间且小数不能超过两位！');
      return false;
    } else if(parseFloat($('#multiple').val()) > 2 || parseFloat($('#multiple').val()) < 0) {
      infoPrompt('倍数只能是0-2之间！');
      return false;
    } else {
      return true;
    }
  });
  $('#loanRate,#multiple').on('change', function() {
    var txt = parseFloat($('#loanRate').val()) * parseFloat($('#multiple').val());
    if(!isNaN(txt)) {
      $('#totalRate').text(toCurrency(txt) + '%');
    } else {
      $('#totalRate').text('%');
    }
  });
  /* 提交 */
  $('#submit').on('click', function() {
    var loanType = 1;
    var repayment = 1;
    var loanTotal = 0;
    var loanBusiness = 0;
    var loanFund = 0;
    var loanYear = 0.5;
    var loanRate = 4.35;
    var fundRate = 2.75;
    if($('#business').hasClass('current')) {
      loanType = 1;
      if(totalBlur()) {
        loanTotal = $('#totalLoan').val();
      } else {
        return false;
      }
    }
    if($('#fund').hasClass('current')) {
      loanType = 2;
      if(totalBlur()) {
        loanTotal = $('#totalLoan').val();
      } else {
        return false;
      }
    }
    if($('#combo').hasClass('current')) {
      loanType = 3;
      if(businessBlur()) {
        loanBusiness = $('#businessLoan').val();
      } else {
        return false;
      }
      if(fundBlur()) {
        loanFund = $('#fundLoan').val();
      } else {
        return false;
      }
    }
    if($('#equalRate').hasClass('current')) {
      repayment = 1;
    }
    if($('#equalMoney').hasClass('current')) {
      repayment = 2;
    }
    if(yearBlur()) {
      loanYear = $('#year').val();
    } else {
      return false;
    }
    if(rateBlur()) {
      loanRate = textToFloat($('#totalRate').text());
      fundRate = textToFloat($('#fundMark').text());
    } else {
      return false;
    }
    window.location.href = 'calc-result-page.html?loanType=' + loanType + '&repayment=' + repayment + '&loanTotal=' + loanTotal + '&loanBusiness=' + loanBusiness + '&loanFund=' + loanFund + '&loanYear=' + loanYear + '&loanRate=' + loanRate + '&fundRate=' + fundRate;
  });
});