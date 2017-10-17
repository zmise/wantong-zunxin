$(function () {

  dataLayer.push(JSON.parse(sessionStorage.getItem('userInfo.dataLayer')));
  var info = $.unparam(location.search.substring(1));
  console.log(info);

  function fetchData() {
    $.ajax({
      url: '/qfang-credit/wx/order/detail.json',
      type: 'GET',
      dataType: 'json',
      data: {
        id: info.id
      }
    }).done(function (res) {
      console.log(res);
      if (res.code !== 'ok') {
        return;
      }
      showDetail(res.data);
    });
  }

  function showDetail(data) {
    // 提单信息
    setOrder(data.order);

    // 贷款信息
    setCommissions(data.commissions);

  }

  function errorText($items, index, text) {
    $items.eq(index).find('.iconfont').attr('class', 'iconfont icon-shanchu1');
    $items.eq(index).find('p').text(text);
  }

  function setStatus(status) {
    var index = 0;
    var str = '';
    var error = false;
    var $items = $('.lading-status .status-item');
    switch (status) {
      case 1:
        str = '已提单,待信贷经理与客户沟通';
        $('#productMatcher').hide();
        break;
      case 2:
        index = 1;
        str = '信贷经理正在与客户沟通';
        break;
      case 3:
        index = 1;
        error = true;
        errorText($items, index, '客户拒绝');
        str = '客户已拒绝办理';
        $('#reason').show();
        break;
      case 4:
        index = 2;
        str = '正在办理贷款';
        break;
      case 5:
        index = 3;
        str = '办理成功，已获得收益';
        break;
      case 6:
        index = 3;
        error = true;
        errorText($items, index, '办理失败');
        str = '办理失败';
        $('#reason').show();
        break;
    }

    $items.filter(function (i) {
      return i <= index;
    }).addClass('active');

    if (error) {
      $items.eq(index).attr('class', 'status-item reject');
    }

    $('#status').text(str);
  }

  function setOrder(data) {
    var $container = $('.content .list-block');

    // 状态
    setStatus(data.status);
    renderData($container, data);

  }

  function bankCard(carno) {
    return carno.substr(0, 4) + carno.replace(/\d+(?=\d{4})/, '********');
  }

  function setCommissions(data) {
    var i = 0; len = data.length;
    var doc = document.createDocumentFragment();
    var sum = 0;
    for (; i < len; i++) {
      var item = data[i];
      var $temp = $('#tempLate .list-block').clone();
      renderData($temp, item);
      sum += item.amount;
      doc.appendChild($temp[0]);
    }

    if (len > 0) {
      $('#incomSum').text(sum);
      $('.lading-income').show();
    }
    $('#listBlock').append(doc);
  }

  function renderData($container, data) {
    for (var key in data) {
      var item = data[key];
      var $el = $container.find('[data-id="' + key + '"]');
      if (item && $el[0]) {
        if (key === 'finalLoanAmount') {
          item = Math.floor(item / 10000) + '万';
        } else if (key === 'lenderAmount') {
          item += '元';
        } else if (key === 'lenderCellphone') {
          item = item.replace(/(?!^)(\d{4})(?=(?:\d{4})*$)/g, '-$1');
        } else if (key === 'productMatcherPhone') {
          $el.attr('href', 'tel:' + item);
        } else if (key === 'bankCardNo') {
          item = bankCard(data.bankCardNo);
        }
        $el.text(item);
      }
    }
  }
  fetchData();
});