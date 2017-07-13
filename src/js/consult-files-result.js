$(function() {
  var urlParams = $.unparam(location.search.substring(1));
  var $resultContent = $('#resultContent');
  var $againSearch = $('#againSearch');
  var queryTime = null;
  var currentTime = null;

  function initData() {
    var deferred = $.Deferred();
    $.ajax({
      url: '/trade-util/houseInfo/loadHistorySingle.json',
      data: { id: urlParams.id },
      beforeSend: function () {
        $.showPreloader();
      },

      success: function (data) {
        var items = data;
        if (items.code == 'ok') {
          $.each(items.data.info, function (k, v) {
            if (k == 'certType') {
              if (v == 1) {
                $('#' + k + '').text('分户');
              } else {
                $('#' + k + '').text('分栋');
              }
            } else {
              $('#' + k + '').text(v);
            }

          });

          var resultHtml = '';

          $.each(items.data.list, function (k, v) {
            resultHtml += '<div class="content-block-title"><span class="result-numb">' + (k + 1) + '</span>查询结果</div><div class="list-block popup-list"><ul>';
            if (!v.result) {
              resultHtml += '<li><div class="item-content">' +
                '<div class="item-inner">' +
                '<div class="item-input no-result">没有找到匹配的房产记录</div>' +
                '</div></div></li>';
            } else {
              var basicArry = v.result.split('房产详细资料：')[0].replace(/<[^>]+>/g, "").split('  ');
              var propertyArry = v.result.split('房产详细资料：')[1].split('  ');

              $.each(basicArry, function (n, m) {
                var className = '';
                if (n == 0) {
                  className = 'long';
                }

                var resultItems = m.split('：');
                resultHtml += '<li><div class="item-content">' +
                  '<div class="item-inner">' +
                  '<label class="item-title short-label label ' + className + '" for="consult">' + resultItems[0] + ':</label>' +
                  '<div class="item-input">' + resultItems[1] + '</div>' +
                  '</div></div>' +
                  '</li>';
              });

              resultHtml += '</ul></div><div class="content-block-title subtitle">房产详细资料</div><div class="list-block popup-list"><ul class="house-detail">';
              $.each(propertyArry, function (z, j) {
                var resultItems = j.split('：');
                resultHtml += '<li><div class="item-content">' +
                  '<div class="item-inner">' +
                  '<label class="item-title short-label label" for="consult">' + resultItems[0] + ':</label>' +
                  '<div class="item-input">' + resultItems[1] + '</div>' +
                  '</div></div></li>';
              });
            }

            resultHtml += '<li><div class="item-content">' +
              '<div class="item-inner">' +
              '<label class="item-title short-label label" for="consult">查询时间:</label>' +
              '<div class="item-input">' + v.createTime + '</div>' +
              '</div></div></li></ul></div>';
          });

          resultHtml += '</div>';
          $resultContent.empty().append(resultHtml);

          queryTime = items.data.list[0].createTime;
          currentTime = items.data.info.currentTime;
          deferred.resolve();
        } else {
          $.toast(items.msg);
          deferred.reject();
        }

      },

      complete: function () {
        $.hidePreloader();
      }
    });

    return deferred.promise();
  }

  var d1 = initData();
  $.when(d1).done(function () {
    againSearchFun();
  });

  function zeros(n) {
    return n < 10 ? '0' + n : n;
  };

  function againSearchFun() {
    if (queryTime) {
      $againSearch.prop('disabled', true);
      var beforTime = new Date(queryTime.replace(/-/g, '/')).getTime();
      var futureTime = beforTime + 3600000;

      if ((new Date(currentTime.replace(/-/g, '/'))).getTime() - beforTime > 3600000) {
        $againSearch.prop('disabled', false);
        return;
      }

      clearInterval(time);
      var nowDate = (new Date(currentTime.replace(/-/g, '/'))).getTime();
      var t = futureTime - nowDate;
      var seconds = t / 1000;
      var time = setInterval(function () {
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

  $againSearch.on('click', function () {
    var self = $(this);
    $.ajax({
      url: '/trade-util/houseInfo/query.json',
      type: 'POST',
      data: { id: urlParams.id },
      beforeSend: function () {
        self.prop('disabled', true);
        $.showPreloader();
      },

      success: function (data) {
        $.toast(data.msg);
        if (data.code == 'ok') {
          var itemsResult = data.data.result;

          var $resultNumb = $resultContent.find('.result-numb');

          var resultHtml = '<div class="content-block-title"><span class="result-numb">1</span>查询结果</div><div class="list-block popup-list"><ul>';

          $.each($resultNumb, function (k, v) {
            var text = $(v).text();
            $(v).text(Number(text) + 1);
          });

          if (!itemsResult) {
            resultHtml += '<li><div class="item-content">' +
              '<div class="item-inner">' +
              '<div class="item-input no-result">没有找到匹配的房产记录</div>' +
              '</div></div></li>';
          } else {
            var basicArry = itemsResult.split('房产详细资料：')[0].replace(/<[^>]+>/g, "").split('  ');
            var propertyArry = itemsResult.split('房产详细资料：')[1].split('  ');


            $.each(basicArry, function (n, m) {
              var className = '';
              if (n == 0) {
                className = 'long';
              }

              var resultItems = m.split('：');
              resultHtml += '<li><div class="item-content">' +
                '<div class="item-inner">' +
                '<label class="item-title short-label label ' + className + '" for="consult">' + resultItems[0] + ':</label>' +
                '<div class="item-input">' + resultItems[1] + '</div>' +
                '</div></div>' +
                '</li>';
            });

            resultHtml += '</ul></div><div class="content-block-title subtitle">房产详细资料</div><div class="list-block popup-list"><ul class="house-detail">';
            $.each(propertyArry, function (z, j) {
              var resultItems = j.split('：');
              resultHtml += '<li><div class="item-content">' +
                '<div class="item-inner">' +
                '<label class="item-title short-label label" for="consult">' + resultItems[0] + ':</label>' +
                '<div class="item-input">' + resultItems[1] + '</div>' +
                '</div></div></li>';
            });
          }

          resultHtml += '<li><div class="item-content">' +
            '<div class="item-inner">' +
            '<label class="item-title short-label label" for="consult">查询时间:</label>' +
            '<div class="item-input">' + data.data.createTime + '</div>' +
            '</div></div></li></ul></div>';

          $resultContent.prepend(resultHtml);
          queryTime = data.data.createTime;
          currentTime = data.data.currentTime;
          againSearch();
        } else {
          self.prop('disabled', false);
        }
      },

      complete: function () {
        $.hidePreloader();
      }
    });
  });
});
