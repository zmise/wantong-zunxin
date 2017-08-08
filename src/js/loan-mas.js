var searchTool = { //工具方法 及 数据
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
