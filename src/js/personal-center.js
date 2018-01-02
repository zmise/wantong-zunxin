$(function () {
  // 设置Google两个变量
  var isGoogle = setGoogleItems();

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
    if (res.code !== 'ok') {
      return;
    }

    var data = res.data;

    // 计算
    var inviteIncomeAmount = data.inviteIncomeAmount;
    var ordrIncomeAmount = data.ordrIncomeAmount;
    if (inviteIncomeAmount > 0) {
      data.inviteIncomeAmount = num2str(inviteIncomeAmount);
    }
    if (ordrIncomeAmount > 0) {
      data.ordrIncomeAmount = num2str(ordrIncomeAmount);
    }

    var sum = inviteIncomeAmount + ordrIncomeAmount;
    if (sum > 0) {
      $('#amount').text(num2str(sum));
    } else {
      $('#amount').parent().next().text('还没有收益哦，加油吧');
    }
    for (var key in data) {
      var element = data[key];
      var $el = $('[data-id="' + key + '"]');
      if ($el[0]) {
        $el.text(element);
      }
    }

    if (data.cellphone) {
      $('#cellphone').text(data.cellphone).removeClass('item-place');
    } else {
      $('#invitedCount').data('url', './personal-cell.html?turnTo=' + $('#invitedCount').data('url'));
    }

    if (data.bankCardNo) {
      $('#bankCardNo').closest('li').data('url', 'personal-bank.html?bankCardNo=true');
      $('#bankCardNo').text('已绑定').removeClass('item-place');
    }

    !isGoogle && data2dataLayer(data);
  });

  // 数字截取小数点后两位
  function num2str(number) {
    var str = number + '';
    var index = str.indexOf('.');
    if (index > -1) {
      str = str.substring(0, index + 3);
    }

    return str;
  }

  $(document).on('click.link', '.item-link', function () {
    location.assign($(this).data('url'));
  });
});
