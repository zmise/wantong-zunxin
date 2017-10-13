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

  function setStatus(status) {
    var index = 0;
    var str = '';
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
        $items.eq(1).find('p').text('客户拒接');
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
        $items.eq(3).find('p').text('办理失败');
        str = '办理失败';
        $('#reason').show();
        break;
    }

    $items.filter(function (i) {
      return i <= index;
    }).addClass('active');
    $('#status').text(str);
  }

  function setOrder(data) {
    var $container = $('.content .list-block');

    // 状态
    setStatus(data.status);
    renderData($container, data);

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
        item += (key === 'lenderAmount' ? '元' : '');
        $el.text(item);
      }
    }
  }
  fetchData();
});