$(function () {
  var $consultList = $('#consultList');
  var loading = false;
  var pageCount = 1;
  var pageIndex = 1;

  // 点击列表进入详情，详情表现与查询结果一致
  $('#consultList').on('click', '.list-block', function () {
    location.href = './consult-files-result.html?id=' + $(this).data('id');
    return false;
  });

  function addItems(params) {
    var html = '';
    var data = $.extend({
      pageIndex: 1
    }, params);

    $.ajax({
      url: '/trade-util/data/houseInfo/listData.json',
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
            $consultList.html('<div class="no-data">暂无数据</div>');
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
            if (!v.status) {
              tempHTML.find('.result-title').text('没有找到匹配的房产记录');
            }

            var list = tempHTML.find('.item-content [data-id]');
            tempHTML.find('.item-content [data-id]').each(function () {
              var $this = $(this);
              var key = $this.data('id');
              var element = v[key];
              if (element) {
                if (typeof element === 'number') {
                  element = vTools.formatNumber(element);
                }
                if (key === 'certNo') {
                  var $temp = $this.prev();
                  if (v['certType'] === '2') {
                    element = '粤' + v['year'] + '不动产权第' + element + '号';
                    $temp.text('不动产证号');
                  } else {
                    $temp.text('房产证号');
                  }
                } else if (key === 'queryType') {
                  element = element > 1 ? '分栋' : '分户';

                } else if (key === 'personInfo') {
                  var $temp = $this.prev();
                  if (v['ownerType'] === '2') {
                    $temp.text('单位名称');
                  } else {
                    $temp.text('身份证号/姓名');
                  }
                }
                $this.text(element);
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

  $.init();
});
