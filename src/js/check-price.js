function sendData(opt) {
  var sessionKey = 'checkPrice' + Math.floor(Math.random() * 100);

  var searchStr = '';
  console.log(opt);
  opt.data.queryType = '1';
  $.showPreloader('正在查询');

  // 查档
  $.ajax({
    url: '/trade-util/query/houseInfo.json',
    type: 'POST',
    data: $.extend({
      personInfo: opt.data.idno || opt.data.ownerName
    }, opt.data),
    async: false,
    beforeSend: function () {
      opt.el.prop('disabled', true);
    },
    success: function (data) {
      if (data.code === 'ok') {
        console.log(data);
        searchStr += '&houseType=' + data.data.result.houseType
          + '&registerPrice=' + data.data.result.registerPrice
          + '&area=' + data.data.result.area;
      }
    }
  });

  // 过户价
  $.ajax({
    url: '/trade-util/query/housePrice.json',
    type: 'POST',
    data: opt.data,
    async: false,
    success: function (data) {
      if (data.code === 'ok') {
        console.log(data);
        searchStr += '&unitPrice=' + data.data.unitPrice + '&id='+data.data.id;
      }
    },

    complete: function () {
      $.hidePreloader();
    }
  });

  delete opt.data.verifyCode;
  if (sessionStorage) {
    sessionStorage.setItem(sessionKey, JSON.stringify(opt.data));
  }

  console.log(searchStr);
  location.assign('./check-price-step.html?sessionKey=' + sessionKey + searchStr)
}
$(function () {
});