window.onload=function(){
	var inx=window.location.href.split('=')
	console.log(inx[1])
	if(inx[1]==3){
		$('.clause').hide()
		  $('.register').show()
		  $('.container span').text('注册协议')
	}else if(inx==2){
          $('.clause').show()   
 $('.aboutUs').hide()
 $('.copyright').hide()
 $('.register').hide()
        $('.container span').text('免费条款')	
	}else if (inx[1]==1) {
 $('.clause').show()
 	$('.clause').hide()
        $('.copyright').show() 	
        $('.container span').text('版权声明')		
	}else if (inx[1]==0) {
       $('.clause').hide()   
 $('.aboutUs').show()
 	
  $('.container span').text('关于我们')		
	}


	
}