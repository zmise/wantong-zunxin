$(function () {
  // 设置Google两个变量
  var isGoogle = setGoogleItems();

  var infos = $.unparam(location.search.substr(1));
  console.log(infos);
  if (infos.type === 'Qsd') {
    $('#from').show();
    $('#remark').val('推荐办理税费贷');
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
    var data = res.data;41
    // console.log(res);
    if (!data.cellphone) {
      location.replace('./personal-cell.html'); 
    }

    $('#rname').text(data.name);
    $('#rcellphone').text(data.cellphone);
    $('#referrerName').val(data.name);
    $('#referrerCellphone').val(data.cellphone);

    !isGoogle && data2dataLayer(data);
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
      $('#cellphone').val(m)
      return '';
    });


    phone = !(phone && vailPhoneCommon(phone).result);
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
        var str = '网络出错了，请重试！';
        if(res.msg){
          str = msg;
        }
        $.alert(str);
        return false;
      }

      $('#ladDtail').attr('href', './personal-lading-detail.html?id=' + res.data).closest('.success-content').show().next().hide();

    });
  });
});
