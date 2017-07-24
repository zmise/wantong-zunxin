$(function () {
  // 我的身份
  $.ajax({
    url: '/qfang-credit/product/ct/searchCrowds.json',
    dataType: 'json'
  }).done(function (res) {
    if (res.status !== 0 || res.data.length === 0) {
      return;
    }
    searchTool.renderRadio({
      container: '#identity',
      name: 'crowdId',
      data: res.data,
      valueFiled:'id',
      nameFiled:'name',
      perLineNumber: 2
    });
  });

  // 保单情况
  searchTool.renderRadio({
    container: '#insurance',
    name: 'orderRequirementId',
    data: searchTool.searchDatas.insurance,
    perLineNumber: 2
  });

  // 购车情况
  searchTool.renderCheckboxLine({
    container: '#aboutCar',
    name: 'carRequirementIds',
    data: searchTool.searchDatas.aboutCar,
    perLineNumber: 2
  });

  // 房产信息
  searchTool.renderCheckboxLine({
    container: '#estate',
    name: 'houseRequirementIds',
    data: searchTool.searchDatas.estate
  });

  // 复选框互斥
  searchTool.singleMCheckBoxLine({
    singleValue:'NONE'
  });

  $('.winput').on('input',function(){
    var $this = $(this);
    $this.val($this.val().replace(/[^\d]/g,''));
  });

  // 重置
  $('#reset').on('click', function (e) {
    $('form')[0].reset();
  });
  
  // 搜索
  $('#search').on('click', function (e) {
    window.location = 'loan-search.html?' + $('form').serialize();
  });

$.init();
});
