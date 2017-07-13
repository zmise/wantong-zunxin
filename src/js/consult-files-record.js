$(function() {

  var $consultList = $('#consultList');
  var loading = false;
  var maxItems = 100;
  var pageIndex = 1;

  $('#consultFiles').on('click', function() {
    window.location.replace('./consult-files.html');
    return false;
  });

  function addItems(params) {
    var html = '';
    var data = $.extend({
      pageIndex: 1
    }, params);

    $.ajax({
      url: '/trade-util/houseInfo/loadQueryHistory.json',
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

          if (data.data.pageCount === 1) {
            $('.infinite-scroll-preloader').empty();
          }

          $.each(items, function(k, v) {
            html += '<li>' +
              '<a href="./consult-files-result.html?id=' + v.id + '" class="external">' +
              '<div class="row">' +
              '<span class="col-40 field-name">权利人:</span>' +
              '<span>' + v.personInfo + '</span>' +
              '</div>' +
              '<div class="row">' +
              '<span class="col-40 field-name">房产证号:</span>' +
              '<span>' + v.certNo + '</span>' +
              '<span class="success">成功</span>' +
              '</div>' +
              '<div class="row field-name">' +
              '<span class="time">' + v.createTime + '</span>' +
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
      if ((pageIndex - 1) * 10 > maxItems && pageIndex * 10 >= maxItems) {
        $.detachInfiniteScroll($('.infinite-scroll'));
        $('.infinite-scroll-preloader').empty();
        return;
      }

      addItems({ pageIndex: pageIndex });

      $.refreshScroller();
    }, 1000);
  });

});
