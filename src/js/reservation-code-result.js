$(function() {
  var urlParams = $.unparam(location.search.substring(1));
  var $houseCont = $('.house-cont');
  var $symbolCont = $('.symbol-cont');
  var $publicBtn = $('#publicBtn');

  initData();

  function initData() {

    $.ajax({
      url: '/trade-util/book/loadHistorySingle.json',
      data: { id: urlParams.id },
      beforeSend: function() {
        $.showPreloader();
      },
      success: function(data) {
        var items = data;
        if (items.code == 'ok') {
          if (items.data.bookingType == '-1060') {
            $houseCont.addClass('dn');
            $symbolCont.removeClass('dn');
          } else {
            $symbolCont.addClass('dn');
            $houseCont.removeClass('dn');
          }

          var workTime = items.data.workTimeSoltName;
          var bookingTime = items.data.bookingDateStr + ' ' + workTime.slice(workTime.indexOf('-')+1, workTime.length);

          var newDate = new Date();
          var bookingDate = new Date(bookingTime);
          var id = items.data.id;
          var timeFlag = false;

          if(bookingDate.getTime() < newDate.getTime()) {
            timeFlag = true;
          }

          $.each(items.data, function(k, v) {
            if (k == 'registrationAreaName') {
              var index = v.indexOf('（');
              $('.' + k + '').text(v.slice(0, index - 1));
            } else if(k == 'phoneNumber') {
              $('.' + k + '').text(v).attr('href', 'tel:'+ v +'');
            } else if (k == 'status') {
              var statusHtml = '';
              if (v == 1) {
                statusHtml = '未预约';
                $publicBtn.text('预约取号').attr('href','/tools-version/reservation-code.html?id='+ id +'');
              } else if (v == 2) {
                statusHtml = '已预约';
                if(timeFlag) {
                  statusHtml = '已过期';
                  $publicBtn.text('重新预约').attr('href','/tools-version/reservation-code.html?id='+ id +'');
                } else {
                  $publicBtn.text('取消预约').data('type', 'cancel').data('id', id);
                }
              } else if (v == 3) {
                statusHtml = '已取消';
                $publicBtn.text('重新预约').attr('href','/tools-version/reservation-code.html?id='+ id +'');
              }

              $('.status').text(statusHtml);
            } else {
              $('.' + k + '').text(v);
            }
          });
        } else {
          $.toast(items.msg);
        }

      },
      complete: function() {
        $.hidePreloader();
      }
    });
  }


  $publicBtn.on('click', function() {
    var self = $(this);
    if(self.data('type') == 'cancel') {
      $.ajax({
        url: '/trade-util/book/cancelBooking.json',
        data: {id: self.data('id')},
        success: function(data) {
          $.toast(data.msg);
          $('.status').text('已取消');
          $publicBtn.text('重新预约').attr('href','/tools-version/reservation-code.html?id='+ self.data('id') +'');
        }
      })
    }
  })
});
