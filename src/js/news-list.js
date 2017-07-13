$(function() {

    $(document).on('click', '.item-link', function() {
      location.href = 'news-detail.html?id=' + $(this).attr('data-id');
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
        url: '/qfang-xdtapi/newsinformation/search',
        data:{
          newsType: $('.recent-top').data('type'),
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
            $.each(data.data.items, function(index, val) {
              str += '<li class="line-bottom">' +
              '<a href="#" class="item-link item-content" data-id="' + val.id + '">' +
              ' <div class="item-media"><img src="' + val.icon + '" width="100" height="75"></div> ' +
              '   <div class="item-inner"> ' +
              '     <div class="item-title-row"> ' +
              '       <div class="item-title">' + val.title + '</div> ' +
              '     </div> ' +
              '     <div class="item-text">' + val.content + '</div>' +
              ' </div></a></li>';
            });
            $('.company-action').append(str);
            maxItems = data.data.recordCount;
          }else{
            $('.infinite-scroll-preloader').empty();
            $('.company-action').after('<div class="no-data">暂无数据</div>');
          }

        }
      });

    }
    $.init();
  });
