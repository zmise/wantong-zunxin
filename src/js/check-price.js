function sendData(opt) {
  $.showPreloader('正在查询');

  var searchO = {};
  var houseInfo = false;
  var housePrice = false;
  console.log(opt);
  opt.data.queryType = '1';


  // 自动将输入框中的小写变为大写
  // setUPperCase($('#idno'));

  // 查档
  $.ajax({
    url: '/trade-util/query/houseInfo.json',
    type: 'POST',
    data: $.extend({
      personInfo: opt.data.idno || opt.data.ownerName
    }, opt.data),
    beforeSend: function () {
      opt.el.prop('disabled', true);
    },
    success: function (data) {
      houseInfo = true;
      if (data.code === 'ok') {
        console.log(data);
        data = data.data.result;
        if (!data) {
          return;
        }
        if (data.houseType) {
          searchO.houseType = data.houseType;
        }

        if (data.registerPrice) {
          searchO.registerPrice = data.registerPrice;
        }

        if (data.area) {
          searchO.area = data.area;
        }

        if (data.address) {
          searchO.address = data.address;
        }

      }
    },
    complete: function () {
      if (houseInfo && housePrice) {
        turnToNext(searchO, opt.data);
      }
    }
  });

  // 过户价
  $.ajax({
    url: '/trade-util/query/housePrice.json',
    type: 'POST',
    data: opt.data,
    success: function (data) {
      housePrice = true;
      if (data.code === 'ok') {
        data = data.data;
        if (data.houseType) {
          searchO.houseType = data.houseType;
        }

        if (data.registerPrice) {
          searchO.registerPrice = data.registerPrice;
        }

        if (data.area) {
          searchO.area = data.area;
        }

        if (data.unitPrice) {
          searchO.unitPrice = data.unitPrice;
        }

        if (!searchO.address && data.region) {
          searchO.address = data.region;
        }

        if (data.id) {
          searchO.id = data.id;
        }
      } else if (data.msg.indexOf('验证码') > -1) {
        housePrice = false;
        $.hidePreloader();
        $.alert(data.msg);
      }
    },

    complete: function () {
      if (houseInfo && housePrice) {
        turnToNext(searchO, opt.data);
      }
    }
  });


  // console.log(searchStr);
  // location.assign('./check-price-step.html?sessionKey=' + sessionKey + searchStr)
}

function turnToNext(obj, data) {
  $.hidePreloader();
  var sessionKey = 'checkPrice' + Math.floor(Math.random() * 100);
  var searchStr = '';

  delete data.verifyCode;
  if (sessionStorage) {
    sessionStorage.setItem(sessionKey, JSON.stringify(data));
  }

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var element = obj[key];
      if (element) {
        searchStr += '&' + key + '=' + element;
      }
    }
  }
  location.assign('./check-price-step.html?sessionKey=' + sessionKey + searchStr)
}

$(function () {
  // 设置Google两个变量
  !setGoogleItems() && loadInfo();
});
