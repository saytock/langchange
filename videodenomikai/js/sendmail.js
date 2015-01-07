///メールを送信する
function sendMail(){


	var data={
		content : $('#name').val(),
		content : $('#mail').val(),
		content : $('#header').val(),
		content : $('#content').val(),
	
	};

	$.ajax({
		type:"POST",	
		url:"php/sendmail.php",
		data:data,		
		success:function(data,dataType){
			alert(data);	
			window.location.reload();
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				alert('Error : ' + errorThrown);
		}
	});

	return false;
}
