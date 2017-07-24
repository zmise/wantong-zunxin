$(function () {
  var key = sessionStorage.getItem('token') + 'loanProductIds';
  var historyList = searchTool.getHistory(key);

  // 获取url带的参数
  function getURIData() {
    var reInfo = [];
    window.location.search.substr(1).split('&').forEach(function (v, i, arr) {
      var strs = v.split('=');
      reInfo.push({
        name: decodeURI(strs[0]),
        value: decodeURI(strs[1])
      });
    });

    return reInfo;
  }

  //初始化搜索条件 
  function initTabs() {
    // 贷款额度
    searchTool.renderList({
      container: '#amount',
      name: 'amount',
      allAttr: true,
      data: searchTool.searchDatas.amount
    });

    // 贷款特色
    $.ajax({
      url: '/qfang-credit/product/ct/searchCharacteristics.json',
      dataType: 'json'
    }).done(function (res) {
      if (res.status !== 0 || res.data.length === 0) {
        return;
      }
      res.data.unshift({
        id: '',
        name: '不限'
      });

      searchTool.renderList({
        container: '#characteristics',
        name: 'characteristicId',
        valueFiled: 'id',
        nameFiled: 'name',
        data: res.data
      });
    });

    // 机构类别
    searchTool.renderRadio({
      container: '#bank',
      name: 'lenderTypeId',
      data: searchTool.searchDatas.bank,
      perLineNumber: 3
    });

    // 保单情况
    searchTool.renderRadio({
      container: '#insurance',
      name: 'orderRequirementId',
      data: searchTool.searchDatas.insurance,
      perLineNumber: 2
    });

    // 购车情况
    searchTool.renderCheckboxLine({
      container: '#aboutCar',
      name: 'carRequirementIds',
      data: searchTool.searchDatas.aboutCar,
      perLineNumber: 2
    });

    // 房产信息
    searchTool.renderCheckboxLine({
      container: '#estate',
      name: 'houseRequirementIds',
      data: searchTool.searchDatas.estate
    });


    // 适合人群
    $.ajax({
      url: '/qfang-credit/product/ct/searchCrowds.json',
      dataType: 'json'
    }).done(function (res) {
      if (res.status !== 0 || res.data.length === 0) {
        return;
      }
      res.data.unshift({
        id: '',
        name: '不限'
      });
      searchTool.renderList({
        container: '#identity',
        name: 'crowdId',
        valueFiled: 'id',
        nameFiled: 'name',
        data: res.data
      });

      initDefault();
    });

    // 复选框互斥
    searchTool.singleMCheckBoxLine({
      singleValue: 'NONE'
    });
  }

  // 筛选的数字提示
  function barBtnTip(count) {
    var $tip = $('.bar-btn-tip');
    var $parent = $tip.parent();
    if (count > 0) {
      $tip.text(count);
      $parent.addClass('active');
    } else {
      $parent.removeClass('active');
      $tip.text('');
    }

  }

  // 设置url带过来的默认值
  function initDefault() {
    var infos = getURIData();

    var i = 0,
      len = infos.length;
    for (; i < len; i++) {
      item = infos[i];
      var name = item.name;
      var val = item.value;
      if (name === 'amount') {
        $('input[name="amount"]').val(val);
      } else if (name === 'crowdId') {
        $('#identity li[data-val="' + val + '"]').addClass('selected');
      } else {
        $('input[name="' + name + '"][value="' + val + '"]').prop('checked', true);
      }
    }

    query();
  }

  // 初始化事件
  function initEvent() {

    // 切换下拉条件
    $('.bar-item-box a').on('click', function () {
      var $this = $(this);
      var index = $this.index();
      var $searchBox = $('.search-content');
      var $items = $searchBox.find('.item-cont');
      $this.siblings().removeClass('selected');
      if (!$this.hasClass('selected')) {
        $this.addClass('selected');
        $items.hide();
        $items.eq(index).show();
        $searchBox.show();
      } else {
        $this.removeClass('selected');
        $searchBox.hide();
      }
    });

    // 单击选项外隐藏搜索条件
    $('.search-content').on('click', hideSearchContent);
    $('.search-form').on('click', function (e) {
      e.stopPropagation();
    });

    // 下拉选项 单击
    $('.item-cont > .inner-list').on('click', 'li', function () {
      var $this = $(this);
      $this.closest('.item-cont').find('input').val('');
      $this.addClass('selected').siblings().removeClass('selected');
      query();
    });

    // 贷款额度自定义
    $('input[name="amount"]').on('input', function () {
      $(this).closest('.item-cont').find('li').removeClass('selected');
    });

    // 重置
    $('#reset').on('click', function (e) {
      barBtnTip(0);
      $(this).closest('.item-cont')[0].reset();
    });

    // 贷款额度的确定、筛选的搜索
    $('#amountBtn , #search').on('click', function () {
      query();
    });

    // 查看信息
    $('.result-list').on('click', '.link-btn', function () {
      $.showPreloader();
      linkModel($(this).data('id'));
    });


    $('.int-input').on('input', function () {
      var $this = $(this);
      $this.val($this.val().replace(/[^\d]/g, ''));
    });

    // 办理贷款
    $('#apply').on('click', function (e) {
      if ($(this).hasClass('disabled')) {
        return false;
      }

      var items = [],
        ids = [];
      $('#resultList').find('input:checked').each(function (i, v, a) {
        items.push({
          no: v.value,
          name: $(v).prev().text()
        });
        ids.push(v.value);
      });

      searchTool.storeHistory(key, ids, 7);

      window.location = 'loan-apply.html?' + encodeURI(JSON.stringify(items));
    });

    // 注册'infinite'事件处理函数
    $(document).on('infinite', '.infinite-scroll-bottom', function () {
      // console.log('infinite事件');
      var addsData = '';
      // 如果正在加载，则退出
      if (config.loading) return;

      // 设置flag
      config.loading = true;
      addsData = 'pageIndex=' + config.pageIndex + '&sizePerPage=' + config.sizePerPage;
      query(config.loading, addsData);

      //容器发生改变,如果是js滚动，需要刷新滚动
      $.refreshScroller();
    });

    $('#resultList').on('change.checkbox', 'input[type="checkbox"]', disBtn);

  }

  function linkModel(id) {
    $.ajax({
      url: '/qfang-credit/product/ct/searchProductDetail.json',
      data: {
        id: id
      },
      dataType: 'json'
    }).done(function (res) {
      // console.log(res);
      renderModal(res.data, id);
    });
  }

  function renderModal(data, id) {
    var height = $(window).height() * 0.8 - 80;
    var _html = '<p class="modal-title">' +
      data.name + '&nbsp;' + searchTool.numberFormateMillion(data.minLoanAmount) + '-' +
      searchTool.numberFormateMillion(data.maxLoanAmount) + '</p><div class="own-modal-inner" style="height:' + height + 'px;"><ul class="own-modal-list" id="modalList"><li><label class="modal-label">代码：</label><p>' + data.productCode + '</p></li><li><label class="modal-label">年龄范围：</label><p>' + data.minAge + '-' + data.maxAge + '岁</p></li><li><label class="modal-label">可贷金额：</label><p>' + searchTool.numberFormateMillion(data.minLoanAmount) + '-' + searchTool.numberFormateMillion(data.maxLoanAmount) + '</p></li><li><label class="modal-label">利率：</label><p>' + data.minRate + '-' + data.maxRate + '%</p></li><li><label class="modal-label">贷款期限：</label><p>' + data.minLoanDuration + '-' + data.maxLoanDuration + '月</p></li><li><label class="modal-label">还款：</label><p>' + data.repaymentType + '</p></li>';
    var list = data.customFieldList;
    var i = 0,
      len = list.length;
    for (; i < len; i++) {
      var item = list[i];
      _html += '<li><label class="modal-label">' + item.name + '：</label><p>' + item.value + '</p></li>';
    }

    _html += '</ul></div><p class="buttons-row"><a href="javascript:;" class="button" id="cancel">取消</a><a href="javascript:;" class="button external active" id="addApply">加入清单</a></p>';
    $.hidePreloader();
    var modal = $.modal({
      text: _html,
      extraClass: 'own-modal'
    });

    var _height = $('.own-modal-inner').height();
    var _marginTop = parseInt($('.own-modal').css('margin-top'), 10);
    $('.own-modal').css({
      marginTop: _marginTop + Math.floor((_height - height) / 2)
    });

    $('#cancel').on('click', function () {
      $.closeModal(modal);
    });

    $('#addApply').on('click', function () {
      // 
      $('input[name="intentionProduct"][value="' + id + '"]').prop('checked', true);
      disBtn();
      $.closeModal(modal);
    });
  }

  // 获取查询数据
  function getQueryData() {
    // 贷款额度
    var $container = $('.search-content');
    var $items = $container.find('.item-cont > .inner-list');
    var selected = [];
    var i = 0;
    for (; i < $items.length; i++) {
      var $list = $items.eq(i).find('.selected');
      var $tab = $('.bar-item-box a').eq(i).find('span');
      var amount = '';

      if ($list.length > 0) {
        amount = $list.text();
        if (i === 0) { //特殊处理贷款额度
          $list.data('minloanamount') && selected.push('minLoanAmount=' + $list.data('minloanamount'));
          $list.data('maxloanamount') && selected.push('maxLoanAmount=' + $list.data('maxloanamount'));
          if (!$list.data('minloanamount') && !$list.data('maxloanamount')) {
            amount = $tab.data('title');
          }
        } else {
          if ($list.data('val')) {
            selected.push($list.data('name') + '=' + $list.data('val'));
          } else {
            amount = $tab.data('title');
          }
        }
      } else if (i === 0) {
        $list = $items.eq(i).parent().find('input');
        amount = $list.val();
        if ($.trim(amount)) {
          selected.push('minLoanAmount=' + +amount * 10000);
          selected.push('maxLoanAmount=' + +amount * 10000);
          amount += '万';
        }
      }
      amount && $tab.text(amount);
    }
    // 筛选
    var search = {};
    var count = 0;
    $container.find('form input:checked').each(function (i, v) {
      count++;
      if (v.type === 'checkbox') {
        if (!search[v.name]) {
          search[v.name] = [];
        }
        search[v.name].push(v.value);
      } else if (v.type === 'radio') {
        if ($.trim(v.value)) {
          selected.push(v.name + '=' + v.value);
        }
      }
    });

    $container.find('form input[type="text"]').each(function (i, v) {
      var val = $.trim(v.value);

      if (val) {
        if (v.name === 'age' && val > 70) {
          $.alert('老人家，您可能办理不了贷款哦~');
          selected = -1;
          return false;
        }
        selected.push(v.name + '=' + v.value);
      }
    });

    if (selected === -1) {
      return selected;
    }

    for (var key in search) {
      if (search.hasOwnProperty(key)) {
        selected.push(key + '=' + search[key].join(','));
      }
    }

    barBtnTip(count);
    hideSearchContent();
    emptyList();
    $('.infinite-scroll-preloader').show();

    return selected.join('&');

  }

  // 查询
  function query(isScroll, addsData) {
    $('.no-result').hide();

    var data = '',
      addsData = addsData || '';
    if (!isScroll) {
      data = getQueryData();
      if (data === -1) {
        return;
      }
      if (!data.length) {
        startSroll();
        config.pageIndex = 1;
        addsData = 'pageIndex=' + config.pageIndex + '&sizePerPage=' + config.sizePerPage;
      }
    }

    // 请求数据
    $.ajax({
      url: '/qfang-credit/product/ct/searchProducts.json',
      dataType: 'json',
      data: data + addsData
    }).done(function (res) {
      if ((!res.data || !res.data.itemList.length) && !isScroll) {
        $('.no-result').show();
        $('.infinite-scroll-preloader').hide();
        return;
      }
      renderList(res.data);

      if (isScroll || !data.length) {
        config.pageCount = Math.ceil(res.data.total / config.sizePerPage);
        config.loading = false;
        if (config.pageCount === config.pageIndex) {
          console.log(config.pageCount, config.pageIndex);
          // 加载完毕，则注销无限加载事件，以防不必要的加载
          $.detachInfiniteScroll($('.infinite-scroll-bottom'));
          // 隐藏加载提示符
          $('.infinite-scroll-preloader').hide();
        }

        config.pageIndex += 1;
      } else {
        $('.infinite-scroll-preloader').hide();
      }
    });
  }

  // 隐藏搜索条件容器
  function hideSearchContent() {
    $('.search-content').hide();
    $('.bar-item-box a').removeClass('selected');
  }


  function disBtn() {
    var $items = $('#resultList input:checked');
    var $btn = $('#apply');
    if ($items.length > 0) {
      $btn.removeClass('disabled');
    } else {
      $btn.addClass('disabled');
    }
  }

  var config = {
    pageCount: 10,
    pageIndex: 1,
    sizePerPage: 15,
    loading: false
  };

  // 开始无限滚动
  function startSroll() {
    $.attachInfiniteScroll($('.infinite-scroll-bottom'));
  }

  // 列表增加节点
  function renderList(data) {
    var $container = $('#resultList ul')
    var _html = '';
    var list = data.itemList;
    if ($container.find('li').length === 0) {
      _html += '<li class="li-title">共有' + data.total + '个贷款，利率' + data.minRate + '%-' + data.maxRate + '%</li>';
    }
    for (var i = 0, len = list.length; i < len; i++) {
      var item = list[i];
      _html += '<li><div class="card"><div class="card-header"><label class="checkbox-file"><span>' +
        item.name + '&nbsp;' + searchTool.numberFormateMillion(item.minLoanAmount) + '-' +
        searchTool.numberFormateMillion(item.maxLoanAmount) + '</span><input type="checkbox" name="intentionProduct" value="' +
        item.id + '" ' + (historyList.indexOf(item.id) > -1 ? 'checked' : '') + '></label></div><div class="card-content"><div class="card-content-inner flex-box flex-wrap"><p class="two-item"><label>利率：</label><span>' + item.minRate + '-' + item.maxRate + '%</span></p><p class="two-item"><label>代码：</label><span>' + item.productCode + '</span></p><p class="two-item"><label>期限：</label><span>' + item.minLoanDuration + '-' + item.maxLoanDuration + '月</span></p><p class="two-item"><label>还款：</label><span>' + item.repaymentType + '</span></p></div></div><div class="card-footer"><a class="link-btn" href="javascript:;" data-id="' + item.id + '">查看信息</a></div></div></li>';
    }

    $container.append(_html);
    disBtn();

  }

  function emptyList() {
    $('#resultList ul').empty();
  }

  // 无限滚动

  initTabs();
  initEvent();
  $.init();
  $.detachInfiniteScroll($('.infinite-scroll-bottom'));
});
