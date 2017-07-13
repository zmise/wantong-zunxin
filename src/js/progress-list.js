$(function() {

    $(document).on("click", ".tab-link", function(e) {
      e.preventDefault();
      var clicked = $(this);
      var flag = clicked.attr('href');
      if (flag == '#tab1') {
        location.href = 'redeem-house.html';
        return false;
      }
    });

    addItem({});

    var loading = false;
    var maxItems = 100;
    var numbPage = 1;

    $(document).on('infinite', '.infinite-scroll-bottom', function() {

        if (loading) {
          return;
        }

        loading = true;
        numbPage++;
        setTimeout(function() {
          loading = false;
          if (numbPage * 20 >= maxItems) {
            $.detachInfiniteScroll($('.infinite-scroll'));
            $('.infinite-scroll-preloader').empty();
            return;
          }

          addItems({
            currentPage: numbPage
          });

          $.refreshScroller();
        }, 1000);

    });

    function addItem(opts) {

      $.ajax({
        url: '/qfang-xdtapi/atoneSearch/search',
        data: {
          flag: 'atone',
          pageSize: opts.pageSize || 20,
          currentPage: opts.currentPage || 1
        },
        beforeSend: function() {
          if (!$('.infinite-scroll-preloader').find('.preloader').length) {
            $('.infinite-scroll-preloader').html('<div class="preloader"></div>');
          }
          //listContainer.parent().find('.no-data').remove();
        },
        success: function(data) {
          if (data.code === 'C0000') {

            if (data.data.pageCount === 1) {
              $('.infinite-scroll-preloader').empty();
            }
            var str = '';
            var statusList = {
              'SUBMIT': 'green',
              'BUSINESS_FINISH': 'green',
              'CANCEL': 'red'
            };

            $.each(data.data.items, function(index, val) {

              var status = statusList[val.billState.value] ? statusList[val.billState.value] : 'orange';

              var code = status === 'red' ? '522' : '521';

              str += '<li class="line-bottom">' +
                '     <a href="progress-detail.html?id=' + val.id + '" class="item-link item-content" external>' +
                '       <div class="item-inner">' +
                '         <div class="item-subtitle">' + val.gardenName + ' ' + val.buildingName + ' ' + val.roomNumber + '</div>' +
                '         <div class="item-text">' + val.createTime + '</div>' +
                '       </div>' +
                '       <div class="item-media status-' + status + '"><i class="iconfont icon-weibiaoti' + code + '">' + val.billState.desc + '</i></div>' +
                '     </a>' +
                '   </li>';
            });
            $('.progress-list').append(str);
            maxItems = data.data.recordCount;
          }else if(data.code === 'C0008'){
              $('.infinite-scroll-preloader').empty();
              $('.progress-list').after('<div class="no-data">暂无数据</div>');
          }
        }

      });

    }
    $.init();
  });
