$(function () {
  var qrCode = JSON.parse(sessionStorage.getItem('userInfo.qrCode'));
  dataLayer.push(JSON.parse(sessionStorage.getItem('userInfo.dataLayer')));

  // 获取邀请二维码信息
  function getQCode() {
    $.ajax({
      url: '/qfang-credit/userCenter/qrCode.json',
      dataType: 'json',
      type: 'GET'
    }).done(function (res) {
      // console.log(res);
      if (res.code != 'ok') {
        return;
      }

      $('#qrCodeUrl').attr('src', res.data);
    });

  }

  //个人信息
  $.ajax({
    url: '/qfang-credit/userCenter/userInfo.json',
    data: {
      needStatisticData: true
    },
    dataType: 'json',
    type: 'GET'
  }).done(function (res) {
    // console.log(res);
    if (res.code != 'ok') {
      return;
    }

    if (!res.data.cellphone) {
      location.assign('./personal-cell.html');
    }

    $('#name').text(res.data.name);
    $('#phone').text(res.data.cellphone);
    $('#invitateNo').text(res.data.successInvitedCount);
    getQCode();
  });


});