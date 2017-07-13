$(function() {

  var loading = false;
  var maxItems = 40;
  var numbPage = 1;
  var pageSize = 20;
  var search = $('#search');

  $(document).on('infinite', '.infinite-scroll', function() {
    if (loading) {
      return;
    }

    loading = true;
    numbPage++;
    setTimeout(function() {
      loading = false;
      if (numbPage * pageSize > maxItems) {
        $.detachInfiniteScroll($('.infinite-scroll'));
        hideLoading();
        return;
      }

      if (search.val().trim()) {
        params = {
          gardenId: search.val()
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
    pageSize = opts.pageSize || pageSize;
    numbPage = opts.currentPage || numbPage;
    var listContainer = $('#listCont .asc-list');
    $.ajax({
      url: '/qfang-xdtapi/tools/schoolGardenSearch/school',
      // url: '/data/test.json',
      data: {
        pageSize: pageSize,
        currentPage: numbPage,
        gardenId: opts.gardenId
      },
      beforeSend: function() {
        // $('#searchList').empty().html('<li><a class="asch-bottom" href="javascript:;">查询中……</a></li>');
        showLoading();
        isNodata(false);
      },
      success: function(data) {
        if (data.code === 'ok') {
          $('#schoolN').text('共找到' + data.recordCount + '所学校');
          maxItems = data.recordCount;
          // console.log(maxItems, pageSize, numbPage);
          if (data.recordCount <= pageSize) {
            hideLoading();
          }

          var data = data.list;
          var len = 0;
          var html = '';
          if (data && data.length > 0) {
            len = data.length;
            for (var i = 0; i < len; i++) {
              var item = data[i];
              if (!item.smallSizeUrl) {
                item.smallSizeUrl = 'images/nopic.png';
              }

              html += '<li><a class="asc-list-content external" href="' + item.schoolDetailURL + '"><div class="pic"><img src="' + item.smallSizeUrl + '" alt=""></div><div class="cont"><h3 class="ellips">' + html2Escape(item.name) + '</h3><p class="box-middel tap"><span class="ellips flex">' + item.gardenCount + '个划片小区</span></p><p class="box-middel tip"><span>' + (item.area ? item.area : '') + '</span><span>' + (item.geographyArea ? item.geographyArea : '') + '</span></p> <p class="box-middel tag"><span>' + (item.subType ? item.subType : '') + '</span><span>' + (item.grade ? item.grade : '') + '</span><span>' + (item.entranceWay ? item.entranceWay : '') + '</span></p></div></a></li>';
            }
            listContainer.append(html);
          } else {
            isNodata(true);
          }

        }

      }
    });
  };

  /* 搜索栏的历史记录 */
  var MaxLength = 10;
  var HistoryKey = 'history' + window.sessionStorage.getItem('u');

  /* 存储历史记录 */
  function storeHistory(item) {
    var data = window.localStorage.getItem(HistoryKey);
    var list = data ? JSON.parse(data) : [];
    var i = 0;
    var len = list.length;
    for (; i < len; i++) {
      var temp = list[i];
      if (temp.id == item.id) {
        list.splice(i, 1);
        break;
      }
    }
    list.unshift(item);

    list.splice(MaxLength);

    window.localStorage.setItem(HistoryKey, JSON.stringify(list));
    // getHistory();
  }

  /* 清除历史记录 */
  function clearHistory() {
    window.localStorage.setItem(HistoryKey, '');
    getHistory();
  }

  /* 获取历史记录 */
  function getHistory() {
    var data = window.localStorage.getItem(HistoryKey);
    var list = data ? JSON.parse(data) : [];
    getSList(list, true);
  }

  /* 生成搜索选择列表 */
  function getSList(data, history) {
    var searchList = $('#searchList');
    var html = '';
    searchList.empty().show();

    if (data && data.length) {
      for (var i = 0, len = data.length; i < len; i++) {
        html += '<li><div><a class="asc-list-content" href="javascript:;" data-id="' +
          data[i].id + '"><span class="js-name ellips w50">' + html2Escape(data[i].name) + '</span><span class="js-eare">' +
          data[i].area + '-' + data[i].geographyArea + '</span></a></div></li>';
      }

      if (history) html += '<li><a class="asch-bottom js-clear" href="javascript:;"><span class="iconfont icon-qingkong"></span>清空历史</a></li>';
    } else {
      html += '<li><a class="asch-bottom" href="javascript:;">' +
        (history ? '暂无历史记录' : '抱歉，没有找到相关小区') + '</a></li>';
    }
    searchList.html(html);
  }

  /* 清空查询列表   */
  function clearList() {
    $('#listCont .asc-list').empty();
  }

  /* 重置查询列表   */
  function resetList() {
    $('#schoolN').empty();
    isNodata(false);
    clearList();
    hideLoading();
  }

  /* 是否无数据  */
  function isNodata(bool) {
    var obj = $('.asc-nodata');
    bool ? obj.removeClass('dn') : obj.addClass('dn');
  }

  /* 隐藏数据加载中  */
  function hideLoading() {
    $('.asc-list-loader').addClass('dn');
  }
  /* 隐藏数据加载中  */
  function showLoading() {
    $('.asc-list-loader').removeClass('dn');
  }

  function setSearch(str) {
    search.val(str);
  }


  /* 搜索小区 */
  $('#search').on('keyup', function() {
    resetList();
    if (this.value.length > 0) {
      searchHandle(this.value);
    } else {
      clearSList();
    }

  });
  /* 清空搜索列表 */
  function clearSList() {
    setSearch('');
    search.focus();
    resetList();
    getHistory();
  }

  /* 清空历史记录 */
  $('#searchList').on('click', '.js-clear', clearHistory);

  /* 搜索学校 */
  $('#searchList').on('click', '.asc-list-content', function() {
    var gardenId = $(this).data('id');
    var name = $(this).find('.js-name').text();
    var eare = $(this).find('.js-eare').text().split('-');
    setSearch(name);
    $('#searchList').hide();

    clearList();
    showLoading();
    $.attachInfiniteScroll($('.infinite-scroll'));
    addItem({
      gardenId: gardenId,
      currentPage: 1
    });

    var item = {
      id: gardenId,
      name: name,
      area: eare[0],
      geographyArea: eare[1]
    };
    storeHistory(item);

  });

  $('#searchDel').on('click', clearSList);

  function searchHandle(searchName) {
    $.ajax({
      url: '/qfang-xdtapi/tools/schoolGardenSearch/garden',
      data: {
        searchName: searchName
      },
      beforeSend: function() {
        $('#searchList').empty().html('<li><a class="asch-bottom" href="javascript:;">查询中……</a></li>').show();
      },
      success: function(data) {
        getSList(data.list);
      }
    });
  }

  // html 转义
  function html2Escape(sHtml) {
    return sHtml ? sHtml.replace(/[<>&"]/g, function(c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    }) : '';
  }


  /*
    初始化
   */
  function init() {
    $.init();
    // 显示历史记录，隐藏列表
    resetList();
    getHistory();
  }

  init();
});
