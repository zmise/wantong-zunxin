$(function () {
  var urlParams = $.unparam(location.search.substring(1));

  // 房产类型
  function houseType(type) {
    var list = ['商业', '酒店', '厂房', '商铺'];
    if (type && list.indexOf(type) > -1) {
      $('.js-houseType').show();
      $('#inquireBtn').hide();
    }
  }

  // 登记价
  function registerPrice(price) {
    if (price && price > 0) {
      $('#registerPrice').val(price);
    } else {
      $('.js-registerPrice').show();
    }
  }

  // 过户单价
  function unitPrice(price) {
    if (price && price > 0) {
      $('#unitPrice').val(price);
    } else {
      $('.js-unitPrice').show();
      $('#inquireBtn').hide();
    }
  }

  // 面积
  function area(area) {
    if (area) {
      $('#area').val(area);
      if (area > 144) {
        $('#houseType2').trigger('click');
      }
    }
  }

  // 处理地址带参数
  function initForm() {
    houseType(urlParams.houseType);
    registerPrice(urlParams.registerPrice);
    unitPrice(urlParams.unitPrice);
    area(urlParams.area);
    $('#id').val(urlParams.id);
  }


  // 弹窗
  vTools.commomEvent();

  initForm();

  $('#inquireBtn').on('click', function () {
    var result = vTools.formVaild();
    var $self = $(this);
    if (!result) {
      return false;
    }
    $.ajax({
      url: '/trade-util/query/houseTax.json',
      // type: 'POST',
      type: 'GET',
      data: $('#transferPriceForm').serialize(),
      beforeSend: function () {
        $self.prop('disabled', true);
        $.showPreloader();
      },

      success: function (data) {
        if (data.code !== 'ok') {
          $.alert('天啦噜~网络出错了</br>再试一下吧');
          $self.prop('disabled', false);
          return;
        }

        location.href = '././check-price-result.html?id=' + data.data.id;
      },

      complete: function () {
        $.hidePreloader();
      }
    });
  });
  $('#backBtn').on('click', function () {
    var url;
    if (urlParams.sessionKey) {
      url = './check-price.html?sessionKey=' + urlParams.sessionKey;
    } else {
      url = './check-transfer-result.html?id=' + urlParams.id;
    }

    location.assign(url);
  });
});