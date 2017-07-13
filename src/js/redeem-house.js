$(function() {

  $(document).on('click', ".tab-link", function(e) {
    e.preventDefault();
    var clicked = $(this);
    var flag = clicked.attr('href');

    if (flag == '#tab2') {
      location.href = 'progress-list.html';
      return false;
    }
  });

  //get customer-manager
  $.ajax({
    url: '/qfang-xdtapi/atoneAdd/myCustomers',
    success: function(data) {
      if (data.code === 'C0000') {
        var customer = data.data.customerList[0];
        var imageStyle = 'style="background-image:url';

        if (!customer.photoUrl) {
          imageStyle += '(images/avatar-unknown.png)"';
        } else {
          imageStyle += '(' + customer.photoUrl + ')"';
        }

        var str = '<div class="card-header manager-title">我的客户经理</div>' +
          '<div class="card-content">' +
          '  <div class="card-content-inner clearfix">' +
          '    <div class="my-manager" ' + imageStyle + '></div>' +
          '    <div class="manager-info">' +
          '      <div class="manager-name">' + customer.name + '</div>' +
          '      <div class="manager-phone">' + customer.cell + '</div>' +
          '    </div>' +
          '    <a href="tel://' + customer.cell + '" class="dail-number"><i class="iconfont icon-dianhua"></i></a>' +
          '  </div>' +
          '</div>';

        $('.card-manager').append(str);

      }

    }
  });

  //get bank-list
  $.ajax({
    url: '/qfang-xdtapi/common/getBankList',
    success: function(data) {
      if (data.code === 'C0000') {
        var str = '';
        $.each(data.data.bankList, function(index, val) {
          str += '<option value="' + val.id + '">' + val.desc + '</option>';
        });

        $('.arrearsBank').append(str);
      }
    }
  });

  var isSubmit = true;
  //add redeem-house order
  $('.js-submit').on('click', function() {

    if (isSubmit) {
      var params = {};
      $('.list-block').find('input,select').each(function(index, val) {
        params[this.id] = this.value;
      });

      params['garden.id'] = $('.js-garden').attr('data-garden-id');
      params['building.id'] = $('.js-building').attr('data-building-id');
      params['room.id'] = $('.js-room').attr('data-room-id');
      params['houseName'] = $('.js-garden').val() + $('.js-building').val() + $('.js-room').val();
      params['bankName'] = $('.arrearsBank').find('option:selected').text();

      $.ajax({
        url: '/qfang-xdtapi/atoneAdd/add',
        data: params,
        dataType: 'json',
        beforeSend: function() {
          $('.js-submit').addClass('disabled');
          isSubmit = false;
        },
        success: function(data) {
          if (data.code === 'C0000') {
            $.toast(data.msg);
            setTimeout(function() {
              location.href = 'progress-list.html';
            }, 0);
          } else {
            $('.js-submit').removeClass('disabled');
            $.toast(data.msg);
          }
        },
        complete: function() {
          isSubmit = true;
          $('.js-submit').removeClass('disabled');
        }
      });
    }

  });

  $(document).on('click', '.js-garden,.js-building,.js-room', function() {
    $('#floorContent').hide();
    $.popup('.open-house');
    $('.title').text('选择小区信息');
  });

  $(document).on('click', '.searchbar-cancel', function() {
    $.closeModal();
  });

  //autocomplete
  var remoteOptions = {
    limit: 0,
    datasource: 'remote',
    data: '/qfang-xdtapi/common/getQfangGardenInfo?searchName=',
    onSelect: function(selectedValue, obj) {
      $('.js-garden').val(selectedValue);
      $('.js-garden').attr('data-garden-id', obj.attr('data-garden-id'));
      $('#search').val('');
      this._clearResults();
      $('#gardenContent').hide();
      getBuildingInfo();
    },

    successHandler: function(data) {
      if (data.code !== 'C0000') return;
      if (!data.data.gardenInfoList) {
        this.resultContainer.html('<ol><li>暂无数据，请重新搜索！</li></ol>');
        this.resultContainer.css('display', 'block');
        return;
      };

      var autocompleteHTML = '<ol>';
      $.map(data.data.gardenInfoList.resultList, function(listItem) {
        autocompleteHTML += '<li data-garden-id="' + listItem.id + '">' + listItem.name + '</li>';
      });

      autocompleteHTML += '</ol>';
      this.resultContainer.html(autocompleteHTML);
      var _this = this;
      $('.autocomplete-result li').on('click', function(evt) {
        var selectedValue = $(this).text();
        _this.onSelect(selectedValue, $(this));
        _this._clearResults();
      });

      this.showFunction();
    }
  };

  $.fn.autocomplete(remoteOptions);

});

