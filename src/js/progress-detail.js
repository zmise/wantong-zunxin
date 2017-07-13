 $(function() {

   $(document).on("click", ".tab-link", function(e) {
     e.preventDefault();
     var clicked = $(this);
     var flag = clicked.attr('href');

     if (flag == '#tab1') {
       location.href = 'redeem-house.html';
     }
   });

   //get service-info
   var orderId = $.unparam(location.search.split('?')[1]).id;

   $.ajax({
     url: '/qfang-xdtapi/atoneSearch/atoneDetails',
     data: {
       id: orderId
     },
     success: function(data) {
       if (data.code === 'C0000') {
         $('#customerName').text(data.data.customerName);
         $('#customerCell').append('<a class="customer-cell" href="tel://' + data.data.customerCell + '">' + data.data.customerCell + '</a>');
         $('.user-dial').attr('href', 'tel://' + data.data.customerCell);
         $('#billNumber').text(data.data.billNumber);
         $('#sellername').text(data.data.sellername);
         $('#createTime').text(data.data.createTime);
         $('#arrearsBank').text(data.data.arrearsBank.desc);
         if (data.data.garden) {
           $('#gardenName').text(data.data.garden.name + data.data.building.name + data.data.room.number);
         }

         $('#amountinarear').text(data.data.amountinarear);
       }
     }
   });

   //get progress-info
   $.ajax({
     url: '/qfang-xdtapi/atoneSearch/atoneStepList',
     data: {
       atoneId: orderId
     },
     success: function(data) {
       if (data.code === 'C0000') {
         var statusColorList = {
           'SUBMIT': 'green',
           'BUSINESS_FINISH': 'green',
           'CANCEL': 'red'
         };

         var status = statusColorList[data.data.currentStep.value] ? statusColorList[data.data.currentStep.value] : 'orange';

         var curStr = '<div class="status-' + status + ' current"><i class="iconfont icon-iconfontgou"></i>' + data.data.currentStep.desc + '</div>';

         $('.current-progress').after(curStr);

         var stepStr = '';

         var statusList = {
           'SUBMIT': 'success',
           'BUSINESS_FINISH': 'success',
           'CANCEL': 'fail',
         };

         var halfLine = '';
         var last = '';

         var icon;
         var statusStr = '';
         $.each(data.data.stepViewList, function(index, val) {
           if (index === 0) {
             statusStr = 'success';
             icon = '<i class="iconfont icon-iconfontgou"></i>';
           }

           if (data.data.currentStep.desc === '已提交' && index !== 0) {
             statusStr = 'next';
             icon = '';
           } else if (data.data.currentStep.desc === '业务办结' && index !== 0) {
             statusStr = statusList[val.stepValue] ? statusList[val.stepValue] : 'history';
             icon = '<i class="iconfont icon-iconfontgou"></i>';
           } else if (data.data.currentStep.desc === '已取消' && index !== 0) {
             statusStr = 'fail';
             icon = '<i class="iconfont icon-error"></i>';
           } else if (!statusList[data.data.currentStep.value] && index !== 0) {
             icon = '<i class="iconfont icon-iconfontgou"></i>';
             var indexFlag = 0;
             if (data.data.currentStep.desc === val.stepName) {
               indexFlag = index;
             }
             if (index > indexFlag && !val.handledate) {
               statusStr = 'next';
             } else {
               statusStr = 'history';
             }
           }

           if (index === data.data.stepViewList.length - 1) {
             halfLine = '';//'<span class="half-line"></span>';
             last = '';
           }

           stepStr += '<div class="progress-detail-wrapper ' + last + '">' +
             halfLine +
             '    <span class="progress-flag ' + statusStr + '">' + icon + '</span>' +
             '    <div class="progress-detail">' +
             '      <p class="detail-info clearfix"><span class="detail-status">' + val.stepName + '</span><span class="detail-date">' + val.handledate + '</span></p>' +
             '      <p class="detail-person">处理人：' + val.personName + '</p>' +
             '    </div>' +
             '  </div>';

         });
         $('.progress-info.last').after(stepStr);
       }
     }
   });

   $(document).on('click', '.switch-history', function() {
     $('.progress-detail-wrapper').toggle();
     $(this).find('span').toggleClass('step-up');
   });

 });
