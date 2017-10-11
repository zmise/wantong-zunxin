$(function () {
  dataLayer.push(JSON.parse(sessionStorage.getItem('userInfo.dataLayer')));

  // 手机是否已绑定
  $.ajax({
    url: '/qfang-credit/userCenter/userInfo.json',
    type: 'GET',
    dataType: 'json'
  }).done(function (res) {
    // console.log(res);
    if (res.data.cellphone) {
      $('#bind').text('修改手机号');
    }
  });



  $(document).on('click', '#fetchVerifyCode', function () {
    if ($(this).hasClass('button-disabled')) {
      return;
    }
    //获取短信验证码
    var cellphone = $.trim($('#cellphone').val());
    if (!vailCell(cellphone)) {
      return;
    };

    disableDtn();
    $.ajax({
      url: '/qfang-credit/userCenter/verifyCode.json',
      type: 'POST',
      data: {
        cellphone: cellphone
      }
    }).done(function (res) {
      setCount(59);
      // console.log(res);
    });

  });

  function vailCell(cellphone) {
    // console.log(vailPhone(cellphone));
    if (!vailPhone(cellphone)) {
      $.toast('您的手机码格式不正确');
      return false;
    }
    return true;
  }


  $(document).on('click', '#bind', function () {
    var $bind = $(this);
    if ($bind.hasClass('button-disabled')) {
      return false;
    }

    var data = {};
    var flag = true;

    // 绑定手机 
    $('input:visible').each(function () {
      var $this = $(this);
      var val = $.trim($this.val());
      if (!val) {
        $.toast('请输入' + $this.attr('placeholder'));
        flag = false;
        return false;
      }

      data[this.name] = val;

    });

    if (!flag && vailCell(cellphone)) {
      return false;
    }

    $bind.addClass('button-disabled');
    $.showPreloader('请稍后...');
    console.log(data);
    $.ajax({
      url: '/qfang-credit/userCenter/bindCellphone.json',
      // type: 'POST',
      type: 'GET',
      data: data
    }).done(function (res) {
      console.log(res);
      $.hidePreloader();
      $bind.removeClass('button-disabled');
      if (res.code !== 'ok') {
        var str = '网络出错了，请重试！';
        if (res.msg.indexOf('验证码') > -1) {
          str = res.msg;
        }
        $.alert(str);
        return false;
      }

      $.toast('绑定成功');
      setTimeout(function () {
        location.assign('personal-bank.html?from=' + document.referrer + '&name=' + $('#name').val());
      }, 2000);

    });

  });

  function vailPhone(phone) {
    return /^1(3[1-9]|([578]\d{1}))\d{8}$/.test(phone);
  }

  function enableDtn() {
    $('#fetchVerifyCode').html('获取验证码').removeClass('button-disabled').addClass('button-filly');
  }
  function disableDtn() {
    $('#fetchVerifyCode').html('<span id="second">60</span>秒后重新获取').removeClass('button-filly').addClass('button-disabled');
  }
  function setCount(count) {
    if (count === 0) {
      enableDtn();
      return;
    }
    setTimeout(function () {
      $('#second').text(count--);
      setCount(count);
    }, 1000);
  }
});