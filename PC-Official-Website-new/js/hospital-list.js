  var a=[]
choseLocation = item => {  //  选择城市事件
    $('.sort>div:eq(0) li').removeClass('chosen');
     $(item).addClass('chosen');
    // if($(item).hasClass('chosen')){
    //       $(item).removeClass('chosen');
    //       a.splice($.inArray($(item).index(),a),1)

    // }else{
    //      $(item).addClass('chosen');
    //      a.push($(item).index())
  
    // }
 
}
choseGrade = item => {  //  选择分级事件
    $('.sort>div:eq(1) li').removeClass('chosen');
    $(item).addClass('chosen');
}
choseType = item => {  //  选择类型事件
    $('.sort>div:eq(2) li').removeClass('chosen');
    $(item).addClass('chosen');
}
choseLocation1 = item => {  //  选择城市事件
    $('.container_sort>div:eq(0) li').removeClass('chosen');
    $(item).addClass('chosen');
}
choseGrade1 = item => {  //  选择分级事件
    $('.container_sort>div:eq(1) li').removeClass('chosen');
    $(item).addClass('chosen');
}
choseType1 = item => {  //  选择类型事件
    $('.container_sort>div:eq(2) li').removeClass('chosen');
    $(item).addClass('chosen');
}
changePage = item => {  //  选择页码事件
    if ($(item).index() === 0) {
        let pageNum = $('.pagination li.chosen').index();
        if (pageNum !== 1) {
            $('.pagination li').removeClass('chosen');
            $('.pagination li').eq(pageNum-1).addClass('chosen');
        }
        return;
    }
    if ($(item).index() === $('.pagination li').length-1) {
        let pageNum = $('.pagination li.chosen').index();
        if (pageNum !== $(item).index()-1) {
            $('.pagination li').removeClass('chosen');
            $('.pagination li').eq(pageNum+1).addClass('chosen');
        }
        return;
    }
    $('.pagination li').removeClass('chosen');
    $(item).addClass('chosen');
}