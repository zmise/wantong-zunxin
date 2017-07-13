$(function() {

  $.ajax({
    url: '/trade-util/houseInfo/checkServer.json',
    success: function(data) {
      if (!data.active) {
        $.alert('服务器异常,请稍后再查询', function() {
          WeixinJSBridge.call('closeWindow');
        });
      };
    }
  });

  $('#consultRecord').on('click', function () {
    window.location.replace('./consult-files-record.html');
    return false;
  });

  var $yearCont = $('#yearCont');
  $('#certType').on('change', function() {
    if ($(this).val() == '2') {
      $yearCont.removeClass('dn');
    } else {
      $yearCont.addClass('dn');
    }
  });

  $('#inquireBtn').on('click', function() {
    var requireds = $('.required:visible');
    var flag = true;
    var self = $(this);

    $.each(requireds, function(k, v) {
      if (!($(v).val())) {
        var text = $(v).parent().siblings('label').text().replace(/:/, '');
        $(v).focus();
        flag = false;
        $.toast('请输入' + text);
        return false;
      } else {
        if ($(v).is('#personInfo')) {
          if (!cardObj.IdCardValidate($.trim($(v).val()))) {
            if (!/^[\u4E00-\u9FA5]{2,4}$/.test($.trim($(v).val()))) {
              $(v).focus();
              flag = false;
              $.toast('请输入合法的身份证号/权利');
              return false;
            }
          }
        } else if ($(v).is('#certNo')) {
          var certNoFlage = false;
          if (!/[0-9]/.test($.trim($(v).val()))) {
            certNoFlage = true;
          } else {
            if ($.trim($(v).val()).indexOf('.') != -1) {
              certNoFlage = true;
            }
          }

          if (certNoFlage) {
            $(v).focus();
            flag = false;
            $.toast('房产证号只能输入数字');
            return false;
          }
        }
      }
    });

    if (!flag) {
      return false;
    }

    var serializeObj = {};
    $.each($('#consultFilesFrom').serializeArray(), function() {
      if (this.value) {
        if (this.name == 'year') {
          if ($yearCont.is(':visible')) {
            serializeObj[this.name] = this.value;
          }
        } else {
          serializeObj[this.name] = this.value;
        }
      }

    });

    $.ajax({
      url: '/trade-util/houseInfo/query.json',
      type: 'POST',
      data: serializeObj,
      beforeSend: function() {
        self.prop('disabled', true);
        $.showPreloader();
      },

      success: function(data) {
        setTimeout(function() {
          location.href = './consult-files-result.html?id=' + data.data.id + '';
        }, 1000);
      },

      complete: function() {
        $.hidePreloader();
      }
    });
  });

});
