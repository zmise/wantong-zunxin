$(function () {
  dataLayer.push(JSON.parse(sessionStorage.getItem('userInfo.dataLayer')));

  //提单状态信息
  $.ajax({
    url: '/qfang-credit/wx/order/orderListStatistics.json',
    dataType: 'json',
    type: 'GET'
  }).done(function (res) {
    // console.log(res);
    if (res.code != 'ok') {
      return;
    }
    var object = res.data;
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        $('#' + key).text(object[key]);
      }
    }
  });


  var pageIndex = 1;
  var pageSize = 15;
  var pages = 1;
  var type = $('.lading-tab .active').data('val');
  var loading = false;
  var $container = $('#listBlock');
  var $contBox = $container.parent();
  var temp = ['id', 'gender', 'lenderName', 'lenderCellphone', 'createTime', 'lenderAmount', 'status', 'productMatcherName', 'productMatcherPhone'];

  function getStatus(key) {
    switch (key) {
      case 1: return '待处理';
      case 2: return '正在沟通';
      case 3: return '客户拒绝';
      case 4: return '正在办理';
      case 5: return '办理成功';
      case 6: return '办理失败';
      default: return '';
    }
  }

  function addItems(list) {
    var doc = document.createDocumentFragment();
    var i = 0, len = list.length;
    for (; i < len; i++) {
      var tempHTML = $('#tempLate')[0].innerHTML;
      var item = list[i];
      var j = 0, l = temp.length;
      for (; j < l; j++) {
        var key = temp[j];
        if (item.hasOwnProperty(key)) {
          var element = item[key];
          switch (key) {
            case 'gender':
              element = element === 1 ? '男' : '女';
              break;
            case 'lenderAmount':
              element = element > 0 ? (element + '元') : '&nbsp;';
              break;
            case 'status': element = getStatus(element);
              break;
          }
          tempHTML = tempHTML.replace(new RegExp('{' + key + '}', 'g'), element);
        }
      }
      tempHTML = $(tempHTML);
      if (!item.productMatcherPhone) {
        tempHTML.find('.list-box').hide();
      }
      if (item.gender > 1) {
        tempHTML.find('.list-gender').addClass('w');
      }
      doc.appendChild(tempHTML[0]);
    }

    $container.append(doc);
    $.refreshScroller();
  }

  function noData(bool) {
    if (bool) {
      $('.record-no-data').show();
      $('.lading-btn').hide();
    } else {
      $('.record-no-data').hide();
      $('.lading-btn').show();
    }
  }

  function fetchData() {
    noData(false);
    if (pageIndex === 1) {
      // 第一页 清空容器，重置滚动条到顶部
      $contBox.scrollTop(0);
      $container.empty();
    }
    $.ajax({
      url: '/qfang-credit/wx/order/listData.json',
      type: 'GET',
      dataType: 'json',
      data: {
        pageIndex: pageIndex,
        sizePerPage: pageSize,
        status: type
      }
    }).done(function (res) {
      // console.log(res);
      if (res.code !== 'ok') {
        return;
      }

      // 已获取数据
      loading = false;
      if (!res.data.list.length) {
        pageIndex === 1 && noData(true);
      } else {
        addItems(res.data.list);
      }

      // 总页数
      pages = res.data.paginator.pages;
      // 如果请求的是最后一页
      if (pageIndex === pages || res.data.list.length === 0) {
        $('.infinite-scroll-preloader').hide();
        $.detachInfiniteScroll($contBox);
      }
    });
  }
  // 切换状态
  $(document).on('click', '.lading-tab .tab-item', function () {
    type = $(this).data('val');

    $.attachInfiniteScroll($contBox);

    // 设置页码
    pageIndex = 1;
    fetchData();

    // 设置flag
    loading = true;
    $(this).addClass('active').siblings().removeClass('active');

    // 
  }).on('click', '#listBlock .list-card', function () {
    location.assign('./personal-lading-detail.html?id=' + $(this).data('id'));

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