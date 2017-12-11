$(function () {
  dataLayer.push(JSON.parse(sessionStorage.getItem('userInfo.dataLayer')));
  //产品ID
  // $.ajax({
  //   url: '/qfang-credit/userCenter/inviteRecordStatistics.json',
  //   dataType: 'json',
  //   type: 'GET'
  // }).done(function (res) {
  //   // console.log(res);
  //   if (res.code != 'ok') {
  //     $.alert(res.data.msg);
  //     return;
  //   }
  //   var url = 'personal-lading.html?type=Qsd&productId=' + res.data;
  //   $('#inquireBtn').attr('href', url);
  // });

  var day = +new Date('2017-12-05'),
    current = +new Date(),
    time = Math.floor((current - day) / (60 * 60 * 24 * 1000));

  console.log(day, current, time);

  // 已发放推荐奖励：默认基数652110元，以11月25日为基准，以当前日期 减去 2017年11月25日 ，算出天数差，推荐奖励 = 652110 + 天数差 * 5400
  $('#crashScore').text(652110 + time * 5400);

  // 拿奖人数：默认基数118人，以11月25日为基准，先以当前日期 减去 2017年11月25日 算出天数差，拿奖励人数 =118  + 天数差
  $('#personScore').text(118 + time);

});
