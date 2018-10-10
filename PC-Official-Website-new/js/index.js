changeCity = btn => {  //  展开城市列表
    if ($(btn).text() === '[取消]') {
        $('.city').fadeOut();
        $(btn).text('[切换]');
        return ;
    }
    $('.city').fadeIn();
    $(btn).text('[取消]');
}

choseCity = btn => {  //  选择城市事件
    let city = $(btn).text();  //  选择的城市名字
    console.log(city);
    $('.city').fadeOut();
    $('.position .right').text('[切换]');
}

showNotice = () => {  // 显示挂号须知
    $('.notice').fadeIn();
}

hideNotice = () => {  // 隐藏挂号须知
    $('.notice').fadeOut();
}

let timer;

bannerScroll = () => {
    timer = setInterval(() => {
        $(".banner>ul:first-child").animate({marginLeft:'-100%'}, 500, (e) => {
            $(".banner>ul:first-child").css('marginLeft','0');
            $(".banner>ul:first-child>li:first-child").insertAfter(".banner>ul:first-child>li:last-child");
            let i = $('.banner ul:last-child>li.chosen').index() + 1;
            if (i === $('.banner ul:first-child>li').length) {
                i = 0;
            }
            $(".banner ul:last-child>li").removeClass("chosen");
            $(".banner ul:last-child>li").eq(i).addClass("chosen");
        })
    }, 5000)
}

stopScroll = () => {
    clearInterval(timer);
}

choseBanner = (point) => {
    let choseIdx = $('.banner ul:last-child>li.chosen').index();
    let pointIdx = $(point).index();
    if (choseIdx < pointIdx) {
        let step = pointIdx - choseIdx;
        $(".banner>ul:first-child").animate({marginLeft:'-100%'}, 500, (e) => {
            $(".banner>ul:first-child").css('marginLeft','0');
            for(let i = 0; i < step; i++){
                $(".banner>ul:first-child>li:first-child").insertAfter(".banner>ul:first-child>li:last-child");
            }
            $(".banner ul:last-child>li").removeClass("chosen");
            $(".banner ul:last-child>li").eq(pointIdx).addClass("chosen");
        })
    }
    if (choseIdx > pointIdx) {
        let step = choseIdx - pointIdx;
        for(let i = 0; i < step; i++){
            $(".banner>ul:first-child>li:last-child").insertBefore(".banner>ul:first-child>li:first-child");
        }
        $(".banner>ul:first-child").animate({marginLeft:'100%'}, 500, (e) => {
            $(".banner>ul:first-child").css('marginLeft','0');
            $(".banner ul:last-child>li").removeClass("chosen");
            $(".banner ul:last-child>li").eq(pointIdx).addClass("chosen");
        })

    }
}

window.onload = () => {
    $('.banner ul:first-child').width($('.banner ul:first-child>li').length * 900);
    for (let i = 0; i < $('.banner ul:first-child>li').length; i++) {
        if (i === 0) {
            $('.banner ul:last-child').append('<li class="chosen" onmouseenter="choseBanner(this)"></li>');
            continue;
        }
        $('.banner ul:last-child').append('<li onmouseenter="choseBanner(this)"></li>');
    }
    bannerScroll();
}
