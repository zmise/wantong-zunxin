$(function() {
  $.ajax({
    url: '/qfang-xdtapi/common/getQfangGardenInfo',
    type: 'POST',
    success: function(data) {
      if (data.code === 'C0000') {
        var html = '';
        html = '<div class="house-select" id="bankContent"><select id="bankSelect"><option value="">请选择楼盘</option>';
        $.each(data.data.gardenInfoList.resultList, function(k, v) {
          html += '<option value="' + v.id + '">' + v.name + '</option>';
        });

        html += '</select></div><div class="house-select"><select id="buildingSelect" class="disabled" disabled><option value="-1">请选择楼栋</option></select></div>';
        html += '<div class="house-select"><select id="roomSelect" class="disabled" disabled><option value="-1">请选择房间号</option></select></div>';
        html += '<div class="self-modal-btn">' +
          '<span class="self-modal-button button-lines">取消</span>' +
          '<span class="self-modal-button determine-btn">确定</span>' +
          '</div>';

        var self = null;
        var modal = null;
        $(document).on('click', '.house-btn', function() {
          self = $(this);

          modal = $.modal({
            text: html
          });
        });

        $(document).on('click', '.button-lines', function() {
          $.closeModal(modal);
        });

        $(document).on('click', '.determine-btn', function() {
          try {
            var bankchSelect = $('#bankchSelect');
            var bankSelect = $('#bankSelect');
            var branchVal = bankchSelect.val();
            if (branchVal !== '-1') {
              if (branchVal === '0') {
                self.val(bankSelect[0].options[bankSelect[0].selectedIndex].text);
                self.attr('data-id', bankSelect.val());
              } else {
                self.val(bankchSelect[0].options[bankchSelect[0].selectedIndex].text);
                self.attr('data-id', branchVal);
              }

              $.closeModal(modal);
            } else {
              $.toast('请选择楼栋');
            }
          } catch (e) {
            alert(e.line + ',' + e.message);
          }
        });

        $(document).on('change', '#bankContent', function() {
          var val = $(this).find('select').val();
          buildingFun(val, $('#buildingSelect'), $(this).find('select'));
        });

      }
    }
  });

  function buildingFun(val, el, self) {
    if (!val) {
      el.empty().prop('disabled', true).addClass('disabled');
      return;
    }

    $.ajax({
      url: '/qfang-xdtapi/common/getQfangBuildingInfo',
      type: 'POST',
      data: {
        gardenId: val
      },
      success: function(data) {
        if (data.code === 'C0000') {
          var bankName = $(self)[0].options[$(self)[0].selectedIndex].text;
          if (data.data.buildingList.resultList.length) {
            var html = '<option value="-1">请选择楼栋</option>';
            $.each(data.data.buildingList.resultList, function(k, v) {
              html += '<option value="' + v.id + '">' + v.name + '</option>';
            });

            el.empty().append(html).prop('disabled', false).removeClass('disabled');
          } else {
            var html = '<option value="0">无楼栋</option>';
            el.empty().append(html).prop('disabled', true).addClass('disabled');
          }
        }
      }
    });


    $(document).on('change', '#buildingSelect', function() {
      var val = $(this).val();
      roomFun(val, $('#roomSelect'), $('#roomSelect'));
    });

  }

   function roomFun(val, el, self) {
    if (!val) {
      el.empty().prop('disabled', true).addClass('disabled');
      return;
    }

    $.ajax({
      url: '/qfang-xdtapi/common/getQfangRoomInfo',
      type: 'POST',
      data: {
        buildingId: val
      },
      success: function(data) {
        if (data.code === 'C0000') {
          var bankName = $(self)[0].options[$(self)[0].selectedIndex].text;
          if (data.data.roomList.floors.length) {
            var html = '<option value="-1">请选择房间</option>';

            $.each(data.data.roomList.floors, function(k, v) {
              html += '<option value="' + v.id + '">' + v.roomNumber + '</option>';
            });

            el.empty().append(html).prop('disabled', false).removeClass('disabled');

          } else {
            var html = '<option value="0">无房间</option>';
            el.empty().append(html).prop('disabled', true).addClass('disabled');
          }
        }
      }
    });
  }

});
