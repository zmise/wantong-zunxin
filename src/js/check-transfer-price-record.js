$(function () {

  var $consultList = $('#consultList');
  var loading = false;
  var pageCount = 1;
  var pageIndex = 1;

  function addItems(params) {
    var html = '';
    var data = $.extend({
      pageIndex: 1
    }, params);

    $.ajax({
      url: '/trade-util/data/price/listData.json',
      data: data,
      beforeSend: function () {
        if (!$('.infinite-scroll-preloader').find('.preloader').length) {
          $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
        }

        $consultList.parent().find('.no-data').remove();
      },

      success: function (data) {
        if (data.code == 'ok') {
          var items = data.data.list;
          if (!items.length) {
            $consultList.parent().append('<div class="no-data">暂无数据</div>');
            $('.infinite-scroll-preloader').empty();
            return;
          }

          if (data.data.page.pageCount === 1) {
            $('.infinite-scroll-preloader').empty();
          }

          var doc = document.createDocumentFragment();

          $.each(items, function (k, v) {
            var tempHTML = $('#tempHTML .list-block').clone();
            // console.log(tempHTML, v);
            tempHTML.attr('data-id', v.id);
            tempHTML.attr('data-type', v.type);

            // var list = tempHTML.find('[data-id]');
            tempHTML.find('[data-id]').each(function () {
              var $this = $(this);
              var $parent = $this.parent();
              var key = $this.data('id');
              var element = v[key];
              if (element) {
                if (typeof element === 'number') {
                  element = vTools.formatNumber(element);
                }

                if (key === 'certCode') {
                  var $temp = $this.prev();
                  if (v['certType'] === '2') {
                    element = '粤' + v['year'] + '不动产权第' + element + '号';
                    $temp.text('不动产证号');
                  } else {
                    $temp.text('房产证号');
                  }
                } else if (key === 'amount') {
                  $this.next().text('元').parent().prev().text(v.type === '1' ? '过户总价' : '税费');
                } else if (key === 'idno' || key === 'ownerName') {
                  $this.closest('li').removeClass('dn');
                }
                $this.text(element);
              } else if (key === 'amount') {
                var str = '税费';
                if (v.type === '1') {
                  if (v.unitPrice > 0) {
                    str = '过户单价';
                    $this.text(v.unitPrice).next().text('元/m²').parent().prev().text('过户单价');
                  } else {
                    str = '过户价';
                    $parent.html('<span class="font-error">过户单价为0或空</span>');
                  }
                } else {
                  $parent.html('<span class="font-error">抱歉，未能查到' + str + '</span>');
                }
                $parent.prev().text(str);
              }
            });

            doc.appendChild(tempHTML[0]);
          });

          $consultList.append(doc);
          pageCount = data.data.page.pageCount;
        }
      }
    });
  }

  addItems();

  $(document).on('infinite', '.infinite-scroll-bottom', function () {
    if (loading) {
      return;
    }

    loading = true;
    pageIndex++;
    setTimeout(function () {
      loading = false;
      if (pageIndex > pageCount) {
        $.detachInfiniteScroll($('.infinite-scroll'));
        $('.infinite-scroll-preloader').empty();
        return;
      }

      addItems({ pageIndex: pageIndex });

      $.refreshScroller();
    }, 1000);
  });

  // 点击列表进入详情，详情表现与查询结果一致
  $('#consultList').on('click', '.list-block', function () {
    var $this = $(this);
    var type = $this.data('type');
    var key = (type === 1 ? 'transfer' : 'price');
    location.href = './check-' + key + '-result.html?id=' + $this.data('id');
    return false;
  });


  $.init();
});
