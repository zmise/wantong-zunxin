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
      // $('#inquireBtn').hide();
    }
  }

  // 区域指导价
  function areaPrice(area, price, address) {
    var total = 0;
    switch (address) {
      case '罗湖': total = 390; break;
      case '福田': total = 470; break;
      case '南山': total = 490; break;
      case '盐田': total = 330; break;
      case '宝安': total = 360; break;
      case '龙华': total = 320; break;
      case '龙岗': total = 280; break;
      case '光明': total = 250; break;
      case '坪山': total = 200; break;
      case '大鹏': total = 230;
    }
    return (area * price) / 10000 > total;
  }

  // 面积  住宅类型
  function area(area, price, address) {
    if (area) {
      $('#area').val(area);
      if (area > 144 || (address && areaPrice(area, price, address))) {
        $('#houseType2').trigger('click');
      }
    }
  }

  // 处理地址带参数
  function initForm() {
    houseType(urlParams.houseType);
    registerPrice(urlParams.registerPrice);
    unitPrice(urlParams.unitPrice);
    area(urlParams.area, urlParams.unitPrice, urlParams.address);
    $('#id').val(urlParams.id || '');
  }


  // 弹窗
  vTools.commomEvent();

  initForm();

  $('#price').on('input', function () {
    var value = this.value;
    $(this).val(value.replace(/[^\d.]/g, ''));
  });;

  $('#inquireBtn').on('click', function () {
    var result = vTools.formVaild({
      vails: [{// 国土过户价
        selector: '#price',
        regex: function (el) {
          return !isNaN($(el).val());
        }
      }]
    });
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
          $.alert(data.msg);
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
