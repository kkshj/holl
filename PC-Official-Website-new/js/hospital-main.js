searchDepartment = () => {  //  科室搜索事件
    let keyWord = $('.search>input').val();
    if (keyWord) {
        console.log(keyWord);
        $('.search-result').fadeIn();
    }
}

quiteResult = () => {  //  取消搜索结果
	console.log(2)
    $('.search-result').fadeOut();
}