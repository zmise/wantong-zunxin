/**
 * Google Tag Manager相关代码
 */

(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src =
    'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-KLDXXLZ');

/**
 * 有google统计所有代码，加上UID  wechatName 两个全局变量
 * UID=用户ID
 * wechatName=微信昵称
 */
var UID, wechatName;
function data2dataLayer(data) {
  // Google Tag Manager  自定义参数
  var layerdata = {
    UID: data.id,
    wechatName: data.nickName
  };
  // 其他页面也需要传 Google Tag Manager  自定义参数
  sessionStorage.setItem('userInfo.dataLayer', JSON.stringify(layerdata));

  setGoogleItems();
}

function loadInfo() {
  $.ajax({
    url: '/qfang-credit/userCenter/userInfo.json',
    data: {
      needStatisticData: true
    },
    dataType: 'json',
    type: 'GET'
  }).done(function (res) {

    if (res.code !== 'ok') {
      return;
    }

    data2dataLayer(res.data);
  });
}

function setGoogleItems() {
  var userInfo = JSON.parse(sessionStorage.getItem('userInfo.dataLayer'));
  if (!userInfo) {
    return false;
  }

  UID = userInfo.UID;
  wechatName = userInfo.wechatName;
  dataLayer.push(UID);
  dataLayer.push(wechatName);
  return true;
}

