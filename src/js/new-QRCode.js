var newQRCode = {
  init: function() {
    this.initEvent();
    this.fecthList();
    this.initForm();
    this.rfInfo = {};
  },
  initForm: function() {
    var userInfo = this.getHistory('new-QrCode-infos');
    if (!userInfo) {
      return;
    }
    $('#referrerName').val(userInfo.referrerName);
    $('#referrerCellphone').val(userInfo.referrerCellphone);
  },
  initEvent: function() {
    var _this = this;
    $('#next').on('click.next', function() {
      var name, phone, ids;
      if (_this.rfInfo.id) {


      } else if (_this.rfInfo.referrerName) {
        ids = $('input[name=id]:checked').val()
        if (!ids) {
          $.alert('请选择模板');
          return;
        }

        _this.rfInfo.id = ids;
        $(this).parent().append('<p class="my-save">保存方法：长按住图片，再选择“保存图片”</p>');
        $(this).remove();
        $('.check-boxses').hide();
        $('.img-box').show();
        _this.fecthGImage();

      } else {
        name = $('input[name=referrerName]').val();
        phone = $('input[name=referrerCellphone]').val();
        if (!name) {
          $.alert('请输入您的姓名');
          return false;
        }
        if (!/^1[34578]\d{9}$/.test(phone)) {
          $.alert('请输入正确的手机号码');
          return false;
        }

        _this.rfInfo.referrerName = name;
        _this.rfInfo.referrerCellphone = phone;

        $('.form-list').hide();
        $('.check-boxses').show();
        $(this).wrap('<div class="btn-bottom"></div>');
        _this.setHistory('new-QrCode-infos', _this.rfInfo);
      }
      $('.h-top .wait').eq(0).removeClass('wait');
    });
  },
  fecthList: function() {
    var _this = this;
    $.ajax({
      url: '/qfang-credit/marketing/template/ct/list.json',
      type: 'GET',
      success: function(data) {
        _this.renderList(data.data);
      }
    });
  },
  renderList: function(list) {
    if (!list || !list.length) {
      return;
    }
    var $listBox = $('#listBox').hide();
    var _html = '<label class="check-box"><input class="check-rad" type="radio" name="id" value="{{imgId}}"> <span class="check-cover"></span> <img class="check-img" src="{{imgUrl}}"></label>';
    var len = list.length;
    for (var i = 0; i < len; i++) {
      $listBox.append(_html.replace('{{imgId}}', list[i].id).replace('{{imgUrl}}', list[i].coverHttpUrl));
    }
    $listBox.css('display', '').prev().hide();
  },
  fecthGImage: function() {
    $.showPreloader('正在生成二维码图片');
    var _this = this;
    $.ajax({
      url: '/qfang-credit/marketing/template/ct/generateImage.json',
      type: 'POST',
      data: this.rfInfo,
      success: function(data) {
        _this.renderGImage(data.data);
      }
    });
  },
  renderGImage: function(list) {
    if (!list || !list.length) {
      return;
    }
    var $listBox = $('#imgList');
    var _html = '<li><img src="{{imgUrl}}"></li>';
    var len = list.length;
    for (var i = 0; i < len; i++) {
      $listBox.append(_html.replace('{{imgUrl}}', list[i]));
    }

    if (len > 1) {
      TouchSlide({
        slideCell: '#imgBox',
        titCell: '.hd',
        mainCell: '.bd',
        effect: 'leftLoop',
        autoPage: true
      });
    }

    $.hidePreloader();
  },
  setHistory: function(key, item) {
    localStorage.removeItem(key);
    var _time = new Date().getTime(),
      _age = 30 * 24 * 60 * 60 * 1000,// 30day
      b = {};
    b._value = item;
    b._endTime = _time + _age; //
    localStorage.setItem(key, JSON.stringify(b));
  },
  getHistory: function(key) {
    var isExpire = this.isExpire(key),
      item = null;
    if (!isExpire) {
      item = localStorage.getItem(key);
      item = JSON.parse(item);
      item = item._value;
    } else {
      localStorage.removeItem(key);
    }
    return item;
  },
  isExpire: function(key) {
    var isExpire = true,
      value = localStorage.getItem(key),
      now = new Date().getTime();
    if (value) {
      value = JSON.parse(value);
      isExpire = now > value._endTime;
    }
    return isExpire;
  }
};
$(function() {
  newQRCode.init();
});
