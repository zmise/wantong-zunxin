$(function() {

  var $consultList = $('#consultList');
  var loading = false;
  var maxItems = 100;
  var pageIndex = 1;

  $('#reservationCode').on('click', function() {
    window.location.replace('./reservation-code.html');
    return false;
  });

  function addItems(params) {
    var html = '';
    var data = $.extend({
      pageIndex: 1
    }, params);

    $.ajax({
      url: '/trade-util/book/loadQueryHistory.json',
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
            var registrationAreaName = v.registrationAreaName.slice(0, v.registrationAreaName.indexOf('（') - 1);
            var statusHtml = '';
            var hrefStr = '';
            if (v.status == 1) {
              statusHtml = '<span class="button reservation-btn">预约取号</sapn>';
              hrefStr = '/tools-version/reservation-code.html?id=' + v.id + '&status=' + v.status + '';
            } else if (v.status == 2) {

              var workTime = v.workTimeSoltName;
              var bookingTime = v.bookingDateStr + ' ' + workTime.slice(workTime.indexOf('-') + 1, workTime.length);

              var newDate = new Date();
              var bookingDate = new Date(bookingTime);

              if (bookingDate.getTime() < newDate.getTime()) {
                statusHtml = '<span class="reservation-mark">已过期</sapn>';
              } else {
                statusHtml = '<div class="reservation-mark booking-code"><span>流水号后六位</span><span>' + v.bookingCode.slice(v.bookingCode.length - 6, v.bookingCode.length) + '</span></div>';
              }

              hrefStr = './reservation-code-result.html?id=' + v.id + '';

            } else if (v.status == 3) {
              statusHtml = '<span class="reservation-mark">已取消</sapn>';
              hrefStr = './reservation-code-result.html?id=' + v.id + '';
            }

            html += '<li>' +
              '<a href="' + hrefStr + '" class="external">' +
              '<div class="row">' +
              '<span class="col-90 community-name">' + v.houseName + '</span>' +
              '</div>' +
              '<div class="row">' +
              '<span class="col-25 field-name">登记点:</span>' +
              '<span>' + registrationAreaName + '</span>' +
              '' + statusHtml + '' +
              '</div>' +
              '<div class="row">' +
              '<span class="col-25 field-name">业务类型:</span>' +
              '<span>' + v.bussName + '</span>' +
              '</div>' +
              '</a>' +
              '</li>';
          });

          $consultList.append(html);
          maxItems = data.data.page.totalCount;
        }
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

  $.init();
})
