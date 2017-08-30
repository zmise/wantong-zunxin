/**
 *  信贷V2.4.3(尊信公众号小工具优化)
 */

var vTools = {
  /* 初始化年份 选项的值有为2015 至 当前年份 */
  setYearSelect: function (selector, boolean) {
    var year = 2015;
    var lastYear = new Date().getFullYear();
    var _html = '';
    while (year <= lastYear) {
      _html += '<option value="' + lastYear + '">' + lastYear + '</option>';
      lastYear--;
    }
    if (boolean) {
      $(selector).html(_html);
    } else {
      $(selector).append(_html);
    }
  },
  /* 单选 联动 */
  radioLink: function (selectorStr) {
    $('#' + selectorStr).on('click', function () {
      var type = $(this).find(':checked');
      var index = type.index() > 0 ? 1 : 0;
      // console.log(type.index());
      $('.js-' + selectorStr).addClass('dn').eq(index).removeClass('dn');
    });
  },
  /* tab 切换页面 */
  tabLink: function (tabBox, items) {
    $(tabBox).find(items).on('click', function () {
      var uri = $(this).data('uri');
      if (uri) {
        location.assign(uri);
      }

      return false;
    });
  },
  /* 渲染数据 data-id */
  renderData: function (item) {

  },
  /* 表单验证 data-label */
  formVaild: function (opt) {
    var $items,
      flag = true,
      list,
      msg;
    if (opt && opt.container) {
      $items = $(opt.container).find('.required:visible');
    } else {
      $items = $('.required:visible');
    }
    $items.each(function (k, v) {
      var $v = $(v);
      var temp;
      msg = $v.data('label') || '请填写所有必填项';

      // 空值
      if (!$v.val()) {
        flag = false;
        $.toast(msg);
        return false;
      }

      if (opt && opt.vails) {
        // 自定义校验
        list = opt.vails;
        if (list && list.length > 0) {
          for (var i = 0, len = list.length; i < len; i++) {
            temp = list[i];
            if ($v.is(temp.selector)) {
              if ($.isFunction(temp.regex) && !temp.regex(v)) {
                if (temp.message) {
                  $.toast(temp.message);
                } else {
                  $.toast(msg);
                }
                flag = false;
                return false;
              }
            }
          }
        }
      }
    });

    return flag;
  },

  /**
   * 弹窗
   */
  commomEvent: function () {
    $(document).on('click.modal', '.icon-question', function () {
      var $item = $(this).parent();
      var text = $item.data('tips');
      if (text === 'key2house') {
        text = $('#key2house').html();
      }
      $.modal({
        extraClass: 'icon-tips',
        title: $item.text(),
        text: text,
        buttons: [
          {
            text: '关闭',
            close: true
          },
        ]
      })
    });
  },

  /**
   * 通用方法
   */
  setDeafaultForm: function () {
    var data = $.unparam(location.search.substring(1));
    var sessionKey;
    var $item;
    if (!data) {
      return;
    }

    if (data.sessionKey) {
      sessionKey = data.sessionKey;
      data = JSON.parse(sessionStorage.getItem(sessionKey));
    }
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var element = data[key];
        $item = $('[name="' + key + '"]');
        if ($item[0] && key !== 'certNo') {
          if (key === 'personInfo') {
            $('#personInfo' + data.ownerType).val(element);
          } else if ($item.attr('type') === 'radio') {
            $('[name="' + key + '"][value="' + element + '"]').trigger('click');
          } else {
            $item.val(element);
          }
        } else if (key === 'personInfo') {
          if (!/.*[\u4e00-\u9fa5]+.*$/.test(element)) {
            // 身份证号
            $('#idno:visible').val(element);
          } else if (data.ownerType === '2') {
            // 单位名称
            $('#ownerName:visible').val(element);
          }
        }
      }
    }

    // 房产证号
    if (data.certNo) {
      $('[name="certNo"]:visible').val(data.certNo);
    }

  },
  /**
   * 千分位
   */
  formatNumber: function (number) {
    number = number.toFixed(2);
    return number.replace(/(?!^)(?=(?:\d{3})+(?!\d))/g, ",");
  }

};