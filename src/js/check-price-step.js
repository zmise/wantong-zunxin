$(function () {
  var urlParams = $.unparam(location.search.substring(1));
  // 房产类型
  // function houseType(type) {
  //   var list = ['商业', '酒店', '厂房', '商铺', '商务公寓', '办公', '公寓式办公', '写字楼'];
  //   if (type && list.indexOf(type) > -1) {
  //     $('.js-houseType').show();
  //     $('#inquireBtn').hide();
  //   }
  // }

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
      // $('.js-unitPrice').show();
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

  //根据propertyType和ownerType的值来渲染页面
  function htmlType(property, owner, trade, buyer) {
    $('.list-block').removeClass('dn')

    if (property === '2') {
      // $('.js-privateHouse').remove();
      // $('.js-companyBuysHouse').remove();
      // $('.js-business').remove();
      $('.js-companySellsHouseCompany').remove();
      $('.js-companySellsHousePrivate').remove();
      var str = ''
      if (owner === '2') {
        str = '公司产权的物业只能按核实方法计征个税'
        $('#taxType2').attr('checked', 'checked');
        $('#taxType1').removeAttr('checked');
        $('label[for="taxType1"]').addClass('dn');
      } else {
        str = '个税计征的两种方式，一般来讲核定法的计征方式税费会更低'
      }
      $('#taxText').attr('data-tips', str);
    } else if (property === '1' && owner === '2' && trade === '1') {
      $('.js-privateHouse').remove();
      $('.js-companyBuysHouse').remove();
    } else if (property === '1' && owner === '2' && trade === '2' && buyer === '1') {
      $('.js-companySellsHousePrivate').remove();
    } else if (property === '1' && owner === '2' && trade === '2' && buyer === '2') {
      $('.js-companySellsHouseCompany').remove();
      $('.js-companySellsHousePrivate').remove();
    }
    else {
      $('.js-privateHouse').remove();
    }


  }

  // 处理地址带参数
  function initForm() {
    htmlType(urlParams.propertyType, urlParams.ownerType, urlParams.tradeType, urlParams.buyerType);
    // houseType(urlParams.houseType);
    registerPrice(urlParams.registerPrice);
    unitPrice(urlParams.unitPrice);
    area(urlParams.area, urlParams.unitPrice, urlParams.address);
    urlParams.price && $('#price').val(urlParams.price);
    $('#id').val(urlParams.id || '');
  }






  // 弹窗
  vTools.commomEvent();

  initForm();


  $('#price').on('input', function () {
    var value = this.value;
    $(this).val(value.replace(/[^\d.]/g, ''));
  });

  $('#inquireBtn').on('click', function () {
    var $self = $(this);

    var result = vTools.formVaild({
      container: '#transferPriceForm',
      // vails: [{// 国土过户价
      //   selector: '#price',
      //   regex: function (el) {
      //     return ($(el).val() === '');
      //   }
      // }]
      // ortherVails: [{// 卖方唯一住房
      //   selector: '#isOnly',
      //   regex: function (el) {
      //     return $(el).find(':checked')[0];
      //   },
      //   message: '请选择是否卖方唯一住房'
      // }, {// 买方首套住房
      //   selector: '#isFirst',
      //   regex: function (el) {
      //     return $(el).find(':checked')[0];
      //   },
      //   message: '请选择是否买方首套住房'
      // }]
    });
    if (!result) {
      return false;
    }
    console.log($('#transferPriceForm').serialize());
    $.ajax({
      url: '/trade-util/query/houseTaxNew.json',
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

        location.href = '././check-price-result.html?id=' + data.data.id + '&propertyType=' + urlParams.propertyType;
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
      if (urlParams.propertyType) {
        url += '&propertyType=' + urlParams.propertyType;
      }
      if (urlParams.ownerType) {
        url += '&ownerType=' + urlParams.ownerType;
      }
      if (urlParams.tradeType) {
        url += '&tradeType=' + urlParams.tradeType;
      }
      if (urlParams.buyerType) {
        url += '&buyerType=' + urlParams.buyerType;
      }

    } else {
      url = './check-transfer-result.html?id=' + urlParams.id;
    }

    location.assign(url);
  });
});
