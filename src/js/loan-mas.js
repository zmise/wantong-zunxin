var searchTool = { //工具方法 及 数据
  renderToContainer: function (opt, template) {
    var container = $(opt.container);
    var _html = '';
    var list = opt.data;
    var valuekey = opt.valueFiled;
    var labelkey = opt.nameFiled;
    var name = opt.name;
    var isAllAttr = opt.allAttr;
    var classStr = opt.perLineNumber ? (opt.perLineNumber === 2 ? 'two-item' : (opt.perLineNumber === 3 ? 'three-item' : '')) : '';
    for (var i = 0, len = list.length; i < len; i++) {
      var item = list[i];
      var str = template;
      if (!$.isPlainObject(item)) {
        continue;
      }
      str = str.replace('{{classStr}}', classStr).replace('{{name}}', name);
      for (var key in item) {
        if (item.hasOwnProperty(key)) {
          var rpStr = '{{' + key + '}}';
          if (valuekey && key === valuekey) {
            rpStr = '{{value}}';
          }
          if (labelkey && key === labelkey) {
            rpStr = '{{label}}';
          }

          if (isAllAttr && str.indexOf(rpStr) === -1) {
            str = str.replace(/(?=\>)/, function (match, p1) {
              return ' data-' + key + '="' + item[key] + '"';
            });
          }

          str = str.replace(rpStr, item[key]);
        }
      }
      _html += str;
    }
    container.html(_html);
  },
  renderRadio: function (opt) {
    searchTool.renderToContainer(opt, '<label class="radio-file {{classStr}}"><input type="radio" name="{{name}}" value="{{value}}">{{label}}</label>');
  },
  renderCheckboxLine: function (opt) {
    searchTool.renderToContainer(opt, '<li><label class="checkbox-file"><span>{{label}}</span><input type="checkbox" name="{{name}}" value="{{value}}"></label></li>');
  },
  renderList: function (opt) {
    searchTool.renderToContainer(opt, '<li data-val="{{value}}" data-name="{{name}}">{{label}}</li>');
  },
  singleMCheckBoxLine: function (opt) {
    $('.checkbox-file input').on('click', function (e) {
      e.stopPropagation();
      var $this = $(this);
      var val = $.trim($this.val());
      var singleValue = opt.singleValue || '';

      if (val === singleValue) {
        $this.closest('.inner-list').find('input').prop('checked', false);
        $this.prop('checked', true)
      } else {
        $this.closest('.inner-list').find('input[value="' + singleValue + '"]').prop('checked', false);
      }
    });
  },
  searchDatas: {
    amount: [{ //贷款额度  
      value: '',
      minLoanAmount: '',
      maxLoanAmount: '',
      label: '不限'
    }, {
      value: '1',
      minLoanAmount: 0,
      maxLoanAmount: 50000,
      label: '&le; 5万(含)'
    }, {
      value: '2',
      minLoanAmount: 50001,
      maxLoanAmount: 100000,
      label: '5 - 10万(含)'
    }, {
      value: '3',
      minLoanAmount: 100001,
      maxLoanAmount: 300000,
      label: '10 - 30万(含)'
    }, {
      value: '4',
      minLoanAmount: 300001,
      maxLoanAmount: 500000,
      label: '30 - 50万(含)'
    }, {
      value: '5',
      minLoanAmount: 500001,
      maxLoanAmount: 1000000,
      label: '50 - 100万(含)'
    }, {
      value: '6',
      minLoanAmount: 1000001,
      maxLoanAmount: '',
      label: '&gt; 100万'
    }],
    estate: [{ // 房产信息
      value: 'NONE',
      label: '无'
    }, {
      value: 'a90e7e24-5ef3-44c4-bce2-76d569585b2f',
      label: '本地房按揭房'
    }, {
      value: 'd86b2b04-7e3f-403d-b654-477d5f131673',
      label: '本地有全款房'
    }, {
      value: '332b32e2-25b5-4ca9-b3df-66eeb435f935',
      label: '外地有按揭房'
    }, {
      value: '2e438801-a665-403c-8a70-6a4c32093e03',
      label: '外地有全款房'
    }],
    insurance: [{ // 保单情况
      value: '',
      label: '我有保单'
    }, {
      value: '18ec4cb9-9d68-437d-badb-a9a489bbc6ed',
      label: '我没有保单'
    }],
    aboutCar: [{ // 购车情况
      value: '30e41767-c873-4994-862d-1e5863f7cf8e',
      label: '我已还清车贷'
    }, {
      value: '60cbcb89-3e14-4185-9bf9-fd828e6e6f78',
      label: '我的车在贷款'
    }, {
      value: 'NONE',
      label: '我没有车'
    }],
    bank: [{ // 机构类别
      value: '',
      label: '不限'
    }, {
      value: '0a491bea-2647-4a0e-b164-e875f0a3b932',
      label: '银行机构'
    }, {
      value: '3986a46e-3676-4cd0-9e86-71e7b8489182',
      label: '非银行机构'
    }]
  },
  numberFormateMillion: function (num) {
    num = +num;
    if (isNaN(num)) {
      return null;
    }

    if(num < 10000){
      return num + '元';
    }

    return (+num / 10000) + '万';
  },
  /* 存储历史记录 */
  storeHistory: function (HistoryKey, list, time) {
    localStorage.removeItem(HistoryKey);
    time = time || 30;
    var _time = +new Date(),
      _age = time * 60 * 1000, // 30day
      b = {};
    b._value = list;
    b._endTime = _time + _age; //
    localStorage.setItem(HistoryKey, JSON.stringify(b));
  },

  /* 清除历史记录 */
  clearHistory: function (HistoryKey) {
    localStorage.setItem(HistoryKey, '');
  },

  /* 获取历史记录 */
  getHistory: function (HistoryKey) {
    var data = localStorage.getItem(HistoryKey);
    var now = +new Date();

    if (data) {
      data = JSON.parse(data);
      if (now <= data._endTime) {
        return data._value;
      }
    }

    return [];
  }
};
