$(function() {
  var str = window.location.search;
  var dataJson;
  var oldPv;
  var oldPv2;
  var pageNo = 1;
  var pageSize = 20;
  var tableHead = '';
  var tableBody = '';
  var timeoutObject = null;
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
  /* 设置表头 */
  function setTableHead() {
    var _html = '<table><tr><th style="width:12%;" class="tac">期次</th><th style="width:20%;">偿还本息</th><th style="width:20%;">偿还本金</th><th style="width:20%;">支付利息</th><th style="width:20%;">剩余本金</th></tr></table>';
    return _html;
  };
  /* 设置组合表头 */
  function setComboTableHead() {
    var _html = '<table><tr><th style="width:13%;" class="tac">期次</th><th style="width:29%;">还款金额</th><th style="width:29%;">商业贷款</th><th style="width:29%;">公积金贷款</th></tr></table>';
    return _html;
  }
  /* 设置表体 */
  function setTableBody(data) {
    var _html = '<table>';
    $.each(data, function(i, v) {
      _html += '<tr><td style="width:12%;" class="tac">' + v.no + '</td><td style="width:20%;">' + v.money + '</td><td style="width:20%;">' + v.loan + '</td><td style="width:20%;">' + v.interest + '</td><td style="width:20%;">' + v.surplus + '</td></tr>';
    });
    _html += '</table>';
    return _html;
  }
  /* 设置组合表体 */
  function setComboTableBody(data) {
    var _html = '<table>';
    $.each(data, function(i, v) {
      _html += '<tr><td style="width:13%;" class="tac">' + v.no + '</td><td style="width:29%;">' + v.money + '</td><td style="width:29%;">' + v.business + '</td><td style="width:29%;">' + v.fund + '</td></tr>';
    });
    _html += '</table>';
    return _html;
  }
  /* 等额本息每期所还金额*/
  function PMT(rate, nper, pv) {
    return pv * rate / 12 * Math.pow((1 + rate / 12), nper) / (Math.pow((1 + rate / 12), nper) - 1);
  };
  /* 等额本息每期所还本金  */
  function PPMT(rate, per, nper, pv) {
    return pv * rate / 12 * Math.pow((1 + (rate / 12)), per - 1) / (Math.pow((1 + (rate / 12)), nper) - 1);
  };
  /* 等额本息每期所还利息  */
  function IPMT(rate, per, nper, pv) {
    return pv * rate / 12 * Math.pow((1 + rate / 12), nper) / (Math.pow((1 + rate / 12), nper) - 1) - pv * rate / 12 * Math.pow((1 + (rate / 12)), per - 1) / (Math.pow((1 + (rate / 12)), nper) - 1);
  };
  /* 等额本金每期所还金额 */
  function EPMT(rate, nper, pv, surplus) {
    return pv / nper + surplus * rate / 12;
  };
  /* 等额本金每期所还本金 */
  function EPPMT(nper, pv) {
    return pv / nper;
  };
  /* 等额本金每期所还利息 */
  function EIPMT(rate, surplus) {
    return surplus * rate / 12;
  };
  /* 获取等额本息表格数据 */
  function getEqualRateData(data, frist, last) {
    var tableData = [];
    for(var i = frist; i < last; i++) {
      var money = PMT(data.rate, data.nper, data.pv);
      var loan = PPMT(data.rate, i + 1, data.nper, data.pv);
      var interest = IPMT(data.rate, i + 1, data.nper, data.pv);
      var surplus = oldPv - loan;
      var obj = {
        no: i + 1,
        money: toCurrency(money),
        loan: toCurrency(loan),
        interest: toCurrency(interest),
        surplus: toCurrency(surplus)
      }
      oldPv = surplus;
      tableData.push(obj);
    }
    return tableData;
  };
  /* 获取等额本金表格数据 */
  function getEqualMoneyData(data, frist, last) {
    var tableData = [];
    for(var i = frist; i < last; i++) {
      var money = EPMT(data.rate, data.nper, data.pv, oldPv);
      var loan = EPPMT(data.nper, data.pv);
      var interest = EIPMT(data.rate, oldPv);
      var surplus = oldPv - loan;
      var obj = {
        no: i + 1,
        money: toCurrency(money),
        loan: toCurrency(loan),
        interest: toCurrency(interest),
        surplus: toCurrency(surplus)
      }
      oldPv = surplus;
      tableData.push(obj);
    }
    return tableData;
  };
  /* 获取等额本息组合表格数据 */
  function getEqualRateComboData(data, frist, last) {
    var tableData = [];
    for(var i = frist; i < last; i++) {
      var business = PMT(data.rate, data.nper, data.pv);
      var fund = PMT(data.rate2, data.nper, data.pv2);
      var money = business + fund;
      var obj = {
        no: i + 1,
        money: toCurrency(money),
        business: toCurrency(business),
        fund: toCurrency(fund)
      }
      tableData.push(obj);
    }
    return tableData;
  };
  /* 获取等额本金组合表格数据 */
  function getEqualMoneyComboData(data, frist, last) {
    var tableData = [];
    for(var i = frist; i < last; i++) {
      var business = EPMT(data.rate, data.nper, data.pv, oldPv);
      var fund = EPMT(data.rate2, data.nper, data.pv2, oldPv2);
      var money = business + fund;
      var obj = {
        no: i + 1,
        money: toCurrency(money),
        business: toCurrency(business),
        fund: toCurrency(fund)
      }
      oldPv = oldPv - EPPMT(data.nper, data.pv);
      oldPv2 = oldPv2 - EPPMT(data.nper, data.pv2);
      tableData.push(obj);
    }
    return tableData;
  };
  /* 加载数据 */
  function init() {
    switch(dataJson.type) {
      case '1':
      case '2':
        switch(dataJson.ment) {
          case '1':
            var tableData;
            if(Math.ceil(dataJson.nper / pageSize) > pageNo) {
              tableData = getEqualRateData(dataJson, (pageNo - 1) * pageSize, pageNo * pageSize);
            } else {
              tableData = getEqualRateData(dataJson, (pageNo - 1) * pageSize, dataJson.nper);
            }
            tableHead = setTableHead();
            tableBody = setTableBody(tableData);
            break;
          case '2':
            var tableData;
            if(Math.ceil(dataJson.nper / pageSize) > pageNo) {
              tableData = getEqualMoneyData(dataJson, (pageNo - 1) * pageSize, pageNo * pageSize);
            } else {
              tableData = getEqualMoneyData(dataJson, (pageNo - 1) * pageSize, dataJson.nper);
            }
            tableHead = setTableHead();
            tableBody = setTableBody(tableData);
            break;
          default:
            infoPrompt('参数有误！');
            setTimeout(function() {
              window.location.href = 'calc-result-page.html';
            }, 2000);
            break;
        }
        break;
      case '3':
        switch(dataJson.ment) {
          case '1':
            var tableData;
            if(Math.ceil(dataJson.nper / pageSize) > pageNo) {
              tableData = getEqualRateComboData(dataJson, (pageNo - 1) * pageSize, pageNo * pageSize);
            } else {
              tableData = getEqualRateComboData(dataJson, (pageNo - 1) * pageSize, dataJson.nper);
            }
            tableHead = setComboTableHead();
            tableBody = setComboTableBody(tableData);
            break;
          case '2':
            var tableData;
            if(Math.ceil(dataJson.nper / pageSize) > pageNo) {
              tableData = getEqualMoneyComboData(dataJson, (pageNo - 1) * pageSize, pageNo * pageSize);
            } else {
              tableData = getEqualMoneyComboData(dataJson, (pageNo - 1) * pageSize, dataJson.nper);
            }
            tableHead = setComboTableHead();
            tableBody = setComboTableBody(tableData);
            break;
          default:
            infoPrompt('参数有误！');
            setTimeout(function() {
              window.location.href = 'calc-result-page.html';
            }, 2000);
            break;
        }
        break;
      default:
        infoPrompt('参数有误！');
        setTimeout(function() {
          window.location.href = 'calc-result-page.html';
        }, 2000);
        break;
    }
  };
  if(str === '') {
    window.location.href = 'calc-result-page.html';
  } else {
    str = str.replace(/\?/, '{"').replace(/\=/g, '":"').replace(/\&/g, '","') + '"}';
    try {
      dataJson = JSON.parse(str);
    } catch(e) {
      infoPrompt('参数有误！');
      setTimeout(function() {
        window.location.href = 'calc-result-page.html';
      }, 2000);
    }
    oldPv = parseFloat(dataJson.pv);
    oldPv2 = parseFloat(dataJson.pv2);
    init();
    $('.table-head').empty().append(tableHead);
    $('.table-body').empty().append(tableBody);

    /* 滚动分页事件   */
    $(window).on('scroll', function() {
      if(timeoutObject) {
        clearTimeout(timeoutObject);
      }
      timeoutObject = setTimeout(function() {
        var heg = $('body').height() - $(window).height() - 50;
        if($(window).scrollTop() > heg && heg > 50) {
          if(Math.ceil(dataJson.nper / pageSize) > pageNo) {
            pageNo++;
            init();
            $('.table-body').append(tableBody);
          } else {
            return false;
          }
        };
      }, 30);
    });
  }
});