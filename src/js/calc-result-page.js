$(function() {
  var str = window.location.search;
  var dataJson;
  var rate;
  var pv;
  var nper;
  var rate2;
  var pv2;
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
  /* 转换成货币格式  */
  function toCurrency(number, places) {
    number = !isNaN(number = parseFloat(number)) ? number : 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    var negative = number < 0 ? '-' : '';
    var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '';
    var j = (j = i.length) > 3 ? j % 3 : 0;
    return negative + (j ? i.substr(0, j) + ',' : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1,') + (places ? '.' + Math.abs(number - i).toFixed(places).slice(2) : '');
  };
  /* 等额本息公式 */
  /* 每月还款 */
  function monthlyRepayment(rate, nper, pv) {
    return pv * rate / 12 * Math.pow((1 + rate / 12), nper) / (Math.pow((1 + rate / 12), nper) - 1);
  };
  /* 还款总额  */
  function totalRepayment(monthly, nper) {
    return monthly * nper;
  };
  /* 支付利息 */
  function totalInterest(total, pv) {
    return total - pv;
  };
  /* 等额本金公式 */
  /* 首月还款 */
  function firstRepayment(rate, nper, pv) {
    return pv / nper + pv * rate / 12;
  };
  /* 每月利息递减  */
  function monthlyDecline(rate, nper, pv) {
    return pv / nper * rate / 12;
  };
  /* 还款总额  */
  function declineRepayment(interest, pv) {
    return interest + pv;
  };
  /* 支付利息 */
  function declineInterest(rate, nper, pv) {
    return pv * rate / 12 * (nper + 1) / 2;
  };
  if(str === '') {
    window.location.href = 'calc-form-page.html';
  } else {
    str = str.replace(/\?/, '{"').replace(/\=/g, '":"').replace(/\&/g, '","') + '"}';
    try {
      dataJson = JSON.parse(str);
    } catch(e) {
      infoPrompt('参数有误！');
      setTimeout(function() {
        window.location.href = 'calc-form-page.html';
      }, 2000);
    }
    switch(dataJson.loanType) {
      case '1': //商业贷款
      case '2': //公积金贷款
        switch(dataJson.repayment) {
          case '1': //等额本息
            pv = dataJson.loanTotal * 10000;
            rate = dataJson.loanRate / 100;
            nper = parseFloat(dataJson.loanYear) * 12;
            var monthly = monthlyRepayment(rate, nper, pv);
            var total = totalRepayment(monthly, nper);
            var interest = totalInterest(total, pv);
            $('#interest').show();
            $('#principal').hide();
            $('#periods').text(nper);
            $('#monthlyMoney').text(toCurrency(monthly));
            $('#totalMoney').text(toCurrency(total / 10000));
            $('#interestMoney').text(toCurrency(interest / 10000));
            break;
          case '2': //等额本金
            pv = dataJson.loanTotal * 10000;
            rate = dataJson.loanRate / 100;
            nper = parseFloat(dataJson.loanYear) * 12;
            var firstMonthly = firstRepayment(rate, nper, pv);
            var decline = monthlyDecline(rate, nper, pv);
            var interest = declineInterest(rate, nper, pv);
            var total = declineRepayment(interest, pv);
            $('#interest').hide();
            $('#principal').show();
            $('#periods').text(nper);
            $('#firstMonthlyMoney').text(toCurrency(firstMonthly));
            $('#declineMoney').text(toCurrency(decline));
            $('#totalMoney').text(toCurrency(total / 10000));
            $('#interestMoney').text(toCurrency(interest / 10000));
            break;
          default:
            infoPrompt('参数有误！');
            setTimeout(function() {
              window.location.href = 'calc-form-page.html';
            }, 2000);
            break;
        }
        break;
      case '3': //组合贷款
        switch(dataJson.repayment) {
          case '1': //等额本息
            rate = dataJson.loanRate / 100;
            rate2 = dataJson.fundRate / 100;
            nper = parseFloat(dataJson.loanYear) * 12;
            pv = dataJson.loanBusiness * 10000;
            pv2 = dataJson.loanFund * 10000;
            var monthly1 = monthlyRepayment(rate, nper, pv)
            var monthly2 = monthlyRepayment(rate2, nper, pv2);
            var total1 = totalRepayment(monthly1, nper);
            var total2 = totalRepayment(monthly2, nper);
            var interest1 = totalInterest(total1, pv);
            var interest2 = totalInterest(total2, pv2);
            $('#interest').show();
            $('#principal').hide();
            $('#periods').text(nper);
            $('#monthlyMoney').text(toCurrency(monthly1 + monthly2));
            $('#totalMoney').text(toCurrency((total1 + total2) / 10000));
            $('#interestMoney').text(toCurrency((interest1 + interest2) / 10000));
            break;
          case '2'://等额本金
            rate = dataJson.loanRate / 100;
            rate2 = dataJson.fundRate / 100;
            nper = parseFloat(dataJson.loanYear) * 12;
            pv = dataJson.loanBusiness * 10000;
            pv2 = dataJson.loanFund * 10000;
            var firstMonthly1 = firstRepayment(rate, nper, pv);
            var firstMonthly2 = firstRepayment(rate2, nper, pv2);
            var decline1 = monthlyDecline(rate, nper, pv);
            var decline2 = monthlyDecline(rate2, nper, pv2);
            var interest1 = declineInterest(rate, nper, pv);
            var interest2 = declineInterest(rate2, nper, pv2);
            var total1 = declineRepayment(interest1, pv);
            var total2 = declineRepayment(interest2, pv2);
            $('#interest').hide();
            $('#principal').show();
            $('#periods').text(nper);
            $('#firstMonthlyMoney').text(toCurrency(firstMonthly1 + firstMonthly2));
            $('#declineMoney').text(toCurrency(decline1 + decline2));
            $('#totalMoney').text(toCurrency((total1 + total2) / 10000));
            $('#interestMoney').text(toCurrency((interest1 + interest2) / 10000));
            break;
          default:
            infoPrompt('参数有误！');
            setTimeout(function() {
              window.location.href = 'calc-form-page.html';
            }, 2000);
            break;
        }
        break;
      default:
        infoPrompt('参数有误！');
        setTimeout(function() {
          window.location.href = 'calc-form-page.html';
        }, 2000);
        break;
    }
    $('#submit').on('click', function() {
      window.location.href = 'calc-details-page.html?type=' + dataJson.loanType + '&ment=' + dataJson.repayment + '&rate=' + rate + '&nper=' + nper + '&pv=' + pv + '&rate2=' + rate2 + '&pv2=' + pv2;
    });
  }
});