$(function () {
  var info = $.unparam(location.search.substring(1));
  var isStick = true;
  setGoogleItems();

  // 手机是否已绑定
  $.ajax({
    url: '/qfang-credit/userCenter/userInfo.json',
    type: 'GET',
    dataType: 'json'
  }).done(function (res) {
    // console.log(res);
    if (res.data.cellphone) {
      isStick = false;
      document.title = '修改资料';
      $('#name').val(res.data.name);
      $('#cellphone').val(res.data.cellphone);
      $('#bind').text('保存');
    }

    if (res.data.bankCardNo) {
      isStick = false;
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

    // 图形验证
    verifyImg.vaid({
      // 成功
      success: function (data) {
        // return;
        disableDtn();
        $.ajax({
          url: '/qfang-credit/userCenter/verifyCode.json',
          type: 'POST',
          data: {
            cellphone: cellphone
          }
        }).done(function (res) {
          if (res.code != 'ok') {
            $.alert(res.msg);
            enableDtn();
            return;
          }
          setCount(59);
          // console.log(res);
        });
      }
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

    if (!flag) {
      return false;
    }
    if (!vailCell(data.cellphone)) {
      return false;
    }

    $bind.addClass('button-disabled');
    $.showPreloader('请稍候...');
    console.log(data);
    $.ajax({
      url: '/qfang-credit/userCenter/bindCellphone.json',
      type: 'POST',
      // type: 'GET',
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
        var target = info.turnTo ? info.turnTo : document.referrer;
        var url;
        if (!isStick) {
          url = target;
        } else {
          url = 'personal-bank.html?from=' + target + '&name=' + $('#name').val();
        }
        location.assign(url);
      }, 2000);

    });

  });

  function vailPhone(phone) {
    return /^1[3456789]\d{9}$/.test(phone);
  }

  function enableDtn() {
    $('#fetchVerifyCode').html('获取验证码').removeClass('button-disabled').addClass('button-filly');
  }
  function disableDtn() {
    $('#fetchVerifyCode').removeClass('button-filly').addClass('button-disabled');
  }
  function setCount(count) {
    if (count === 0) {
      enableDtn();
      return;
    }

    if (count === 59) {
      $('#fetchVerifyCode').html('<span id="second">60</span>秒后重新获取');
    }
    setTimeout(function () {
      $('#second').text(count--);
      setCount(count);
    }, 1000);
  }
  $.init();
});
