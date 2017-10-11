$(function () {

  // 获取个人信息
  $.showPreloader('请稍候...');
  $.ajax({
    url: '/qfang-credit/userCenter/userInfo.json',
    data: {
      needStatisticData: true
    },
    dataType: 'json',
    type: 'GET'
  }).done(function (res) {
    $.hidePreloader();
    console.log(res);
    if (res.code != 'ok') {
      return;
    }

    var data = res.data;
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var element = data[key];
        var $el = $('[data-id="' + key + '"]');
        if ($el[0]) {
          $el.text(element);
        }
        if (key === 'bankCardNo' && element) {
          $('#bankCardNo').closest('li').attr('data-url', 'personal-bank.html?bankCardNo=true');
        }
      }
    }

    var sum = data.inviteIncomeAmount + data.ordrIncomeAmount;
    if (sum > 0) {
      $('#amount').text(sum);
    } else {
      $('#amount').parent().next().text('还没有收益哦，加油吧');
    }

    if (data.cellphone) {
      $('#cellphone').text(data.cellphone).removeClass('item-place');
    }
    if (data.bankCardNo) {
      $('#bankCardNo').text('已绑定').removeClass('item-place');
    }

    var layerdata = {
      'dimension1': data.id,
      'dimension2': data.nickName
    };
    dataLayer.push(layerdata);

    sessionStorage.setItem('userInfo.dataLayer', JSON.stringify(layerdata));
  });



  $(document).on('click.link', '.item-link', function () {
    location.assign($(this).data('url'));
  });
});