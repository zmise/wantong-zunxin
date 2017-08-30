$(function () {
  var urlParams = $.unparam(location.search.substring(1));
  var searchStr;


  function initData() {
    $.ajax({
      url: '/trade-util/data/houseInfo/loadById.json',
      data: { id: urlParams.id },
      beforeSend: function () {
        $.showPreloader();
      },

      success: function (data) {
        var items = data;
        if (items.code == 'ok') {
          var item = items.data;

          // 没有结果
          if (!item.address) {
            // 隐藏查询结果项
            $('.result-title').text('没有找到匹配的房产记录').closest('li').siblings().hide();
            // 隐藏 查过户价 和 查税费 按钮
            $('.mandatory-btn').first().siblings('.mandatory-btn').hide();

          }

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
              } else if (key === 'queryType') {
                element = element > 1 ? '分栋' : '分户';
              } else if (key === 'personInfo') {
                var $temp = $item.prev();
                if (item['ownerType'] === '2') {
                  $temp.text('单位名称');
                } else {
                  $temp.text('身份证号/姓名');
                }
              }else if( key ==='houseType'){
                element = element > 1 ? '商用' : '住宅';
              }
              $item.text(element);
            }
          }

          // if (!searchStr) {
          searchStr = 'queryType=' + item.queryType
            + '&certType=' + item.certType
            + '&certNo=' + item.certNo
            + '&ownerType=' + item.ownerType
            + '&personInfo=' + item.personInfo;
          if (item.year) {
            searchStr += '&year=' + item.year;
          }
          // }

        } else {
          $.alert(items.msg);
        }
      },

      complete: function () {
        $.hidePreloader();
      }
    });
  }

  initData();


  // 再次查询
  $('#research').on('click', function () {
    location.assign('./consult-files.html?' + searchStr);
  });
  // 查过户价
  $('#transfer').on('click', function () {
    location.assign('./check-transfer.html?' + searchStr);
  });
  // 查税费
  $('#price').on('click', function () {
    location.assign('./check-price.html?' + searchStr);
  });
});
