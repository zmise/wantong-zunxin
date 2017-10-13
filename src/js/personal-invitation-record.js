$(function () {
  dataLayer.push(JSON.parse(sessionStorage.getItem('userInfo.dataLayer')));


  //邀请信息
  $.ajax({
    url: '/qfang-credit/userCenter/inviteRecordStatistics.json',
    dataType: 'json',
    type: 'GET'
  }).done(function (res) {
    // console.log(res);
    if (res.code != 'ok') {
      return;
    }
    $('#inviteNo,#inviteNum').text(res.data.inviteNum);
    $('#successedNum').text(res.data.successedNum);
    $('#income').text(res.data.income || 0);
  });


  var pageIndex = 1;
  var pageSize = 15;
  var maxIndex = 1;
  var type = $('.infos-tab-item.cur').data('val');
  var loading = false;
  var staticPic = './images/avatar-unknown.png';
  var $container = $('#listBlock');
  var $contBox = $container.parent();

  function addItems(list) {
    var _html = '';
    var i = 0, len = list.length;
    for (; i < len; i++) {
      var tempHTML = $('#tempLate')[0].innerHTML;
      var item = list[i];
      for (var key in item) {
        var element = item[key];
        if (!element) {
          if (key === 'headimgUrl') {
            element = staticPic;
          } else if (key === 'cellphone') {
            element = '未绑定手机';
          }
        }
        tempHTML = tempHTML.replace('{' + key + '}', element);
      }
      _html += tempHTML;
    }

    $container.append(_html);
  }


  function fetchData() {
    if (pageIndex === 1) {
      // 第一页 清空容器，重置滚动条到顶部
      $contBox.scrollTop(0);
      $container.empty();
    }
    $.ajax({
      url: '/qfang-credit/userCenter/inviteRecords.json',
      type: 'GET',
      dataType: 'json',
      data: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        type: type
      }
    }).done(function (res) {
      // console.log(res);
      if (res.code !== 'ok') {
        return;
      }
      loading = false;
      res.data.list.length && addItems(res.data.list);

      // 总页数
      maxIndex = res.data.paginator.pages;
      if (pageIndex === maxIndex || res.data.list.length === 0) {
        $('.infinite-scroll-preloader').hide();
        $.detachInfiniteScroll($contBox);
      }

    });
  }

  // 切换状态
  $(document).on('click', '.infos-tab-item', function () {
    type = $(this).data('val');

    $.attachInfiniteScroll($contBox);

    pageIndex = 1;
    fetchData();

    // 设置flag
    loading = true;

    $(this).addClass('cur').siblings().removeClass('cur');

    // 注册'infinite'事件处理函数
  }).on('infinite', '.infinite-scroll-bottom', function () {

    // 如果正在加载，则退出
    if (loading) return;

    // 设置页码
    pageIndex++;

    // 设置flag
    loading = true;
    fetchData();
  });

  fetchData();
  $.init();
});