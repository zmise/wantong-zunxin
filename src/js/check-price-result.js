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
            if ($item[0]) {
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
                var temp = element[k];
                sum += +temp;
                if ($item[0]) {
                  $item.text(vTools.formatNumber(temp));
                }
              }

              item[key + 'count'] = sum;
              $('[data-id="' + key + '-count"]').text(vTools.formatNumber(sum));
            }
          }

          // 若评估单价为不为0或不为空，则显示本按钮
          if (item.unitPrice > 0) {
            searchStr = 'unitPrice=' + item.unitPrice + '&price=' + item.price + '&area' + item.area;
            $('.mandatory-btn').removeClass('none');
          }

          // 判断提示信息
          if (item.hscount !== item.hdcount) {
            $('#regest').find('div').text('建议您选择核' + (item.hscount > item.hdcount ? '定' : '实') + '法缴纳个税，总税费更少');
          } else {
            $('#regest').hide();
          }
          // 契税
          var str = '';
          if (item.isFirst === '1') {
            if (item.area > 90) {
              // 买方首套，建筑面积> 90平米，
              str = '<p>您选择了买方首套，且建筑面积>90，故税率为1.5%；</p><p class="fb">公式=（过户价-增值税）× 1.5% ;</p>';
            } else {
              // 买方首套，建筑面积<=90平米时，提示如下
              str = '<p>您选择了买方首套，且建筑面积<=90，故税率为1%；</p><p class="fb">公式=（过户价-增值税）× 1% ;</p>';
            }
          } else {
            // 非买方首套
            str = '<p>您选择非买方首套，故税率为3%；</p><p class="fb">公式=（过户价-增值税）× 3% ;</p>';
          }
          $('#deedTax').attr('data-tips', str);


          // 满5年
          str = '<p>核定法以<span class="fb">过户价</span>减<span class="fb">增值税</span>后的价值做作为计征基准；</p>';
          if (item.term === '3' && item.isOnly === '1') {
            $('#hd').attr('data-tips', str + '您选择了满五年，且卖方唯一，您无需缴纳个税');
            $('#hs').attr('data-tips', '您选择了满五年，且卖方唯一，您无需缴纳个税');
          }

          // 不满5年
          if (item.term !== '3' || item.isOnly === '2') {
            $('#hs').attr('data-tips', '<p>核实法是以房产的增值部份做为计税基准，税率为20%；</p><p class="fb">公式=（过户价 - 登记价）× 20%；</p>');
            if (item.houseType === '1') {
              str += '<p>您选择了普通住宅，未满五年或非卖方唯一住房，费率为1%；</p><p class="fb">公式=（过户价-增值税）× 1% ;</p>';
            } else {
              str += '<p>您选择了非普通住宅，未满五年或非卖方唯一住房，费率为1.5%；</p><p class="fb">公式=（过户价-增值税）× 1.5% ;</p>';
            }
            $('#hd').attr('data-tips', str);
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