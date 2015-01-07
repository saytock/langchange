///問い合わせ
function contactUs(){
	var data={
		contact:"content",
		name : $('#name').val(),
		mail : $('#mail').val(),
		header : $('#title').val(),
		content : $('#content').val(),
	
	};

	$.ajax({
		type:"POST",	
		url:"php/sendemail.php",
		data:data,		
		success:function(data,dataType){
			alert(data);	
			$('#name').val()="";
			$('#mail').val()="";
			$('#title').val()="";
			$('#content').val()="";
	
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				
		}
	});

}

