$(function () {
  var infos = JSON.parse(sessionStorage.getItem('loanresult'));
  var html = '';
  console.log(infos);
  for (var i = 0, len = infos.length; i < len; i++) {
    html += '<p class="two-item">' + infos[i].name + '：<a href="tel:' + infos[i].phone + '">' + infos[i].phone + '</a></p>';
  }

  $('.links-box .flex-box').append(html)

  // 返回
  $('#back').on('click', function () {
    location = 'loan-match.html';
  });
});