//get building-info
function getBuildingInfo() {
  $('.title').text('选择楼栋信息');
  $('#buildingContent').show();
  $.ajax({
    url: '/qfang-xdtapi/common/getQfangBuildingInfo',
    async: false,
    data: {
      gardenId: $('.js-garden').attr('data-garden-id')
    },
    beforeSend: function() {
      $.showPreloader();
    },

    success: function(data) {

      if (data.code === 'C0000' && data.data.buildingList.resultList.length) {
        var buildingHtml = '<ul class="building-ul">';
        $.map(data.data.buildingList.resultList, function(item) {
          buildingHtml += '<li data-building-id="' + item.id + '">' + item.name + '</li>';
        });

        buildingHtml += '</ul>';
        $('#buildingContent').html(buildingHtml);
        $('.building-ul li').on('click', function(evt) {
          var selectedValue = $(this).text();
          $('.js-building').val(selectedValue);
          $('.js-building').attr('data-building-id', $(this).attr('data-building-id'));
          $('#buildingContent').hide();
          getRoomInfo();
        });
      } else {
        $('#buildingContent').html('<ul class="building-ul"><li>暂无该小区楼栋信息！</li></ul>');
        $('#buildingContent').append('<nav class="bar bar-tab">' +
          '  <div class="row">' +
          '     <div><a href="javascript:;" class="button button-big button-fill button-warning close-popup">关闭</a></div>' +
          '  </div>' +
          '</nav>');
        $('#buildingContent').show();
        $('.close-popup').click(function() {
          $('#buildingContent').hide();
          $('#gardenContent').show();
        });
      }
    },

    complete: function() {
      $.hidePreloader();
    }
  });

}

//get room-info
function getRoomInfo() {
  $('.title').text('选择房间信息');
  $('#floorContent').show();

  $(document).on('click', '.floor-ul li', function(evt) {
    $(this).siblings().css('color', '#000');
    $(this).css('color', '#f60');
    $('.room-ul').hide();
    $('#' + $(this).attr('data-floor-id')).removeClass('dn').css('display', 'block');
  });

  $.ajax({
    url: '/qfang-xdtapi/common/getQfangRoomInfo',
    async: false,
    data: {
      buildingId: $('.js-building').attr('data-building-id')
    },
    beforeSend: function() {
      $.showPreloader();
    },

    success: function(data) {

      if (data.code === 'C0000' && data.data.roomList !== '') {

        var floorHtml = '<ul class="floor-ul">';
        var roomHtml = '';

        var firstFloor = '';
        $.map(data.data.roomList.floors, function(item) {

          floorHtml += '<li data-floor-id="' + item.id.replace(/[+/=]/g, '') + '">' + (item.name.indexOf('层') > -1 ? item.name : item.name + '层') + '</li>';

          if (item.rooms) {
            !firstFloor && (firstFloor = item.id);
            item.id = item.id.replace(/[+/=]/g, '');
            roomHtml += '<ul class="room-ul dn" id="' + item.id + '">';
            $.map(item.rooms, function(obj) {
              roomHtml += '<li data-room-id="' + obj.id + '">' + obj.roomNumber + '</li>';
            });

            roomHtml += '</ul>';
          }

        });

        floorHtml += '</ul>';
        roomHtml += '';

        $('#floorWrapper').html(floorHtml);
        $('#roomWrapper').html(roomHtml);

        // todo: trigger两次待查
        $('.floor-ul').find('li[data-floor-id="' + firstFloor + '"]').trigger('click').trigger('click');

        $('.room-ul li').on('click', function(evt) {
          var selectedValue = $(this).text();
          $('.js-room').val(selectedValue);
          $('.js-room').attr('data-room-id', $(this).attr('data-room-id'));
          $('#floorContent').hide();
          $('#gardenContent').show();
          $.closeModal();
        });
      } else {
        $('#floorContent').html('<ul class="room-ul"><li>暂无该楼栋房间信息！</li></ul>');
        $('#floorContent').append('<nav class="bar bar-tab">' +
          '     <div class="row">' +
          '       <div><a href="javascript:;" class="button button-big button-fill button-warning close-popup">关闭</a></div>' +
          '     </div>' +
          '   </nav>');
        $('.close-popup').click(function() {
          $('#floorContent').hide();
          $('#gardenContent').show();
        });
      }
    },

    complete: function() {
      $.hidePreloader();
    }
  });
}
