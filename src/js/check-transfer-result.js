$(function () {
  var urlParams = $.unparam(location.search.substring(1));
  var searchStr;

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
            var $item = $('[data-id="' + key + '"]');
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
            }
          }

          // 若评估单价为不为0或不为空，则显示本按钮
          if (item.unitPrice > 0) {
            searchStr = 'unitPrice=' + item.unitPrice + '&registerPrice=' + item.registerPrice + '&area=' + item.area + '&id=' + item.id;
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

  // 弹窗
  vTools.commomEvent();

  $('#inquireBtn').on('click', function () {
    location.assign('./check-price-step.html?' + searchStr);
  });
});
