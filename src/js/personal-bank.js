$(function () {
  var info = $.unparam(location.search.substring(1));
  console.log(info);
  if (info.name) {
    $('#name').val(info.name);
  }

  // 银行卡是否已绑定
  $.ajax({
    url: '/qfang-credit/userCenter/userInfo.json',
    type: 'GET',
    dataType: 'json'
  }).done(function (res) {
    // console.log(res);
    if (info.bankCardNo && res.data.bankCardNo) {
      $('#name').val(res.data.bankCardName).prop('disabled', true);
      $('#bankCardNo').val(bankCard(res.data.bankCardNo)).prop('disabled', true);
      $('#bankName').val(res.data.bankName || ' ').prop('disabled', true);
      $('#bind').text('修改银行卡').attr('change', '1');
      $('#stick').hide();
    } else if (res.data.bankCardNo) {
      $('#bind').text('保存修改');
    }
  });
  
  function bankCard(carno) {
    return carno.substr(0, 4) + carno.replace(/\d+(?=\d{4})/, '********');
  }

  dataLayer.push(JSON.parse(sessionStorage.getItem('userInfo.dataLayer')));


  $(document).on('click', '#bind', function () {
    var $bind = $(this);
    if ($bind.hasClass('button-disabled')) {
      return false;
    }

    if ($bind.attr('change')) {
      $('input').prop('disabled', false);
      $('#bankCardNo,#bankName').val('');
      $bind.removeAttr('change');
      $('#bind').text('保存修改');
      return false;
    }
    var data = {};
    var flag = true;

    // 
    $('input:visible').each(function () {
      var $this = $(this);
      var val = $.trim($this.val());
      if (!val && $this.hasClass('require')) {
        $.toast('请输入' + $this.attr('placeholder'));
        flag = false;
        return false;
      }

      if (val) {
        data[this.name] = val;
      }
    });

    if (!flag) {
      return false;
    }

    $bind.addClass('button-disabled');
    $.showPreloader('请稍后...');
    // console.log(11);
    $.ajax({
      url: '/qfang-credit/userCenter/bindBankCard.json',
      type: 'GET',
      // type: 'POST',
      data: data
    }).done(function (res) {
      console.log(res);
      $.hidePreloader();
      // $bind.removeClass('button-disabled');
      if (res.code !== 'ok') {
        $.alert('网络出错了，请重试！');
        return false;
      }

      $.toast('银行卡绑定成功');
      setTimeout(function () {
        location.assign(info.from ? info.from : 'personal-center.html');
      }, 2000);

    });

  }).on('click', '#stick', function () {
    location.assign(info.from ? info.from : 'personal-center.html');
  });

});