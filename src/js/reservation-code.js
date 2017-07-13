$(function() {

  var $szItemNo = $('#szItemNo');
  var $registrationAreaOid = $('#registrationAreaOid');
  var $houseCont = $('.house-cont');
  var $symbolCont = $('.symbol-cont');
  var $mortgageCont = $('.mortgage-cont');

  $('#reservationCodeRecord').on('click', function() {
    window.location.replace('./reservation-code-record.html');
    return false;
  });

  var urlParams = $.unparam(location.search.substring(1));
  if (urlParams.id) {
    $.ajax({
      url: '/trade-util/book/loadHistorySingle.json',
      data: { id: urlParams.id },
      success: function(data) {
        var items = data;
        if (items.code == 'ok') {
          $.each(items.data, function(k, v) {
            if (k == 'szItemNo') {
              $szItemNo.attr('code', v);
            } else if (k == 'bussName') {
              $szItemNo.val(v);
            } else if (k == 'bookingType') {
              if (v == '-1060') {
                $houseCont.addClass('dn');
                $symbolCont.removeClass('dn');
                $mortgageCont.addClass('dn');
              } else {
                if (v == '-1033') {
                  $mortgageCont.removeClass('dn');
                } else {
                  $mortgageCont.addClass('dn');
                }

                $houseCont.removeClass('dn');
                $symbolCont.addClass('dn');
              }

              $szItemNo.attr('data-type', v);
            } else if (k == 'xlType') {
              if (v == '2') {
                $('#xlType').prop('checked', true);
              } else {
                $('#xlType2').prop('checked', true);
              }
            } else if (k == 'registrationAreaOid') {
              $registrationAreaOid.attr('code', v);
            } else if (k == 'registrationAreaName') {
              $registrationAreaOid.val(v);
            } else if (k == 'bookingSzAreaOid') {
              $('#bookingSzAreaOid').attr('code', v);
            } else if (k == 'szAreaName') {
              $('#bookingSzAreaOid').val(v);
            } else if (k == 'proveType') {
              if (v == '00') {
                $('#proveType').find('option:eq(0)').attr('selected', 'selected')
              } else if (v == '01') {
                $('#proveType').find('option:eq(1)').attr('selected', 'selected')
              }

            } else {
              $('#' + k + '').val(v);
            }
          });
        } else {
          $.toast(items.msg);
        }

      }
    }).done(function() {
      appointmentTable($registrationAreaOid.attr('code'), $szItemNo.attr('data-type'));
    });
  } else {
    appointmentTable('-1001', '-1060');
  }

  $('#szItemNo,#registrationAreaOid,#bookingSzAreaOid').on('click', function() {
    var self = $(this);
    $('.public-popup').find('ul').hide();
    var id = $(this).attr('id');
    $('#' + id + 'List').show();
    $.popup('.public-popup');

    $('#' + id + 'List').off('click').on('click', 'li', function() {
      var parentEl = $(this).parent();
      self.val($(this).text());
      parentEl.find('.icon').remove();
      $(this).append('<span class="icon icon-check"></span>');
      if (parentEl.is('#registrationAreaOidList')) {
        $registrationAreaOid.attr('data-id', $(this).attr('data-id'));
        $registrationAreaOid.attr('code', $(this).attr('code'));

        appointmentTable($(this).attr('code'), $szItemNo.attr('data-type'));
      } else if (parentEl.is('#szItemNoList')) {
        $szItemNo.attr('code', $(this).attr('code')).attr('data-type', $(this).data('type'));

        appointmentTable($registrationAreaOid.attr('code'), $(this).data('type'));
        if ($(this).data('type') == '-1060') {
          $houseCont.addClass('dn');
          $symbolCont.removeClass('dn');
          $mortgageCont.addClass('dn');
        } else {
          if ($(this).data('type') == '-1033') {
            $mortgageCont.removeClass('dn');
          } else {
            $mortgageCont.addClass('dn');
          }

          $houseCont.removeClass('dn');
          $symbolCont.addClass('dn');
        }
      } else if (parentEl.is('#bookingSzAreaOidList')) {
        $('#bookingSzAreaOid').attr('code', $(this).attr('code'));
      }

      $.closeModal('.public-popup');
    });
  });

  function initData(type, el) {
    $.ajax({
      url: '/trade-util/book/loadBasicData.json',
      data: { type: type },
      success: function(data) {
        if (data.code == 'ok') {
          var html = '';
          $.each(data.data, function(k, v) {
            if (type == 1 || type == 3) {
              if (k == 0 && !urlParams.id) {
                if (type == 3) {
                  html += '<li code="' + v.dicCode + '" data-type="' + v.dicDesc + '">' + v.dicName + '<span class="icon icon-check"></span></li>';
                } else {
                  html += '<li code="' + v.dicCode + '" data-id="' + v.id + '">' + v.dicName + '<span class="icon icon-check"></span></li>';
                }
              } else {
                if (type == 3) {
                  html += '<li code="' + v.dicCode + '" data-type="' + v.dicDesc + '">' + v.dicName + '</li>';
                } else {
                  html += '<li code="' + v.dicCode + '" data-id="' + v.id + '">' + v.dicName + '</li>';
                }
              }
            } else if (type == 5) {
              html += '<option value="' + v.dicCode + '">' + v.dicName + '</option>';
            } else {
              html += '<li code="' + v.dicCode + '">' + v.dicName + '</li>';
            }
          });

          el.empty().append(html);
        }
      }
    });
  }

  initData(1, $('#registrationAreaOidList'));
  initData(3, $('#szItemNoList'));
  initData(4, $('#bookingSzAreaOidList'));
  initData(5, $('#proveType'));

  var dayList = null;
  var timeList = null;
  var countMap = null;

  function randomId() {
    var random = Math.floor(Math.random() * 10001);
    var id = (random + "_" + new Date().getTime()).toString();

    return id;
  }

  function zeroFill(n) {
    return n > 10 ? n : ('0' + n + '')
  }

  function pubilicAjax(param, dataName, loadFlag) {
    var deferred = $.Deferred();
    $.ajax({
      url: '/trade-util/book/loadDateRelatedData.json',
      type: 'POST',
      data: param,
      beforeSend: function() {
        if (loadFlag) {
          $.showPreloader();
        }
      },

      success: function(data) {
        if (data.data) {
          var s0 = data.data.replace(/DWREngine._handleResponse/, '');
          if (dataName == 'dayList') {
            dayList = JSON.parse(eval(s0));
          } else if (dataName == 'timeList') {
            timeList = JSON.parse(eval(s0));
          } else {
            countMap = eval(s0);
          }

          deferred.resolve();
        } else {
          deferred.reject();
        }
      },

      complete: function() {
        if (loadFlag) {
          $.hidePreloader();
        }
      }
    });

    return deferred.promise();
  }

  var $appointmentBody = $('#appointmentTable');

  function appointmentTable(p0, p1, self) {
    var d1Param = {
      'url': 'http://onlinebook.szreorc.com:8888/onlinebook/dwr/exec/workDayDwr.listWorkDayByRegistrationAreaOid.dwr',
      'callCount': '1',
      'c0-scriptName': 'workDayDwr',
      'c0-methodName': 'listWorkDayByRegistrationAreaOid',
      'c0-id': '' + randomId() + '',
      'c0-param0': 'string:' + p0 + '',
      'xml': 'true'
    };

    var d2Param = {
      'url': 'http://onlinebook.szreorc.com:8888/onlinebook/dwr/exec/workTimeSoltDwr.listWorkTimeSoltByRegistrationAreaOid.dwr',
      'callCount': '1',
      'c0-scriptName': 'workTimeSoltDwr',
      'c0-methodName': 'listWorkTimeSoltByRegistrationAreaOid',
      'c0-id': '' + randomId() + '',
      'c0-param0': 'string:' + p0 + '',
      'c0-param1': 'string:' + p1 + '',
      'xml': 'true'
    };

    var d3Param = {
      'url': 'http://onlinebook.szreorc.com:8888/onlinebook/dwr/exec/bookingInformationDwr.countAllBookingAmount.dwr',
      'callCount': '1',
      'c0-scriptName': 'bookingInformationDwr',
      'c0-methodName': 'countAllBookingAmount',
      'c0-id': '' + randomId() + '',
      'c0-param0': 'string:' + p0 + '',
      'c0-param1': 'string:' + p1 + '',
      'xml': 'true'
    };

    var d1 = pubilicAjax(d1Param, 'dayList', false);
    var d2 = pubilicAjax(d2Param, 'timeList', false);
    var d3 = pubilicAjax(d3Param, 'countMap', true);

    self ? self.prop('disabled', true) : null;

    $.when(d1, d2, d3).done(function() {
      self ? self.prop('disabled', false) : null;
      var htmlHead = '<tr class="label" id="dateHead"><td class="refresh-td"><button class="button refresh">刷新</button></td>'
      $.each(dayList, function(k, v) {
        var index = v.workDayLabel.indexOf('-');
        var wordIndex = v.workDayLabel.indexOf(' ');
        var date = v.workDayLabel.slice(index + 1, wordIndex);
        var day = v.workDayLabel.slice(wordIndex + 1, v.workDayLabel.length).replace(/\(星期/, '周').replace(/\)/, '');
        htmlHead += '<td data-date="' + v.workDayLabel + '"><span>' + date + '</span><span>' + day + '</span></td>';
      });

      var htmltBody = '';
      var newDate = new Date();
      var dateFlag = false;
      var nowDate = newDate.getFullYear() + '-' + zeroFill((newDate.getMonth() + 1)) + '-' + zeroFill(newDate.getDate());
      $.each(timeList, function(k, v) {
        htmltBody += '<tr><td data-workTimeSoltOid="' + v.workTimeSoltOid + '">' + v.workTimeSoltName + '</td>';

        $.each(dayList, function(n, m) {
          var count = countMap[dayList[n].workDay.substring(0, 10) + "_" + timeList[k].workTimeSoltOid] || 0;
          dayList[n].workDay = dayList[n].workDay.substring(0, 10);

          if (zeroFill(newDate.getHours()) > timeList[k].startTime.substring(0, 2) && nowDate == dayList[n].workDay) {
            dateFlag = true;
          } else if (zeroFill(newDate.getHours()) == timeList[k].startTime.substring(0, 2) && nowDate == dayList[n].workDay) {
            if (zeroFill(new Date().getSeconds()) > timeList[k].startTime.substring(3, 5)) {
              dateFlag = true;
            }
          } else {
            dateFlag = false;
          }

          if (!dateFlag) {
            if (count) {
              htmltBody += '<td class="tickets">' + count + '</td>';
            } else {
              htmltBody += '<td class="expiry">约满</td>';
            }
          } else {
            htmltBody += '<td class="expiry">已结束</td>';
          }

        });

        htmltBody += '</tr>';
      });

      $appointmentBody.empty().append(htmlHead, htmltBody);
    });
  }

  $appointmentBody.on('click', 'td.tickets', function() {
    $appointmentBody.find('td').removeClass('select-appointment');
    $(this).addClass('select-appointment');
  });

  $appointmentBody.on('click', '.refresh', function() {
    var self = $(this);
    appointmentTable($registrationAreaOid.attr('code'), $szItemNo.attr('data-type'), self);
  });

  $('#codesBtn').on('click', function() {
    $('#codeImg').attr('src', '/trade-util/book/verify.pic?' + Math.random() + '');
  });

  $('#inquireBtn').on('click', function() {
    var self = $(this);
    reservationFun(2, self);
  });

  $('#saveInformation').on('click', function() {
    var self = $(this);
    reservationFun(1, self);
  });

  function reservationFun(type, self) {
    var requireds = $('.required:visible');
    var flag = true;

    if ($mortgageCont.is(':visible')) {
      var xlTypeLength = $('#reservationForm').find('input[name=xlType]:checked').length;
      if (!xlTypeLength) {
        $.toast('请选择注销抵押事项小类');
        return false;
      }
    }

    $.each(requireds, function(k, v) {
      if (!$(v).val() && type == 2) {
        if ($(v).is('#appointmentTable')) {
          if (!$(v).find('.select-appointment').length) {
            $.toast('请选择预约时间');
            flag = false;
            return false;
          }
        } else {
          var text = $(v).parent().siblings('label').text().replace(/:/, '');
          $(v).focus();
          if ($(v).is('#verificationcodereg')) {
            $.toast('请输入验证码');
          } else {
            $.toast('请输入' + text);
          }

          flag = false;
          return false;
        }
      } else {
        if ($(v).is('#certificateNo')) {
          if (!cardObj.IdCardValidate($.trim($(v).val())) && $(v).val()) {
            $(v).focus();
            flag = false;
            $.toast('请输入合法的身份证号');
            return false;
          }
        } else if ($(v).is('#personName')) {
          var reg = /^[\u4E00-\u9FA5]{2,4}$/;
          if (!reg.test($.trim($(v).val())) && $(v).val()) {
            $(v).focus();
            flag = false;
            $.toast('请输入规范的申请人姓名');
            return false;
          }
        } else if ($(v).is('#phoneNumber') && $(v).val()) {
          var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
          if (!reg.test($.trim($(v).val()))) {
            $(v).focus();
            flag = false;
            $.toast('手机号格式不正确');
            return false;
          }
        }
      }
    });

    if (!flag) {
      return false;
    }

    var $selectAppointment = $('.select-appointment');
    var index = $selectAppointment.index();
    var $dateHead = $('#dateHead');
    var serializeObj = {};
    $.each($('#reservationForm').serializeArray(), function() {
      if (this.name == 'xlType' && $mortgageCont.is(':visible')) {
        if ($('#' + this.name + ':checked').length) {
          serializeObj[this.name] = 2;
        } else {
          serializeObj[this.name] = 1;
        }
      } else if (this.name == 'szItemNo' || this.name == 'bookingSzAreaOid') {
        serializeObj[this.name] = $('#' + this.name + '').attr('code');
      } else if (this.name == 'registrationAreaOid') {
        serializeObj[this.name] = $('#' + this.name + '').attr('code');
      } else if (this.name == 'proveType' || this.name == 'proveCode' || this.name == 'houseName') {
        if ($houseCont.is(':visible')) {
          serializeObj[this.name] = this.value;
        }
      } else if (this.name == 'fzFileNo') {
        if ($symbolCont.is(':visible')) {
          serializeObj[this.name] = this.value;
        }
      } else {
        serializeObj[this.name] = this.value;
      }

    });

    var dateStr = $dateHead.find('td').eq(index).data('date');
    var wordIndex = dateStr.indexOf('(');
    serializeObj.bookingDateLabel = index > -1 ? dateStr : '';
    serializeObj.bookingDateStr = index > -1 ? dateStr.slice(0, wordIndex - 1) : '';
    serializeObj.workTimeSoltName = $selectAppointment.parent().find('td:first').text() || '';
    serializeObj.workTimeSoltOid = $selectAppointment.parent().find('td:first').length > 0 ? $selectAppointment.parent().find('td:first').data('worktimesoltoid') : '';
    serializeObj.type = type;
    if (urlParams.status) {
      serializeObj.id = urlParams.id;
    }

    $.ajax({
      url: '/trade-util/book/submit.json',
      type: 'POST',
      data: serializeObj,
      beforeSend: function() {
        self.prop('disabled', true);
        $.showPreloader();
      },

      success: function(data) {
        $.alert(data.msg);
        if (data.code == 'ok') {
          setTimeout(function() {
            location.href = './reservation-code-record.html';
          }, 1000);
        } else {
          self.prop('disabled', false);
        }
      },

      complete: function() {
        $.hidePreloader();
      }
    });
  }
})
