$(function () {
  var intentionProductIds = [];
  var defaultInfos = {
    sourceCode: 'SYS_SOURCE_0008',
    referrerCode: 'SYS_REFERRER_TYPE_0001'
  };

  // 获取url带的参数
  function initDefault() {
    var reInfo = decodeURI(location.search.substr(1));
    // console.log(reInfo);
    var $selectedItems = $('#selectedItems');
    var _html = '';

    if (reInfo) {
      reInfo = JSON.parse(reInfo);
      for (var i = 0, len = reInfo.length; i < len; i++) {
        var item = reInfo[i];
        _html += '<p class="selected-item">' +
          item.name + '<input type="hidden" name="" value="' +
          item.no + '"></p>';
        intentionProductIds.push(item.no);

      }
      $selectedItems.html(_html);
    } else {
      $selectedItems.parent().hide();
    }

  }

  function vaiForm() {
    if (!$.trim($('#name').val())) {
      $.alert('请输入您的姓名');
      return false;
    }

    if (!/^1[34578]\d{9}$/.test($.trim($('#cellphone').val()))) {
      $.alert('请输入正确的手机号码');
      return false;
    }

    return true;
  }

  function extraVal() {
      var str = '&intentionProductIds='+ intentionProductIds.join(',') +'&sourceCode=' + defaultInfos.sourceCode;
    if (!$.trim($('#referrerCellphone').val()) && !$.trim($('#referrerName').val())) {
      return str;
    } 
    return str + '&referrerCode=' + defaultInfos.referrerCode;
  }

  initDefault();

  $('.open-agreement').on('click', function () {
    $.popup('.popup-agreement');
  });

  $('#save').on('click', function () {
    if (vaiForm()) {
    //   console.log($('form').serialize() + extraVal());
      $.showPreloader('正在提交申请……')
      $.ajax({
        url: '/qfang-credit/bill/ct/fastArchiving.json',
        type: 'POST',
        data: $('form').serialize() + extraVal()
      }).done(function (res) {
        // console.log(res);
        $.hidePreloader();
        $('.success').show();
        $('.success').siblings().hide();
      });
    }
  });
});
