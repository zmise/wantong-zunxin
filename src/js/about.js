$(function() {
    //get customer-list

    // addItem({});

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

    function addItem(opts){
      $.ajax({
      url: '/qfang-xdtapi/customRelation/serviceStar',
      data:{
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
        if (data.code === 'C0000' && data.data.items.length) {
          if (data.data.pageCount === 1) {
            $('.infinite-scroll-preloader').empty();
          }
          var str = '';
          $.each(data.data.items, function(index, val) {
            if (index < 3) {
              str += '<li class="line-bottom">' +
                ' <div class="item-content star-item"> ' +
                '   <div class="item-media"> ' +
                '   <i class="iconfont icon-huangguan"></i> ' +
                '<div class="star-person" style="background-image: url(' + val.photoUrl + ')"></div></div>' +
                '   <div class="item-inner"> ' +
                '     <div class="item-title-row"> ' +
                '       <div class="item-title">' + val.name + '</div> ' +
                '     </div> ' +
                '     <div class="item-subtitle">' + val.cell + '</div> ' +
                '     <i class="iconfont icon-jiangpai"><span class="sort-num">' + (index+1) + '</span></i> ' +
                '   </div> ' +
                ' </div> ' +
                ' </li>';
            } else {
              str += '<li>' +
                ' <div class="item-content star-item"> ' +
                '   <div class="item-media"> ' +
                '<div class="star-person" style="background-image: url(' + val.photoUrl + ')"></div></div>' +
                '   <div class="item-inner"> ' +
                '     <div class="item-title-row"> ' +
                '       <div class="item-title">' + val.name + '</div> ' +
                '     </div> ' +
                '     <div class="item-subtitle">' + val.cell + '</div> ' +
                '     <span class="sort-num single-sort-num">' + (index+1) + '</span> ' +
                '   </div> ' +
                ' </div> ' +
                ' </li>';
            }
          });
          $('#customer-wrapper').append(str);
          maxItems = data.data.recordCount;
        }
      }
      });

    }
    $.init();
  });
