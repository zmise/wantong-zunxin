$(function() {

  var $consultList = $('#consultList');
  var loading = false;
  var maxItems = 100;
  var pageIndex = 1;

  $('#officeQuery').on('click', function () {
    window.location.replace('./office-query.html');
    return false;
  });

  function addItems(params) {
    var html = '';
    var data = $.extend({
      pageIndex: 1
    }, params);

    $.ajax({
      url: '/trade-util/banwen/loadQueryHistory.json',
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
            html += '<li>' +
              '<a href="./office-query-result.html?id=' + v.id + '" class="external">' +
              '<div class="row">' +
              '<span class="col-40 field-name">办文编号:</span>' +
              '<span>' + v.doc_no + '</span>' +
              '<span class="success">' + v.status + '</span>' +
              '</div>' +
              '</a>' +
              '</li>';
          });

          $consultList.empty().append(html);
          maxItems = data.data.page.totalCount;
        }
      },

      complete: function() {
        $('.infinite-scroll-preloader').empty();
      }
    })
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

})
