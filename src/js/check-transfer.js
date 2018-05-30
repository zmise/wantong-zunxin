function sendData(opt) {
  $.ajax({
    url: '/trade-util/query/housePrice.json',
    type: 'POST',
    // type: 'GET',
    data: opt.data,
    beforeSend: function () {
      opt.el.prop('disabled', true);
      $.showPreloader('正在查询');
    },

    success: function (data) {
      if (data.code !== 'ok') {
        var str = data.msg;
        $.alert(data.msg);
        opt.el.prop('disabled', false);
        return;
      }

      location.href = './check-transfer-result.html?id=' + data.data.id;
    },

    complete: function () {
      $.hidePreloader();
    }
  });
}

$(function () {
  // 切换页面
  // vTools.tabLink($('.buttons-tab'));

  // 设置Google两个变量
  !setGoogleItems() && loadInfo();

  // 初始化年份 选项的值有为2015 至 当前年份，默认"请选择"
  vTools.setYearSelect('#year');

  // 权利人类型 切换
  vTools.radioLink('ownerType');

  // 房地产证 切换
  vTools.radioLink('certType');



  // 地址带参数
  vTools.setDeafaultForm();

  // 自动将输入框中的小写变为大写
  // setUPperCase($('#idno'));
  $('#propertyType').on('click', function () {
    if ($('#ownerType').find(':checked').attr('value') === '2' && $(this).find(':checked').attr('value') === '1') {
      if ($('#tradeType').find(':checked').attr('value') === '2') {
        $('.js-ownerTypeExtra').removeClass('dn');
      } else {
        $('.js-ownerTypeExtra').eq(0).removeClass('dn');
      }
    } else {
      $('.js-ownerTypeExtra').removeClass('dn').addClass('dn');
    }
  });

  $('#ownerType').on('click', function () {
    if ($(this).find(':checked').attr('value') === '2' && $('#propertyType').find(':checked').attr('value') === '1') {
      if ($('#tradeType').find(':checked').attr('value') === '2') {
        $('.js-ownerTypeExtra').removeClass('dn');
      } else {
        $('.js-ownerTypeExtra').eq(0).removeClass('dn');
      }
    } else {
      $('.js-ownerTypeExtra').removeClass('dn').addClass('dn');
    }
  });

  $('#tradeType').on('click', function () {
    if ($(this).find(':checked').attr('value') === '2' && $('#ownerType').find(':checked').attr('value') === '2' && $('#propertyType').find(':checked').attr('value') === '1') {
      $('.js-tradeType').removeClass('dn');
    } else {
      $('.js-tradeType').removeClass('dn').addClass('dn');
    }
  });


  $('#codeImg,#codesBtn').on('click', function () {
    $('#codeImg').attr('src', '/trade-util/house/price/verify.pic?' + Math.random() + '');
  });

  $('#inquireBtn').on('click', function () {
    var self = $(this);
    var result = vTools.formVaild({
      container: '#transferPriceForm'
      // vails: [{// 身份证号 / 姓名
      // selector: '#idno'
      // regex: function (el) {
      //   return cardObj.IdCardValidate($.trim($(el).val()));
      // }
      // }]
    });

    if (!result) {
      return false;
    }

    var serializeObj = {};
    $.each($('#transferPriceForm').serializeArray(), function () {
      var name = this.name;
      if (this.value) {
        if (name === 'idno' || name === 'ownerName' || name === 'year' || name === 'tradeType' || name === 'buyerType') {
          if ($('#' + name).is(':visible')) {
            serializeObj[name] = this.value;
          }
        } else if (this.name == 'certNo') {
          serializeObj[this.name] = $('[name="certNo"]:visible').val();
        } else {
          serializeObj[name] = this.value;
        }
      }

    });
    // console.log(serializeObj)
    sendData({
      data: serializeObj,
      el: self
    });
  });

})
