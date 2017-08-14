$(function () {
  function init() {
    var items = $('span[id]:visible');
    for (var i = 0, len = items.length; i < len; i++) {
      var ids = items[i].id;
      var val = JSON.parse(sessionStorage.getItem(ids + 'loanSearch'));
      if (!val) {
        continue;
      }

      $('[data-popup="' + ids + '"]').find('[data-val="' + val['val'] + '"]').trigger('click', 'reload');
      if (ids === 'crowdId') {
        items = $('span[id]:visible');
        len = items.length;
      }
    }
  }

  function showCrowd(opt) {
    var $animate = $(opt.container);
    // var className = opt.animateClass || 'an-top2bottom';
    if (opt.show) {
      $animate.show();
      // setTimeout(function () {
      //   $animate.addClass(className);
      // }, 0);
    } else {
      // $animate.removeClass(className);
      // setTimeout(function () {
      //   $animate.hide();
      // }, 400);

      $animate.hide();
    }
  }


  $('.popup').on('click', '.forms-inner', function (e, data) {
    var $this = $(this);
    var $parent = $this.closest('.forms-list');
    var ids = $parent.parent().data('popup');
    var tempdata;
    $parent.find('.selected').removeClass('selected');
    $this.addClass('selected');
    $('#' + ids).text($this.text());
    $.closeModal();

    if (ids === 'crowdId') {
      showCrowd({
        container: $('#' + ids).closest('li').next(),
        show: $this.data('val') === '28bdd5f3-8a01-4329-9558-949f83dadec7'
      });

    }

    if (sessionStorage && data !== 'reload') {
      tempdata = $this.data();
      tempdata.name = $('#' + ids).parent().prev().text().replace(/[*]/g, '');
      tempdata.option = $.trim($this.text());
      // if (!$this.data('val')) {
      // sessionStorage.removeItem(ids + 'loanSearch');
      // return;
      // }
      sessionStorage.setItem(ids + 'loanSearch', JSON.stringify(tempdata));
    }
  });

  $('.content').on('click', '.forms-inner', function (e) {
    var ids = $(this).data('popup');
    $.popup('.popup');
    $('.popup').find('[data-popup="' + ids + '"]').show().siblings().hide();
  });

  $(document).on('click', '.popup-overlay', function (e) {
    $.closeModal();
    $('.popup-overlay').removeClass('modal-overlay-visible');
  });

  // 搜索
  $('#search').on('click', function (e) {
    var items = $('span[id]:visible');
    var search = [];
    var remarkIndex = 1;
    var loanremark = '';
    for (var i = 0, len = items.length; i < len; i++) {
      var ids = items[i].id;
      var val = JSON.parse(sessionStorage.getItem(ids + 'loanSearch'));
      var value;
      if (!val) {

        // 额度 必填
        if (ids === 'amount') {
          $.toast("客官，选一下申请额度吧");
          return;
        }

        continue;
      }

      value = val['val'];

      // 额度 特殊处理
      if (ids === 'amount') {
        search.push('minLoanAmount=' + val['minloanamount']);
        search.push('maxLoanAmount=' + val['maxloanamount']);

        loanremark += remarkIndex + '.申请额度：' + val['option'] + '；';
        remarkIndex++;
      } else if (value != -1) {
        search.push(ids + '=' + value);
        loanremark += remarkIndex + '.' + val['name'] + '：' + val['option'] + '；';
        remarkIndex++;
      }

    }
    sessionStorage.setItem('loanremark',loanremark);

    searchTool.clearHistory(sessionStorage.getItem('token') + 'loanProductIds');
    // return;
    window.location = 'loan-search.html?' + search.join('&');
  });

  init();
});
