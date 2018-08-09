$(function () {
  // 设置Google两个变量
  var isGoogle = setGoogleItems();

  var infos = $.unparam(location.search.substr(1));
  console.log(infos);
  if (infos.type === 'Qsd') {
    $('#from').show();
    $('#remark').val('推荐办理税费贷');
    $('#productId').val(infos.productId);
  } else {
    $('#from').hide();
  }


  var pointId = infos.pointId || ''; // 办理点ID
  var customerManagerId = infos.customerManagerId || ''; // 客户经理ID
  console.log(pointId);
  console.log(customerManagerId);

  // 手机是否已绑定
  $.ajax({
    url: '/qfang-credit/userCenter/userInfo.json',
    type: 'GET',
    dataType: 'json'
  }).done(function (res) {
    var data = res.data; //41
    // console.log(res);
    if (!data.cellphone) {
      location.replace('./personal-cell.html');
    }

    $('#rname').text(data.name);
    $('#rcellphone').text(data.cellphone);
    $('#referrerName').val(data.name);
    $('#referrerCellphone').val(data.cellphone);

    !isGoogle && data2dataLayer(data);
  });

  // 客户现场办理点
  $.ajax({
    url: '/qfang-credit/point/ct/listAll.json',
    type: 'POST',
    data: '',
    success: function (res) {
      console.log(res);
      var html = '';
      var flag = false;
      var index = 0;
      if (res && res.data && res.data.length) {
        var list = res.data;
        for (var i = 0; i < list.length; i++) {
          html +=
            '<div class="items">' +
            '  <span class="name" data-id="' + list[i].id + '" data-adress="' + list[i].name + '">' + list[i].name + '（' + list[i].address + '）</span>' +
            '</div>';
            if (list[i].id == pointId) {
              flag = true;
              index = i;
            }
        }
        $('#boxOne').html(html);
        console.log(123)
        $('#isShow').removeClass('dn');
        $('#isOnSiteHandling').attr('checked','checked')
        $('#processingPoint').removeClass('dn');
        $('#processingPointAdress').text(list[index].name);
        if ((pointId != '') && (customerManagerId != '')) {
          $.ajax({
            url: '/qfang-credit/point/ct/managers.json',
            type: 'POST',
            data: {
              pointId: pointId
            },
            success: function (res) {
              var html = '';
              var flag = false;
              var index = 0;
              if (res && res.data && res.data.length) {
                var list = res.data;
                for (var i = 0; i < list.length; i++) {
                  html +=
                    '<div class="items">' +
                    '  <span class="name" data-id="' + list[i].personId + '" >' + list[i].personName + '</span>' +
                    '</div>';
                  if (list[i].personId == customerManagerId) {
                    flag = true;
                    index = i;
                  }
                }
                $('#boxTwo').html(html);
                $('#handler').removeClass('dn');
                $('#handlerName').text(list[index].personName);
              }
            }
          });
        }
      }
    }
  });


  function vail() {
    if (!$.trim($('#name').val())) {
      $.toast('请输入贷款人姓名');
      return false;
    }

    // var phone = $.trim($('#cellphone').val());
    // ios 通讯录复制过来的号码会有特殊字符
    var phone = $('#cellphone').val().replace(/\s+/g, '');
    // console.log(phone.length);
    encodeURI(phone).replace(/\d{11}/, function (m) {
      console.log(m);
      phone = m;
      $('#cellphone').val(m)
      return '';
    });


    phone = !(phone && vailPhoneCommon(phone).result);
    if (phone) {
      $.toast('贷款人手机号不正确');
      return false;
    }

    var lenderAmount = $.trim($('#lenderAmount').val());

    if (lenderAmount && !/^\d+$/.test(lenderAmount)) {
      $.toast('期望贷款额只能输入数字');
      return false;
    }
    return true;
  }

  $('#ownModal .own-modal').on('click', function (e) {
    e.stopPropagation();
  });
  $('#ownModalClose').on('click', function () {
    $('#ownModal').hide();
  });


  // 切换客户现场办理
  $(document).on('click', '#isOnSiteHandling', function (e) {
    e.stopPropagation();
    // $('#processingPoint').toggleClass('dn');
    if ($('#isOnSiteHandling').attr('checked')) {
      $('#processingPoint').removeClass('dn');
    } else {
      $('#processingPoint').addClass('dn');
      $('#handler').addClass('dn');
      pointId = '';
      customerManagerId = '';
      $('#processingPointAdress').text('请选择');
      $('#handlerName').text('请选择');

    }
  }).on('click', '#processingPoint', function (e) {
    e.stopPropagation();
    $('#overlay').removeClass('dn');
    $('#boxOne').removeClass('dn');
  }).on('click', '#boxOne .items', function (e) {
    event.stopPropagation();
    $('#overlay').addClass('dn');
    $('#boxOne').addClass('dn');
    $('#handler').removeClass('dn');
    pointId = $(this).find('span').attr('data-id');
    var adress = $(this).find('span').attr('data-adress');
    $('#processingPointAdress').text(adress);
    $.ajax({
      url: '/qfang-credit/point/ct/managers.json',
      type: 'POST',
      data: {
        pointId: pointId
      },
      success: function (res) {
        // console.log(res);
        var html = '';
        if (res && res.data && res.data.length) {
          var list = res.data;
          for (var i = 0; i < list.length; i++) {
            html +=
              '<div class="items">' +
              '  <span class="name" data-id="' + list[i].personId + '" >' + list[i].personName + '</span>' +
              '</div>';
          }
        }
        $('#boxTwo').html(html);
        $('#handlerName').text('请选择');
      }
    });
  }).on('click', '#boxTwo .items', function (e) {
    event.stopPropagation();
    $('#overlay').addClass('dn');
    $('#boxTwo').addClass('dn');
    customerManagerId = $(this).find('span').attr('data-id');
    var name = $(this).find('span').text();
    $('#handlerName').text(name);

  }).on('click', '#overlay', function (e) {
    event.stopPropagation();
    $('#overlay').addClass('dn');
    $('#boxOne').addClass('dn');
    $('#boxTwo').addClass('dn');
  }).on('click', '#handler', function (e) {
    e.stopPropagation();
    $('#overlay').removeClass('dn');
    $('#boxTwo').removeClass('dn');
  });

  $(document).on('click', '.open-agreement', function () {
    $.popup('.popup-agreement');

  }).on('click', '#agreement', function () {
    $('#save').toggleClass('button-disabled', !this.checked);

  }).on('click', '#ladingTips', function () {
    $('#ownModal').show();

  }).on('click', '#ownModal', function () {
    $('#ownModal').hide();

  }).on('click', '#save', function () {
    var $save = $(this);
    console.log(pointId);
    console.log(customerManagerId);

    if ($save.hasClass('button-disabled')) {
      return false;
    }

    if (!vail()) {
      return false;
    }

    $save.addClass('button-disabled');
    $.showPreloader('请稍候...');
    var data = $('#form').serialize();
    if (pointId != '') {
      data += '&pointId=' + pointId;
      if (customerManagerId != '') {
        data += '&customerManagerId=' + customerManagerId;
      }
    }

    $.ajax({
      url: '/qfang-credit/wx/order/apply.json',
      type: 'POST',
      // type: 'GET',
      data: data
    }).done(function (res) {
      console.log(res);
      $.hidePreloader();
      $save.removeClass('button-disabled');
      if (res.code !== 'ok') {
        var str = '网络出错了，请重试！';
        if (res.msg) {
          str = msg;
        }
        $.alert(str);
        return false;
      }
      $('#ladDtail').attr('href', './personal-lading-detail.html?id=' + res.data).closest('.success-content').show().next().hide();

    });
  });
});
