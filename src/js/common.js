/**
 * 自动转换地址栏参数为对象
 *
 */
;
(function($) {
  $.unparam = function(params, coerce) {
    var obj = {};
    var coerceTypes = { 'true': !0, 'false': !1, 'null': null };

    // Iterate over all name=value pairs.
    $.each(params.replace(/\+/g, ' ').split('&'), function(j, v) {
      var param = v.split('=');
      var key = decodeURIComponent(param[0]);
      var val;
      var cur = obj;
      var i = 0;

      // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
      // into its component parts.
      var keys = key.split('][');
      var keysLast = keys.length - 1;

      // If the first keys part contains [ and the last ends with ], then []
      // are correctly balanced.
      if (/\[/.test(keys[0]) && /\]$/.test(keys[keysLast])) {
        // Remove the trailing ] from the last keys part.
        keys[keysLast] = keys[keysLast].replace(/\]$/, '');

        // Split first keys part into two parts on the [ and add them back onto
        // the beginning of the keys array.
        keys = keys.shift().split('[').concat(keys);

        keysLast = keys.length - 1;
      } else {
        // Basic 'foo' style key.
        keysLast = 0;
      }

      // Are we dealing with a name=value pair, or just a name?
      if (param.length === 2) {
        val = decodeURIComponent(param[1]);

        // Coerce values.
        if (coerce) {
          val = val && !isNaN(val) ? +val
            : val === 'undefined' ? undefined
            : coerceTypes[val] !== undefined ? coerceTypes[val]
            : val; // string
        }

        if (keysLast) {
          // Complex key, build deep object structure based on a few rules:
          // * The 'cur' pointer starts at the object top-level.
          // * [] = array push (n is set to array length), [n] = array if n is
          //   numeric, otherwise object.
          // * If at the last keys part, set the value.
          // * For each keys part, if the current level is undefined create an
          //   object or array based on the type of the next keys part.
          // * Move the 'cur' pointer to the next level.
          // * Rinse & repeat.
          for (; i <= keysLast; i++) {
            key = keys[i] === '' ? cur.length : keys[i];
            cur = cur[key] = i < keysLast ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val;
          }

        } else {
          // Simple key, even simpler rules, since only scalars and shallow
          // arrays are allowed.

          if ($.isArray(obj[key])) {
            // val is already an array, so push on the next value.
            obj[key].push(val);

          } else if (obj[key] !== undefined) {
            // val isn't an array, but since a second value has been specified,
            // convert val into an array.
            obj[key] = [obj[key], val];

          } else {
            // val is a scalar.
            obj[key] = val;
          }
        }

      } else if (key) {
        // No value was defined, so set something meaningful.
        obj[key] = coerce ? undefined : '';
      }
    });

    return obj;
  };
})(Zepto);

/*身份证验证*/
var cardObj = {
  IdCardValidate: function(idCard) {
    var a_idCard;
    idCard = this.trim(idCard.replace(RegExp(' ', 'g'), ''));
    if (idCard.length === 18) {
      a_idCard = idCard.split('');
      if (this.isValidityBrithBy18IdCard(idCard) && this.isTrueValidateCodeBy18IdCard(a_idCard)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  trim: function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  },

  isValidityBrithBy18IdCard: function(idCard18) {
    var day, month, temp_date, year;
    year = idCard18.substring(6, 10);
    month = idCard18.substring(10, 12);
    day = idCard18.substring(12, 14);
    temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    if (temp_date.getFullYear() !== parseFloat(year) || temp_date.getMonth() !== parseFloat(month) - 1 || temp_date.getDate() !== parseFloat(day)) {
      return false;
    } else {
      return true;
    }
  },

  isTrueValidateCodeBy18IdCard: function(a_idCard) {
    var i, sum, valCodePosition;
    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
    var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    if (a_idCard[17].toLowerCase() === 'x') {
      a_idCard[17] = 10;
    }

    i = 0;
    while (i < 17) {
      sum += Wi[i] * a_idCard[i];
      i++;
    }

    valCodePosition = sum % 11;
    if (parseInt(a_idCard[17], 10) === ValideCode[valCodePosition]) {
      return true;
    } else {
      return false;
    }
  }
}

/* 全局配置 */

$.config = { router: false };

$.ajaxSettings.cache = false;

$(document).on('ajaxBeforeSend', function(e, xhr) {
  xhr.setRequestHeader('u', sessionStorage.getItem('token'));
  xhr.setRequestHeader('token', sessionStorage.getItem('token'));
  // xhr.setRequestHeader('u', '13713925018');
  // xhr.setRequestHeader('token', 'oE1gsv-bMfUNvBpsc8JoQpLpjrtc');
});

$(document).on('ajaxSuccess', function(data, status) {
  if (status.response.indexOf('C0005') > -1) {
    $('.modal, .modal-overlay').remove();
    $.alert('对不起，该账号已经在另一设备登录，请重新登录。', function() {
      location.href = '/login.html';
    });
  } else if (status.response.indexOf('C0004') > -1) {
    $('.modal, .modal-overlay').remove();
    $.alert('对不起，您尚未登录，请重新登录。', function() {
      location.href = '/login.html';
    });
  }
});

$(document).on('ajaxError', function(data, status) {
  $('.modal, .modal-overlay').remove();
  $.alert('服务器异常，请稍后重试！');
});

/* 从推送消息中的链接跳转的地址需要进行解析 */
(function($) {
  var urlParams = $.unparam(location.search.substring(1));
  if (urlParams.token) {
    sessionStorage.setItem('token', urlParams.token);
  }
})(Zepto);
