$(function() {
  var urlParams = $.unparam(location.search.substring(1));
  var $calculationCont = $('#calculationCont');
  var $taxCalculationBtn = $('#taxCalculationBtn');

  initData();

  function initData() {

    $.ajax({
      url: '/trade-util/house/price/loadHistorySingle.json',
      data: { id: urlParams.id },
      beforeSend: function() {
        $.showPreloader();
      },

      success: function(data) {
        var items = data;
        if (items.code == 'ok') {
          $.each(items.data, function(k, v) {
            if (k == 'contractTax' || k == 'extraTax' || k == 'personalTaxHeshi' || k == 'totalTaxAmount') {
              $('.' + k + '').text(v.toFixed(2));
            } else {
              $('.' + k + '').text(v);
            }

            if (k == 'type') {
              if (v == 2) {
                $calculationCont.removeClass('dn');
              } else {
                $taxCalculationBtn.removeClass('dn');
              }
            }
          });
        } else {
          $.toast(items.msg);
        }
      },

      complete: function() {
        $.hidePreloader();
      }
    });
  }

  function taxCalculation(self) {
    var requireds = $('.required:visible');
    var flag = true;
    var self = $(this);

    $.each(requireds, function(k, v) {
      if (!($(v).val())) {
        var text = $(v).parent().siblings('label').text().replace(/:/, '');
        $(v).focus();
        flag = false;
        $.toast('请输入' + text);
        return false;
      }
    });

    if (!flag) {
      return false;
    };

    var params = {
      type: 2,
      term: $('#term').val(),
      registerPrice: $('#registerPrice').val(),
      houseType: $('#houseType').val(),
      isOnly: $('#isOnly').prop('checked') ? 1 : 2,
      isFirst: $('#isFirst').prop('checked') ? 1 : 2,
      id: urlParams.id
    };

    $.ajax({
      url: '/trade-util/house/price/query.json',
      type: 'POST',
      data: params,
      beforeSend: function() {
        self ? self.prop('disabled', true) : null;
        $.showPreloader();
      },

      success: function(data) {
        $.toast(data.msg);
        if (data.code == 'ok') {
          $.each(data.data, function(k, v) {
            if (k == 'contractTax' || k == 'extraTax' || k == 'personalTaxHeshi' || k == 'totalTaxAmount' || k == 'personalTaxHeding') {
              $('.' + k + '').text(v.toFixed(2));
            } else {
              $('.' + k + '').text(v);
            }
          });

          $calculationCont.removeClass('dn');
          $taxCalculationBtn.addClass('dn');
          $.closeModal($('#calculationPop'));
        } else {
          self ? self.prop('disabled', false) : null;
        }
      },

      complete: function() {
        $.hidePreloader();
      }
    });
  }

  $('#taxCalculation').on('click', function() {
    var self = $(this);
    $.popup($('#calculationPop'));
  });

  $('#inquireBtn').on('click', function() {
    var self = $(this);
    taxCalculation(self);
  });
});
