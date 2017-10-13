$(function () {
  dataLayer.push(JSON.parse(sessionStorage.getItem('userInfo.dataLayer')));

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
  });



  function vail() {
    if (!$.trim($('#name').val())) {
      $.toast('请输入贷款人姓名');
      return false;
    }
    var phone = $.trim($('#cellphone').val());
    phone = !(phone && /^1(3[1-9]|([578]\d{1}))\d{8}$/.test(phone));
    if (phone) {
      $.toast('贷款人手机号不正确');
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
      // type: 'POST',
      type: 'GET',
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