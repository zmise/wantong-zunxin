  $(function() {

    $('#queryRecord').on('click', function() {
      window.location.replace('./office-query-record.html');
      return false;
    });

    $('#submit').on('click', function() {
      var self = $(this);
      var docNoVal = $('.numbering-text').val()
      if (!docNoVal) {
        $.toast('请输入办文编号');
        return false;
      }

      $.ajax({
        url: '/trade-util/banwen/query.json',
        type: 'POST',
        data: { doc_no: docNoVal },
        beforeSend: function() {
          self.prop('disabled', true);
          $.showPreloader();
        },

        success: function(data) {
          $.alert(data.msg);
          if (data.code == 'ok') {
            setTimeout(function() {
              location.href = './office-query-result.html?id=' + data.data.id + '';
            }, 1000);
          } else {
            self.prop('disabled', false);
          }
        },

        complete: function() {
          $.hidePreloader();
        }
      });
    });

  })
