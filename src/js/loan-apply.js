$(function () {
  var intentionProductIds = [];
  var remark = "客来自匹配器，申请提交条件为：" + sessionStorage.getItem('loanremark');
  var defaultInfos = {
    sourceCode: 'SYS_SOURCE_0008',
    referrerCode: 'SYS_REFERRER_TYPE_0001'
  };

  setGoogleItems();

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
      $selectedItems.closest('ul').hide();
    }

  }

  function vaiForm() {
    if (!$.trim($('#name').val())) {
      $.alert('请输入您的姓名');
      return false;
    }

    // 贷款人手机
    // if (!/^1[34578]\d{9}$/.test($.trim($('#cellphone').val()))) {
    //   $.alert('请输入正确的手机号码');
    //   return false;
    // }
    var result = vailPhoneCommon($('#cellphone'));
    if (!result) {
      $.alert('请输入正确的手机号码');
      return result;
    }

    // 推荐人手机
    if ($('#referrerCellphone').val()) {
      result = vailPhoneCommon($('#referrerCellphone'));
      if (!result) {
        $.alert('请输入正确的推荐人手机号码');
        return result;
      }

    }
    return true;
  }

  function extraVal() {
    var str = '&intentionProductIds=' + intentionProductIds.join(',') + '&sourceCode=' + defaultInfos.sourceCode + '&remark=' + remark;
    if (!$.trim($('#referrerCellphone').val()) && !$.trim($('#referrerName').val())) {
      return str;
    }
    return str + '&referrerCode=' + defaultInfos.referrerCode;
  }

  initDefault();

  $(document).on('click.agreement', '.open-agreement', function () {
    $.popup('.popup-agreement');
  });

  // 返回
  $(document).on('click.back', '#back', function () {
    history.back();
  });

  $(document).on('click.save', '#save', function () {
    //   if (vaiForm()) {
    //     // return
    //     //   console.log($('form').serialize() + extraVal());
    //     $.showPreloader('正在提交申请……')
    //     $.ajax({
    //       url: '/qfang-credit/bill/ct/fastArchiving.json',
    //       type: 'POST',
    //       data: $('form').serialize() + extraVal()
    //     }).done(function (res) {
    //       // console.log(res);
    //       $.hidePreloader();
    //       sessionStorage.setItem('loanresult', JSON.stringify(res.data));
    //       searchTool.clearHistory(sessionStorage.getItem('token') + 'loanProductIds');
    //       location = 'loan-result.html';
    //     });
    //     //  location = 'loan-result.html';
    //   }
    // 图形验证
    vaiForm() && verifyImg.vaid({
      success: function (data) {
        $.showPreloader('正在提交申请……');
        $.ajax({
          url: '/qfang-credit/bill/ct/fastArchiving.json',
          type: 'POST',
          data: $('form').serialize() + extraVal()
        }).done(function (res) {
          // console.log(res);
          $.hidePreloader();
          sessionStorage.setItem('loanresult', JSON.stringify(res.data));
          searchTool.clearHistory(sessionStorage.getItem('token') + 'loanProductIds');
          location = 'loan-result.html';
        });
      }
    });
  });
});
