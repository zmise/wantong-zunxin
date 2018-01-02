$(function () {

  // 判断服务器是否正常
  // $.ajax({
  //   url: '/trade-util/data/houseInfo/checkServer.json',
  //   success: function (data) {
  //     if (!data.data) {
  //       $.alert('服务器异常,请稍后再查询', function () {
  //         WeixinJSBridge.call('closeWindow');
  //       });
  //     };
  //   }
  // });

  // 设置Google两个变量
  !setGoogleItems() && loadInfo();

  // 初始化年份 选项的值有为2015 至 当前年份，默认"请选择"
  vTools.setYearSelect('#year');

  // 房地产证 切换
  vTools.radioLink('certType');

  // 权利人类型
  vTools.radioLink('ownerType');

  // 地址带参数
  vTools.setDeafaultForm();

  // 自动将输入框中的小写变为大写
  // setUPperCase($('#personInfo1'));


  // 确定 按钮
  $('#inquireBtn').on('click', function () {
    var self = $(this);
    var result = vTools.formVaild({
      container: '#consultFilesFrom'
      // vails: [{// 身份证号 / 姓名
      //   selector: '#personInfo'
      //   regex: function (el) {
      //     var value = $.trim($(el).val());
      //     if (!cardObj.IdCardValidate(value) && !/^[\u4E00-\u9FA5]{2,4}$/.test(value)) {
      //       return false;
      //     }

      //     return true;
      //   }
      // }, {
      //   selector: '#certNo',
      //   regex: function (el) {
      //     return /^[0-9]*$/.test($.trim($(el).val()))
      //   },
      //   message: '产权证号只能输入数字'
      // }]
    });

    if (!result) {
      return;
    }

    var serializeObj = {};
    $.each($('#consultFilesFrom').serializeArray(), function () {
      if (this.value) {
        var name = this.name;
        if (name == 'year') {
          if ($('#year').is(':visible')) {
            serializeObj[name] = this.value;
          }
        } else if (name == 'certNo' || name == 'personInfo') {
          serializeObj[name] = $('[name="' + name + '"]:visible').val();
        } else {
          serializeObj[name] = this.value;
        }
      }

    });

    // console.log(serializeObj);
    $.ajax({
      url: '/trade-util/query/houseInfo.json',
      type: 'POST',
      // type: 'GET',
      data: serializeObj,
      beforeSend: function () {
        self.prop('disabled', true);
        $.showPreloader('正在查询');
      },
      success: function (data) {
        if (data.code !== 'ok') {
          $.alert(data.msg);
          self.prop('disabled', false);
          return;
        }

        // 正常结果
        location.href = './consult-files-result.html?id=' + data.data.id;
      },

      complete: function () {
        $.hidePreloader();
      }
    });

  });

});
