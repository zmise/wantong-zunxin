$(function() {

  var $consultList = $('#consultList');
  var loading = false;
  var maxItems = 100;
  var pageIndex = 1;

  $('#checkTransfer').on('click', function() {
    window.location.replace('./check-transfer-price.html');
    return false;
  });

  function addItems(params) {
    var html = '';
    var data = $.extend({
      pageIndex: 1
    }, params);

    $.ajax({
      url: '/trade-util/house/price/loadQueryHistory.json',
      data: data,
      beforeSend: function() {
        if (!$('.infinite-scroll-preloader').find('.preloader').length) {
          $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
        }

        $consultList.parent().find('.no-data').remove();
      },

      success: function(data) {
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

          $.each(items, function(k, v) {
            var personalTaxHtml = '';
            if (v.type == 2) {
              personalTaxHtml = '<div class="row price">' +
                '<span class="col-33">税费:</span>' +
                '<span>' + (v.totalTaxAmount).toFixed(2) + ' 元（核定）</span>' +
                '</div>';
            }

            html += ' <li>' +
              '<a href="./transfer-price-result.html?id=' + v.id + '" class="external">' +
              '<div class="row">' +
              '<span class="col-33 field-name">权利人:</span>' +
              '<span>' + v.radiobutton + '</span>' +
              '</div>' +
              '<div class="row">' +
              '<span class="col-33 field-name">身份证号:</span>' +
              '<span>' + v.id_no + '</span>' +
              '</div>' +
              '<div class="row">' +
              '<span class="col-33 field-name">房产证号:</span>' +
              '<span>' + v.cert_no + '</span>' +
              '</div>' +
              '<div class="row">' +
              '<span class="col-33 field-name">查询时间:</span>' +
              '<span>' + v.createTime + '</span>' +
              '</div>' +
              '<div class="row price">' +
              '<span class="col-33">过户价:</span>' +
              '<span>' + v.price + ' 元</span>' +
              '</div>' + personalTaxHtml + '</a>' +
              '</li>';
          });

          $consultList.append(html);
          maxItems = data.data.page.totalCount;
        }
      }
    });
  }

  addItems();

  $(document).on('infinite', '.infinite-scroll-bottom', function() {
    if (loading) {
      return;
    }

    loading = true;
    pageIndex++;
    setTimeout(function() {
      loading = false;
      if ((pageIndex - 1) * 10 >= maxItems && pageIndex * 10 >= maxItems) {
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
