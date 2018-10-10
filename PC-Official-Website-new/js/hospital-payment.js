
payment = (thi) => {

    $('.payment_contant_foot img').css('border', '1px solid #c8c8c8')
    $(thi).css('border', '2px solid #16A9F6')
}
healthily = (thi) => {

    $('.doctorHealth li').removeAttr('style')
    $(thi).css({
        'borderBottom': '2px solid #16A9F6',
        'color': '#333'
    })
}
// appointment = (thi) => {

//     $('.doctorCenter_left_foot li').removeAttr('style')
//     $('.doctorCenter_left_foot li').removeClass('indent')
//     $(thi).css({
//         'border-left': '2px solid #16A9F6',
//         'color': '#333'
//     })
// }
orderForm = (thi, num) => {

    $('.doctorCenter_right_top span').removeAttr('style')
    $('.doctorCenter_right_top span').removeClass('firstSpan')
    $(thi).css({
        'border-bottom': '2px solid #333',
        'color': '#333'
    })
    if (num == 1) {

        $('.doctorCenter_right_foot').fadeIn()

        $('.doctorCenter_right_succee').fadeOut()
        $('.doctorCenter_right_invalid').fadeOut()

        // $('.complete').fadeIn();
    } else if (num == 2) {

        $('.doctorCenter_right_foot').fadeOut()

        $('.doctorCenter_right_succee').fadeIn()
        $('.doctorCenter_right_invalid').fadeOut()
    } else if (num == 3) {

        $('.doctorCenter_right_foot').fadeOut()

        $('.doctorCenter_right_succee').fadeOut()
        $('.doctorCenter_right_invalid').fadeIn()
    }





}


amend = (thi) => {
    setTimeout(() => {
        $(thi).parent().next().show()
    }, 400)
    $(thi).parent().hide()

}
preserve = (thi) => {
    var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/

    if (reg.test($(thi).prev().val().trim()) === false) {
        // layer.open({
        //     type: 0,
        //     title: false,
        //     closeBtn: 0,
        //     content: '电话号码 格式不 对'
        // });
        layer.msg('电话号码格式不对', { icon: 5 })
        console.log($(thi))

    } else {
        setTimeout(() => {
            $(thi).parent().prev().fadeIn()
            $(thi).parent().prev().children().eq(0).text($(thi).prev().val())

        }, 400)

        $(thi).parent().fadeOut()
    }

}

clickSpring = (id) => {
    $('.interposition').fadeOut()
    $('table.managetable td:nth-child(7) span').text('[管理]')
    $('table.managetable td:nth-child(7) span').removeAttr('style')

}
pepoleManage = (thi) => {
 $('table.managetable td:nth-child(7) span').text('[管理]')
    $('table.managetable td:nth-child(7) span').removeAttr('style')    
    $(thi).text('[取消]')
 
    $(thi).css('color', '#16A9F6')
    $(thi).parent().parent().after($('.interposition'))
    $('.interposition').show()
  
}
patientAdd = () => {
    $('.dialog').fadeIn();
}
cancelEdit = () => {
    $('.dialog').fadeOut();
}
addition = () => {
    $('.addSpring').show()
}
cancel = () => {
    $('.addSpring').hide()
}

clickManage = (thi) => {

    if (thi.innerHTML == '取消') {
        $(thi).text('管理')
        $('.doctorList li span img').hide()
    } else {
        $(thi).text('取消')
        $('.doctorList li span img').show()
    }
}
personage = (thi) => {

    $('.doctorCenter_right_top span').removeAttr('style')
    $('.doctorCenter_right_top span').removeClass('firstSpan')
    $(thi).css({
        'border-bottom': '2px solid #333',
        'color': '#333'
    })
    if ($(thi).index() == 0) {
        $('.doctorPersonnage').show()
        $('.doctorPassword').hide()
    } else {
        $('.doctorPersonnage').hide()
        $('.doctorPassword').show()
    }
}
videoSpring = (thi, im) => {
    $('.doctor_spring').show()
    // videojs 简单使用

    var myo = videojs('myVideo', {
        bigPlayButton: true,
        textTrackDisplay: false,
        posterImage: false,
        errorDisplay: false,
        controlBar: {
            volumePanel: {
                inline: false //默认是true,横着的
            }
        }
    })

    //设置播放器的src
    myo.src({
        src: 'http://hedqs35hx3439ciusmg.exp.bcevod.com/mda-igni9wibhx9f353g/mda-igni9wibhx9f353g.m3u8',
        type: "application/x-mpegURL"
    });

    // http://hhagwxcggzxvnmjaz4a.exp.bcelive.com/lss-iideb2j024fxpkst/live.m3u8
    myo.play() // 视频播放
    myo.pause() // 视频暂停
    //重新加载播放器
    myo.load();


}

springClose = (thi, im) => {
    $('.doctor_spring').hide()
    // var myVideo = videojs('myVideo', {})
    // myVideo.pause() // 视频暂停
}

deleteCancel = () => {
    $('.delete_spring').hide()
}
//身份证认证
getClick = () => {
    var getData = {
        name: $('.doctor_alter_contant p:nth-child(1) input').val().trim(),
        gender: $('#gender option').val(),
        ID: $('.doctor_alter_contant p:nth-child(3) input').val().trim()
    }
    var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
    if (getData.ID == '' || getData.name == '') {
        layer.msg('名字或身份证不能为空', { icon: 5 });
    } else if (reg.test(getData.ID) === false) {
        layer.msg('身份证格式错误', { icon: 5 });
    } else {

        console.log(getData)
    }



}

//密码修改
countersignAlter = () => {
    var password = 4
    var reg = /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,15}$/

    if ($('.doctorPassword p:nth-child(2) input').val().trim() == '' || $('.doctorPassword p:nth-child(1) input').val().trim() == '') {
        // layer.open({
        //     type: 0,
        //     title: false,
        //     closeBtn: 0,
        //     content: '密码不能为空'
        // });
        layer.msg('密码不能为空', { icon: 5 });
    } else if ($('.doctorPassword p:nth-child(1) input').val().trim() != password) {
        layer.msg('原密码输入不正确', { icon: 5 });
    } else if ($('.doctorPassword p:nth-child(2) input').val().trim() != $('.doctorPassword p:nth-child(3) input').val().trim()) {

        layer.msg('修改的密码两次不一致', { icon: 5 });
    } else if (!reg.test($('.doctorPassword p:nth-child(2) input').val().trim())) {


        layer.msg('密码最少6位数', { icon: 5 });
    }

}
//inupt有值触发
inuptClick = (thi) => {
    if ($(thi).val()) {
        $(thi).next().css('background-color', '#16A9F6')
    } else {
        $(thi).next().removeAttr('style')
    }
}

clinic = () => {


    console.log($('#medicalServiceHospital').val())
    console.log($('#medicalHospital option').val())

    var phone = /^1[3|4|5|7|8][0-9]\d{4,8}$/
    var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
    $('#medicalHospital option').val()
    $(".radio input[name='patientGender']:checked").val()
    if ($('#patientName').val().trim() == '' || $('#patientIdentity').val() == '' || $('#patientPhoneNumber').val() == '') {
        layer.msg('姓名，身份证，手机号输入不能为空', { icon: 5 });

    } else if (!reg.test($('#patientIdentity').val())) {

        layer.msg('身份证格式错误', { icon: 5 });
    } else if (!phone.test($('#patientPhoneNumber').val())) {

        layer.msg('手机号格式错误', { icon: 5 });
    }
}