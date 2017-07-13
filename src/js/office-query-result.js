$(function() {
  var urlParams = $.unparam(location.search.substring(1));
  var $resultContent = $('#resultContent');
  var $againSearch = $('#againSearch');
  var queryTime = null;
  var currentTime = null;

  function initData() {
    var deferred = $.Deferred();
    $.ajax({
      url: '/trade-util/banwen/loadHistorySingle.json',
      data: { id: urlParams.id },
      beforeSend: function() {
        $.showPreloader();
      },
      success: function(data) {
        var items = data;
        if (items.code == 'ok') {
          $.each(items.data.info, function(k, v) {
            $('.' + k + '').text(v);
          });

          currentTime = items.data.info.currentTime;
          var resultHtml = '';
          $.each(items.data.list, function(k, v) {
            if(k == 0) {
              queryTime = v.createTime;
            }

            resultHtml += '<div class="content-block-title"><span class="result-numb">' + (k + 1) + '</span>查询结果</div><div class="list-block popup-list"><ul>';

            resultHtml += '<li><div class="item-content">' +
              '<div class="item-inner">' +
              '<label class="item-title short-label label" for="consult">受理时间:</label>' +
              '<div class="item-input dealTime">' + v.dealTime + '</div>' +
              '</div>' +
              '</div>' +
              '</li>' +
              '<li>' +
              '<div class="item-content">' +
              '<div class="item-inner">' +
              '<label class="item-title short-label label" for="consult">答复时间:</label>' +
              '<div class="item-input answerTime">' + v.answerTime + '</div>' +
              '</div>' +
              '</div>' +
              '</li>' +
              '<li>' +
              '<div class="item-content">' +
              '<div class="item-inner">' +
              '<label class="item-title short-label label" for="consult">办理状态:</label>' +
              '<div class="item-input status">' + v.status + '</div>' +
              '</div>' +
              '</div>' +
              '</li>' +
              '<li>' +
              '<div class="item-content">' +
              '<div class="item-inner">' +
              '<label class="item-title short-label label" for="consult">查询时间:</label>' +
              '<div class="item-input createTime">' + v.createTime + '</div>' +
              '</div>' +
              '</div>' +
              '</li>';

            resultHtml += '</ul></div>';
          });

          deferred.resolve();
          $resultContent.append(resultHtml);
        } else {
          $.toast(items.msg);
          deferred.reject();
        }

      },
      complete: function() {
        $.hidePreloader();
      }
    });

    return deferred.promise();
  }

  var d1 = initData();

  $.when(d1).done(function() {
    againSearchFun();
  })

  function zeros(n) {
    return n < 10 ? '0' + n : n;
  };

  function againSearchFun() {
    if (queryTime) {
      $againSearch.prop('disabled', true);
      var beforTime = (new Date(queryTime.replace(/-/g, '/'))).getTime();
      var futureTime = beforTime + 3600000;

      if((new Date(currentTime.replace(/-/g, '/'))).getTime() - beforTime > 3600000) {
        $againSearch.prop('disabled', false);
        return;
      }

      clearInterval(time);
      var nowDate = (new Date(currentTime.replace(/-/g, '/'))).getTime();
      var t = futureTime - nowDate;
      var seconds = t / 1000;
      var time = setInterval(function() {
        seconds--;
        var minutes = Math.floor(seconds / 60);
        var cminutes = minutes % 60;
        var cSeconds = Math.floor(seconds % 60);
        if (seconds <= 0) {
          $againSearch.text('再次查询').prop('disabled', false);
          clearInterval(time);
        } else {
          $againSearch.text(zeros(minutes) + '分' + zeros(cSeconds) + '秒');
        }
      }, 1000);
    } else {
      $againSearch.prop('disabled', false);
    }
  }

  $againSearch.on('click', function() {
    var self = $(this);
    $.ajax({
      url: '/trade-util/banwen/query.json',
      type: 'POST',
      data: { id: urlParams.id },
      beforeSend: function() {
        self.prop('disabled', true);
        $.showPreloader();
      },

      success: function(data) {
        if (data.code == 'ok') {
          var items = data.data;
          var resultHtml = '';
          var $resultNumb = $resultContent.find('.result-numb');

          $.each($resultNumb, function(k, v) {
            var text = $(v).text();
            $(v).text(Number(text) + 1);
          });

          resultHtml += '<div class="content-block-title"><span class="result-numb">1</span>查询结果</div><div class="list-block popup-list"><ul>';

          resultHtml += '<li><div class="item-content">' +
            '<div class="item-inner">' +
            '<label class="item-title short-label label" for="consult">受理时间:</label>' +
            '<div class="item-input dealTime">' + items.dealTime + '</div>' +
            '</div>' +
            '</div>' +
            '</li>' +
            '<li>' +
            '<div class="item-content">' +
            '<div class="item-inner">' +
            '<label class="item-title short-label label" for="consult">答复时间:</label>' +
            '<div class="item-input answerTime">' + items.answerTime + '</div>' +
            '</div>' +
            '</div>' +
            '</li>' +
            '<li>' +
            '<div class="item-content">' +
            '<div class="item-inner">' +
            '<label class="item-title short-label label" for="consult">办理状态:</label>' +
            '<div class="item-input status">' + items.status + '</div>' +
            '</div>' +
            '</div>' +
            '</li>' +
            '<li>' +
            '<div class="item-content">' +
            '<div class="item-inner">' +
            '<label class="item-title short-label label" for="consult">查询时间:</label>' +
            '<div class="item-input createTime">' + items.createTime + '</div>' +
            '</div>' +
            '</div>' +
            '</li>';
          resultHtml += '</ul></div>';

          $resultContent.prepend(resultHtml);
          queryTime = items.createTime;
          currentTime = items.currentTime;
          againSearchFun();
        } else {
          self.prop('disabled', false);
        }
      },

      complete: function() {
        $.hidePreloader();
      }
    });
  });
});
