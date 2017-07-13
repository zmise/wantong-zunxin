$(function () {
    var postInfo = {
        referrerCode: 'SYS_REFERRER_TYPE_0001',
        bizCode: 'SYS_1005',
        sourceCode: 'SYS_SOURCE_0003'
    };
    // ?referrerName=张三&referrerCellphone=181384406263&sourceCode=XXX&agreeMentShow=N&customName=大家看好&customCellphone=13412345678&bizCode=SYS_1005&navCode=1
    var reInfo = {};
    window.location.search.substr(1).split('&').forEach(function (v, i, arr) {
        var strs = v.split('=');
        reInfo[decodeURI(strs[0])] = decodeURI(strs[1]);
    });

    // console.log(reInfo);
    var str = [];

    if (!reInfo.referrerName && !reInfo.referrerCellphone) {
        // console.warn('没有推荐人&&推荐号码！');
        $('#referrer').parent().hide();
        postInfo.referrerCode = '';

    } else {
        // 推荐人姓名
        if (reInfo.referrerName) {
            str.push(reInfo.referrerName);
            postInfo.referrerName = reInfo.referrerName;
        }

        // 推荐人手机号码
        if (reInfo.referrerCellphone) {
            postInfo.referrerCellphone = reInfo.referrerCellphone;
            str.push(reInfo.referrerCellphone.replace(/(?!^)\d{4}(?=(\d{4})*$)/, '****'));
        }
        $('#referrer').html(str.join(',&nbsp;'));

    }

    // 客户来源
    if (reInfo.sourceCode) {
        postInfo.sourceCode = reInfo.sourceCode;
    }

    // 是否显示协议
    if (reInfo.agreeMentShow && reInfo.agreeMentShow == 'N') {
        $('#agreeMentShow').hide();
    }

    // 客户姓名和电话号码
    if (reInfo['customName']) {
        $('#name').val(reInfo['customName']);
    }
    if (reInfo['customCellphone']) {
        $('#cellphone').val(reInfo['customCellphone']);
    }

    //@add by ml.guo 2017.06.16
    if (reInfo.bizCode) { //业务类型
        postInfo.bizCode = reInfo.bizCode;
    }

    var navCode = reInfo.navCode ? reInfo.navCode : 1;

    switch (navCode) {
        case '1': //信用消费贷
            $('#loanAmountShow').show();
            $('title').html('我要贷款-信用消费贷');
            break;
        case '2': //信用经营贷
            $('#yearsOfOperationShow').show();
            $('#loanAmountShow').show();
            $('title').html('我要贷款-信用经营贷');
            break;
        case '3': //房产抵押贷
            $('#assetRemarkShow').show();
            $('#builderAreaShow').show();
            $('title').html('我要贷款-房产抵押贷');
            break;
        case '4': //车辆抵押贷
            $('#yearsOfCarShow').show();
            $('#priceOfCarShow').show();
            $('#locationOfPlateLicenseShow').show();
            $('title').html('我要贷款-车辆抵押贷');
            break;
        default:
            $('#loanAmountShow').show();
    };


    function vaildForm() {
        var name = $('input[name=name]').val();
        var cellphone = $('input[name=cellphone]').val();
        var agree = $('input[name=agree]:checked').val();
        var genderId = $('input[name=genderId]:checked').val();
        var loanAmount = parseFloat($('input[name=loanAmount]').val())?parseFloat($('input[name=loanAmount]').val()):'';
        var yearsOfOperation = parseFloat($('input[name=yearsOfOperation]').val())?parseFloat($('input[name=yearsOfOperation]').val()):'';
        var assetRemark = parseFloat($('input[name=assetRemark]').val())?"房龄" + parseFloat($('input[name=assetRemark]').val()) + "年":'';
        var builderArea = parseFloat($('input[name=builderArea]').val())?parseFloat($('input[name=builderArea]').val()):'';
        var yearsOfCar = parseFloat($('input[name=yearsOfCar]').val())?parseFloat($('input[name=yearsOfCar]').val()):'';
        var priceOfCar = parseFloat($('input[name=priceOfCar]').val())?parseFloat($('input[name=priceOfCar]').val()):'';
        var locationOfPlateLicense = $('input[name=locationOfPlateLicense]').val()?$('input[name=locationOfPlateLicense]').val():'';

        if (!name) {
            $.alert('请输入您的姓名');
            return false;
        }

        if (!/^1[34578]\d{9}$/.test(cellphone)) {
            $.alert('请输入正确的手机号码');
            return false;
        }

        if (!agree) {
            return false;
        }

        postInfo.name = name;
        postInfo.cellphone = cellphone;
        postInfo.genderId = genderId;
        postInfo.loanAmount = loanAmount;
        postInfo.yearsOfOperation = yearsOfOperation;
        postInfo.assetRemark = assetRemark;
        postInfo.builderArea = builderArea;
        postInfo.yearsOfCar = yearsOfCar;
        postInfo.priceOfCar = priceOfCar;
        postInfo.locationOfPlateLicense = locationOfPlateLicense;

        return true;
    }

    $('#loanAmount').on('input', function (e) {
        var $this = $(this);
        $this.val($(this).val().replace(/[^\d.]/g, ''));
    });

    $('#yearsOfOperation').on('input', function (e) {
        var $this = $(this);
        $this.val($(this).val().replace(/[^\d.]/g, ''));
    });

    $('#assetRemark').on('input', function (e) {
        var $this = $(this);
        $this.val($(this).val().replace(/[^\d.]/g, ''));
    });

    $('#builderArea').on('input', function (e) {
        var $this = $(this);
        $this.val($(this).val().replace(/[^\d.]/g, ''));
    });

    $('#yearsOfCar').on('input', function (e) {
        var $this = $(this);
        $this.val($(this).val().replace(/[^\d.]/g, ''));
    });

    $('#priceOfCar').on('input', function (e) {
        var $this = $(this);
        $this.val($(this).val().replace(/[^\d.]/g, ''));
    });

    $('.open-agreement').on('click', function () {
        $.popup('.popup-agreement');
    });

    $('#save').on('click', function () {
        if (vaildForm()) {
            $.showPreloader('正在提交申请……')
            $.ajax({
                url: '/qfang-credit/bill/ct/fastArchiving.json',
                type: 'POST',
                data: postInfo
            }).done(function (res) {
                console.log(res);
                $.hidePreloader();
                $('.success').show();
                $('.success').siblings().hide();
            });
        }
    });
});
