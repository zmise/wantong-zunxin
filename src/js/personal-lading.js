$(function () {
  var layerdata = JSON.parse(sessionStorage.getItem('userInfo.dataLayer'));
  layerdata && dataLayer.push(layerdata);

  var infos = $.unparam(location.search.substr(1));
  console.log(infos);
  if (infos.type === 'Qsd') {
    $('#from').show();
    $('#remark').val('推荐办理Q税贷');
    $('#productId').val(infos.productId);
  } else {
    $('#from').hide();
  }

  // 手机是否已绑定
  $.ajax({
    url: '/qfang-credit/userCenter/userInfo.json',
    type: 'GET',
    dataType: 'json'
  }).done(function (res) {
    // console.log(res);
    if (!res.data.cellphone) {
      location.replace('./personal-cell.html');
    }

    $('#rname').text(res.data.name);
    $('#rcellphone').text(res.data.cellphone);
    $('#referrerName').val(res.data.name);
    $('#referrerCellphone').val(res.data.cellphone);

    if (!layerdata) {
      // Google Tag Manager  自定义参数
      var layerdata = {
        dimension1: res.data.id,
        dimension2: res.data.nickName
      };
      dataLayer.push(layerdata);

      // 其他页面也需要传 Google Tag Manager  自定义参数
      sessionStorage.setItem('userInfo.dataLayer', JSON.stringify(layerdata));
    }
  });



  function vail() {
    if (!$.trim($('#name').val())) {
      $.toast('请输入贷款人姓名');
      return false;
    }

    // var phone = $.trim($('#cellphone').val());
    // ios 通讯录复制过来的号码会有特殊字符
    var phone = $('#cellphone').val().replace(/\s+/g, '');
    // console.log(phone.length);
    encodeURI(phone).replace(/\d{11}/, function (m) {
      console.log(m);
      phone = m;
      return '';
    });


    phone = !(phone && /^1(3[1-9]|([578]\d{1}))\d{8}$/.test(phone));
    if (phone) {
      $.toast('贷款人手机号不正确');
      return false;
    }

    var lenderAmount = $.trim($('#lenderAmount').val());

    if (lenderAmount && !/^\d+$/.test(lenderAmount)) {
      $.toast('期望贷款额只能输入数字');
      return false;
    }
    return true;
  }

  $('#ownModal .own-modal').on('click', function (e) {
    e.stopPropagation();
  });
  $('#ownModalClose').on('click', function () {
    $('#ownModal').hide();
  });

  $(document).on('click', '.open-agreement', function () {
    $.popup('.popup-agreement');

  }).on('click', '#agreement', function () {
    $('#save').toggleClass('button-disabled', !this.checked);

  }).on('click', '#ladingTips', function () {
    $('#ownModal').show();

  }).on('click', '#ownModal', function () {
    $('#ownModal').hide();

  }).on('click', '#save', function () {
    var $save = $(this);
    if ($save.hasClass('button-disabled')) {
      return false;
    }

    if (!vail()) {
      return false;
    }

    $save.addClass('button-disabled');
    $.showPreloader('请稍候...');

    $.ajax({
      url: '/qfang-credit/wx/order/apply.json',
      type: 'POST',
      // type: 'GET',
      data: $('#form').serialize()
    }).done(function (res) {
      console.log(res);
      $.hidePreloader();
      $save.removeClass('button-disabled');
      if (res.code !== 'ok') {
        $.alert('网络出错了，请重试！');
        return false;
      }

      $('#ladDtail').attr('href', './personal-lading-detail.html?id=' + res.data).closest('.success-content').show().next().hide();

    });
  });
});
