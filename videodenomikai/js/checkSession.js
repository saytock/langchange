///セッションを確認
function checkSession(){
	var data ={
			check : "check",
		};

		$.ajax({
			type:"POST",
			url: "php/check.php",
			data: data,
			success: function(data,dataType){
				if(data=="gotoLogin")
				window.location="login.html";
				else if(data=="gotoEnglish"){
					var key = window.location.pathname;
					key = key.replace("/","english/");
					window.location = key;
				}
				
			},

			error: function(XMLHttpRequest,textStatus,errorThrown){
				alert('Error : ' + errorThrown);
			}
		});
	return false;	
}

