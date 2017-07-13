  $(function() {

    addItem({});

    var loading = false;
    var maxItems = 100;
    var numbPage = 1;
    var search = $('#search');

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

        if (search.val().trim()) {
          params = {
            keyWords: search.val()
          };
        } else {
          params = {};
        }

        addItem($.extend({
          currentPage: numbPage
        }, params));

        $.refreshScroller();
      }, 1000);

    });

    function addItem(opts) {
      $.ajax({
        url: '/qfang-xdtapi/customRelation/serviceStar',
        data: {
          pageSize: opts.pageSize || 20,
          currentPage: opts.currentPage || 1,
          type: 'bindingUser',
          keyWords: opts.keyWords || '',
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

              if (!val.photoUrl) {
                val.photoUrl = 'images/avatar-unknown.png';
              }

              str += '<li class="line-bottom" data-id="' + val.personId + '">' +
                ' <div class="item-content star-item"> ' +
                '   <div class="item-media"> ' +
                '<div class="star-person" style="background-image: url(' + val.photoUrl + ')"></div></div>' +
                '   <div class="item-inner"> ' +
                '     <div class="item-title-row"> ' +
                '       <div class="item-title">' + val.name + '</div> ' +
                '     </div> ' +
                '     <div class="item-subtitle">' + val.cell + '</div> ' +
                '   </div><div class="item-input"></div> ' +
                ' </div> ' +
                ' </li>';
            });
            if(opts.currentPage > 1){
              $('#customer-wrapper').append(str);
            }else{
              $('#customer-wrapper').empty().append(str);
            }
            maxItems = data.data.recordCount;
            $('#customer-wrapper').find('li').on('click', function() {
              var inputWrapper = $(this).find('.item-input');
              if (inputWrapper.has('div').length) {
                this.style.backgroundColor = '#fff';
                $(this).siblings().find('.item-input').has('div').empty();
                inputWrapper.empty();
              } else {
                $(this).siblings().css({ backgroundColor: '#fff' });
                this.style.backgroundColor = '#cfe3cd';
                $(this).siblings().find('.item-input').has('div').empty();
                inputWrapper.append('<div class="single-checkbox"><i class="iconfont icon-weibiaoti521"></i></div>');
              }
            });

          } else {
            $('#customer-wrapper').empty().append('<div class="no-data">暂无数据</div>');
            $('.infinite-scroll-preloader').empty();
          }
        }
      });
    };

    //submit data
    $('.js-submit').on('click', function() {
      var checkedCustomer = $('#customer-wrapper li').find('.item-input').has('div');
      if (checkedCustomer.length) {
        var id = checkedCustomer.parents('li').attr('data-id');
        $.ajax({
          url: '/qfang-xdtapi/customRelation/bindingUser',
          data: {
            customermanagerId: id
          },
          success: function(data) {
            $.alert(data.msg, function() {
              WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
            });
          }
        });
      } else {
        $.toast('请选择一个客户经理！');
      }
    });

    $(document).on('click', '.js-search', function() {
      var keyWords = $('#search').val();
      addItem({ keyWords: keyWords });
    });
    $.init();
  });
