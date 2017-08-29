$(function () {
  var urlParams = $.unparam(location.search.substring(1));

  // 弹窗
  vTools.commomEvent();
  initData();

  function initData() {

    $.ajax({
      url: '/trade-util/data/price/loadById.json',
      data: { id: urlParams.id },
      beforeSend: function () {
        $.showPreloader();
      },

      success: function (data) {
        var items = data;
        if (items.code == 'ok') {
          var item = items.data;
          for (var key in item) {
            var $item = $('.item-content [data-id="' + key + '"]');
            if (item.hasOwnProperty(key) && $item[0]) {
              var element = item[key];
              if (typeof element === 'number') {
                element = vTools.formatNumber(element);
              }
              if (key === 'certNo') {
                var $temp = $item.prev();
                if (item['certType'] === '2') {
                  element = '粤' + item['year'] + '不动产权第' + element + '号';
                  $temp.text('不动产证号');
                } else {
                  $temp.text('房产证号');
                }
              } else if (key === 'idno' || key === 'ownerName') {
                $item.closest('li').removeClass('dn');
              }
              $item.text(element);
            } else if (key === 'hd' || key === 'hs') {
              element = item[key];
              var sum = 0;
              for (var k in element) {
                $item = $('[data-id="' + key + '-' + k + '"]');
                if (element.hasOwnProperty(k) && $item[0]) {
                  var temp = element[k];
                  sum += +temp;
                  $item.text(vTools.formatNumber(temp));
                }
              }

              $('[data-id="' + key + '-count"]').text(vTools.formatNumber(sum));
            }
          }

          // 若评估单价为不为0或不为空，则显示本按钮
          if (item.unitPrice > 0) {
            searchStr = 'unitPrice=' + item.unitPrice + '&price=' + item.price + '&area' + item.area;
            $('.mandatory-btn').removeClass('none');
          }
        } else {
          $.alert(items.msg);
        }
      },

      complete: function () {
        $.hidePreloader();
      }
    });
  }

});