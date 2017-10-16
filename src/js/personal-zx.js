$(function () {
  // 手机是否已绑定
  $.ajax({
    url: '/qfang-credit/userCenter/userInfo.json',
    type: 'GET',
    dataType: 'json'
  }).done(function (res) {
    // console.log(res);
    if (res.data.cellphone) {
      $('#invitate').attr('href', './personal-invitation.html');
      $('#lading').attr('href', './personal-lading.html');
    }

    // Google Tag Manager  自定义参数
    var layerdata = {
      dimension1: res.data.id,
      dimension2: res.data.nickName
    };
    dataLayer.push(layerdata);

    // 其他页面也需要传 Google Tag Manager  自定义参数
    sessionStorage.setItem('userInfo.dataLayer', JSON.stringify(layerdata));
  });
});