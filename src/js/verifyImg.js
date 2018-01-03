/**
 * 图片验证工具
 * 每个页面只能存在一个
 * fail
 *  失败时执行动作  类型：function
 * success
 *  成功是执行动作  类型：function
 */
var verifyImg = (function () {
  // 一个页面只存在一个verifyImg
  var _html = '<div class="base-modal-inner" id="modal"><div class="flexbox flex-between pic-title-box"><p class="pic-title">请挑出一下<span class="em">「倒置」</span>的图片</p><a class="pic-change" href="javascript:;" id="loadVerifyImg">换一组</a></div><div class="pic-img-box" id="imgList"><div class="pic-img pic-loading"></div><div class="pic-img pic-loading"></div><div class="pic-img pic-loading"></div><div class="pic-img pic-loading"></div></div></div><p class="pic-btn-row"><a href="javascript:;" class="pic-btn" id="cancel">取消</a><a href="javascript:;" class="pic-btn external active" id="addApply">确认</a></p>';

  // 时间戳+随机数
  function generateToken() {
    return +new Date() + random4Str();
  }

  // 获取4位随机数
  function random4Str() {
    var num = "";
    for (var i = 0; i < 4; i++) {
      num += Math.floor(Math.random() * 10)
    }
    return num;
  }

  // 渲染图片
  function renderImg(container, list) {
    var _html = '';
    for (var index = 0, len = list.length; index < len; index++) {
      _html += '<div class="pic-img"><img src="' + list[index] + '"></div>';
    }
    $(container).html(_html);
  }

  // 获取图片
  function loadVerifyImg(opt) {
    // console.log(this);
    var _this = this;
    _this.isloading = true;

    $.ajax({
      url: '/qfang-credit/userCenter/ct/loadVerifyImg.json',
      beforeSend: function () {
        !sessionStorage.getItem('token') && sessionStorage.setItem('token', generateToken());
      },
      type: 'POST'
    }).done(function (res) {
      if (res.code === 'ok') {
        renderImg(opt.container, res.data);
      }

      if (opt.callback && $.isFunction(opt.callback)) {
        opt.callback(res);
      }
      _this.isloading = false;
    });
  }

  // 校验图片
  function verifyImg(opt) {
    var _this = this;
    $.ajax({
      url: '/qfang-credit/userCenter/ct/verifyImg.json',
      type: 'POST',
      data: {
        urls: opt.urls
      },
      async: false
    }).done(function (res) {
      $.toast(res.msg, 200);

      if (res.code != 'ok') {
        res.resutl = false;

        // 失败时重新请求
        var modal = _this.modal;
        _this.loading(modal);
        loadVerifyImg.call(_this, {
          container: $(modal).find('#imgList'),
          callback: function () {
            _this.vailoaded(modal);
          }
        });

      } else {
        res.resutl = true;
      }

      if (opt.callback && $.isFunction(opt.callback)) {
        opt.callback(res);
      }


    });

  }

  return {
    vaid: function (opt) {
      this.options = opt;
      this.loading();
      this._renderModal();
      this.vailoaded();
    },
    loading: function (container) {
      var $container = container ? $(container) : $('body');
      if ($container.find('.picloader-indicator-modal')[0]) {
        return;
      }
      $container.data('vailoaded', 'loading');
      $container.append('<div class="picloader-indicator-modal"></div>');
    },
    vailoaded: function (container) {
      var $container = container ? $(container) : $('body');
      if ($container.data('vailoaded') === 'loading') {
        $container.find('.picloader-indicator-modal').remove();
        $container.data('vailoaded', '');
      }
    },
    _renderModal: function () {
      this.modal = $.modal({
        text: _html,
        extraClass: 'base-modal pic-modal'
      });

      loadVerifyImg.call(this, {
        container: $(this.modal).find('#imgList')
      });
      this._initEvent();
    },
    _initEvent: function () {
      var _this = this;
      var modal = this.modal;
      var $container = $(modal);
      var $imgList = $container.find('#imgList');

      // 换一组
      $container.find('#loadVerifyImg').on('click', function () {
        if (_this.isloading) {
          return;
        }
        _this.loading(modal);
        loadVerifyImg.call(_this, {
          container: $imgList,
          callback: function () {
            _this.vailoaded(modal);
          }
        });
      });

      // 选中图片
      $imgList.on('click.select', '.pic-img', function (e) {
        if ($(this).hasClass('pic-loading')) {
          return;
        }
        $(e.currentTarget).toggleClass('pic-img-on');
      });

      // 取消按钮
      $container.find('#cancel').on('click', function () {
        $.closeModal(modal);
      });

      // 确认按钮
      $container.find('#addApply').on('click', function () {
        var urls = [];

        $imgList.find('.pic-img-on').each(function () {
          urls.push($(this).find('img')[0].src);
        });

        if (!urls.length) {
          $.toast("请至少选择一张图片", 1000);
          return;
        }

        _this.loading(modal);

        verifyImg.call(_this, {
          urls: urls.join(','),
          callback: function (data) {
            var opt = _this.options;
            _this.vailoaded(modal);
            if (data.resutl) {
              $.closeModal(modal);
              if (opt.success && $.isFunction(opt.success)) {
                opt.success(data);
              }
            } else {
              if (opt.fail && $.isFunction(opt.fail)) {
                opt.fail(data);
              }
            }
          }
        });

      });
    }
  };
})();

// console.log(verifyImg);
