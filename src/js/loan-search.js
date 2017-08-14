$(function () {
  var key = sessionStorage.getItem('token') + 'loanProductIds';
  var historyList = searchTool.getHistory(key);

  // 初始化事件
  function initEvent() {

    // 查看信息
    $(document).on('click.view', '.result-list .link-btn', function () {
      $.showPreloader();
      linkModel($(this).data('id'));
    });


    // 办理贷款
    $(document).on('click.apply', '#apply,#applyNow', function (e) {
      if ($(this).hasClass('disabled')) {
        return false;
      }

      var items = [],
        ids = [];
      $('#resultList').find('input:checked').each(function (i, v, a) {
        items.push({
          no: v.value,
          name: $(v).siblings('.checkbox-title').text()
        });
        ids.push(v.value);
      });

      searchTool.storeHistory(key, ids, 7);

      location = 'loan-apply.html?' + (items.length > 0 ? encodeURI(JSON.stringify(items)) : '');
    });

    // 
    $(document).on('click.back','#back,#restart', function () {
      location = 'loan-match.html';
    });

    // $('#resultList').on('change.checkbox', 'input[type="checkbox"]', disBtn);

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
    formatData(data);

    var _html = '<p class="modal-title">' +
      data.name + '&nbsp;，可贷' + searchTool.numberFormateMillion(data.minLoanAmount) + '-' +
      searchTool.numberFormateMillion(data.maxLoanAmount) + '</p><div class="own-modal-inner" style="height:' + height + 'px;"><ul class="own-modal-list" id="modalList"><li><label class="modal-label">代码：</label><p class="fb">' + data.productCode + '</p></li><li><label class="modal-label">年龄范围：</label><p class="fb">' + data.minAge + '-' + data.maxAge + '岁</p></li><li><label class="modal-label">可贷金额：</label><p class="fb">' + searchTool.numberFormateMillion(data.minLoanAmount) + '-' + searchTool.numberFormateMillion(data.maxLoanAmount) + '</p></li><li><label class="modal-label">月息：</label><p class="fb">' + data.rateStr + '%</p></li><li><label class="modal-label">贷款期限：</label><p class="fb">' + data.durationStr + '月</p></li><li><label class="modal-label">还款：</label><p>' + data.repaymentTypes + '</p></li>';
    var list = data.customFieldList;
    var i = 0,
      len = list.length;
    for (; i < len; i++) {
      var item = list[i];
      _html += '<li><label class="modal-label">' + item.name + '：</label><pre>' + item.value + '</pre></li>';
    }

    _html += '</ul></div><p class="buttons-row"><a href="javascript:;" class="button" id="cancel">取消</a><a href="javascript:;" class="button external active" id="addApply">选择</a></p>';
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
      // disBtn();
      $.closeModal(modal);
    });
  }

  // 查询
  function query() {
    $('.no-result').hide();

    // 请求数据
    $.ajax({
      url: '/qfang-credit/product/ct/searchProducts.json',
      dataType: 'json',
      data: location.search.substr(1)
    }).done(function (res) {
      $('.infinite-scroll-preloader').remove();
      if ((!res.data || !res.data.itemList.length)) {
        $('.no-result').show();
        $('.buttons-row').hide();
        return;
      }
      renderList(res.data);

    });
  }

  // 办理贷款 按钮 状态控制
  function disBtn() {
    //   var $items = $('#resultList input:checked');
    //   var $btn = $('#apply');
    //   if ($items.length > 0) {
    //     $btn.removeClass('disabled');
    //   } else {
    //     $btn.addClass('disabled');
    //   }
  }


  // 列表增加节点
  function renderList(data) {
    var $container = $('#resultList ul')
    var _html = '';
    var list = data.itemList;
    if (data.searchTimes !== 2) {
      _html += '<li class="li-title">找到' + data.total + '个贷款，月息' + data.minRate + '%-' + data.maxRate + '%，您可一次申请多个贷款</li>';
    } else {
      _html += '<li class="li-title">未找到' + JSON.parse(sessionStorage.getItem('amountloanSearch')).option.replace('>', '大于') + '的贷款，您可进行组合贷款</li>';
    }
    for (var i = 0, len = list.length; i < len; i++) {
      var item = list[i];

      formatData(item);
      var characteristics = item.characteristics;
      var tempHTML = '<p>';
      if (characteristics) {
        for (var j = 0, jlen = characteristics.length; j < jlen; j++) {
          tempHTML += '<span class="spc-item spc-' + (j % 5 + 1) + '">' + characteristics[j].name + '</span>';
        }
      }
      tempHTML += '</p>';

      _html += '<li><div class="card"><label><div class="card-header"><div class="checkbox-file"><p class="checkbox-title">' +
        item.name + '&nbsp;，可贷' + searchTool.numberFormateMillion(item.minLoanAmount) + '-' +
        searchTool.numberFormateMillion(item.maxLoanAmount) + '</p>' +
        tempHTML + '<input type="checkbox" name="intentionProduct" value="' +
        item.id + '" ' + (historyList.indexOf(item.id) > -1 ? 'checked' : '') + '></div></div><div class="card-content"><div class="card-content-inner flex-box flex-wrap"><p class="two-item"><span class="label-gray">月息：</span><span>' + item.rateStr + '%</span></p><p class="two-item"><span class="label-gray">代码：</span><span>' + item.productCode + '</span></p><p class="two-item"><span class="label-gray">期限：</span><span>' + item.durationStr + '月</span></p><p class="two-item"><span class="label-gray">还款：</span><span>' + item.repaymentTypes + '</span></p></div></div></label><div class="card-footer"><a class="link-btn" href="javascript:;" data-id="' + item.id + '">查看更多</a></div></div></li>';
    }

    $container.append(_html);
    // disBtn();

  }

  function formatData(data) {
    var rateStr = data.minRate + '-' + data.maxRate;
    var durationStr = data.minLoanDuration + '-' + data.maxLoanDuration;
    if (data.minRate === data.maxRate) {
      rateStr = data.minRate;
    }
    if (data.minLoanDuration === data.maxLoanDuration) {
      durationStr = data.minLoanDuration;
    }

    data.rateStr = rateStr;
    data.durationStr = durationStr;
  }

  initEvent();
  query();
});
