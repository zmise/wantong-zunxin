$(function() {

  $('#transferPriceRrecord').on('click', function() {
    window.location.replace('./transfer-price-record.html');
    return false;
  });

  $('.type-select').on('click', function() {
    var type = $(this).data('type');
    var taxCalculation = $('.tax-calculation');
    type == '1' ? taxCalculation.addClass('dn') : taxCalculation.removeClass('dn');
  });

  $('#radiobutton').on('change', function() {
    var numberIdLi = $('#numberIdLi');
    var companyNameLi = $('#companyNameLi');
    if ($(this).val() == '单位') {
      numberIdLi.addClass('dn');
      companyNameLi.removeClass('dn');
      $('#id_no').val('');
    } else {
      companyNameLi.addClass('dn');
      numberIdLi.removeClass('dn');
      $('#owner_name').val('');
    }
  });

  $('#codesBtn').on('click', function() {
    $('#codeImg').attr('src', '/trade-util/house/price/verify.pic?' + Math.random() + '');
  });

  $('#inquireBtn').on('click', function() {
    var requireds = $('.required:visible');
    var flag = true;
    var self = $(this);
    var typeSelect = $('.type-select:checked');

    if (!typeSelect.length) {
      $.toast('请选择请求类别');
      return false;
    }

    $.each(requireds, function(k, v) {
      if (!($(v).val())) {
        var text = $(v).parent().siblings('label').text().replace(/:/, '');
        $(v).focus();
        flag = false;
        if ($(v).is('#CERTCODE')) {
          $.toast('请输入验证码');
        } else {
          $.toast('请输入' + text);
        }

        return false;
      } else {
        if ($(v).attr('id') == 'id_no') {
          if (!cardObj.IdCardValidate($.trim($(v).val()))) {
            $(v).focus();
            flag = false;
            $.toast('请输入合法的身份证号');
            return false;
          }
        }
      }
    });

    if (!flag) {
      return false;
    }

    var serializeObj = {};
    $.each($('#transferPiceForm').serializeArray(), function() {
      if (this.value) {
        if (typeSelect.data('type') == 1) {
          if (this.name != 'term' && this.name != 'registerPrice' && this.name != 'houseType' && this.name != 'isOnly' && this.name != 'isFirst') {
            serializeObj[this.name] = this.value;
          }
        } else {
          serializeObj[this.name] = this.value;
        }
      }

    });

    serializeObj.type = typeSelect.data('type');
    serializeObj.isFirst = $('#isFirst').prop('checked') ? 1 : 2;
    serializeObj.isOnly = $('#isOnly').prop('checked') ? 1 : 2;

    $.ajax({
      url: '/trade-util/house/price/query.json',
      type: 'POST',
      data: serializeObj,
      beforeSend: function() {
        self.prop('disabled', true);
        $.showPreloader();
      },

      success: function(data) {
        $.alert(data.msg);
        if (data.code == 'ok') {
          setTimeout(function() {
            location.href = './transfer-price-result.html?id=' + data.data.id + '';
          }, 1000);
        } else {
          self.prop('disabled', false);
        }
      },

      complete: function() {
        $.hidePreloader();
      }
    });
  });

})
