///メールを送信する
function sendMail(){


	var data={
		sendMail: "sendMail",
		contact : $('#contact').val(),
	
	};

	$.ajax({
		type:"POST",	
		url:"php/sendemail.php",
		data:data,		
		success:function(data,dataType){
			alert(data);	
			$('#contact').val("");
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				
		}
	});

	return false;
}

///ログアウト
$(document).ready(function(){
	$('#logout').click(function(){
		var data ={
			logout : $('#logout').val(),
		};

		$.ajax({
			type:"POST",
			url: "php/login.php",
			data: data,
			success: function(data,dataType){
				if(data=="ok"){
					window.location="index.html";
				}else{
					alert(data);
				}
			},

			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});

		return false;
	});
});

///ログアウト※スマートフォン用
$(document).ready(function(){
	$('#logout-sp').click(function(){
		var data ={
			logout : $('#logout-sp').val(),
		};

		$.ajax({
			type:"POST",
			url: "php/login.php",
			data: data,
			success: function(data,dataType){
				if(data=="ok"){
					window.location="index.html";
				}else{
					alert(data);
				}
			},

			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});

		return false;
	});
});


///ダイアログを開く
function openDialog(msg){
	document.getElementById("dialog1").innerHTML = msg;
	$('#dialog1').dialog({
		height:'auto',
		width:300,
    		 dialogClass: 'noTitleDialog',
		buttons: {
			"OK": function(){
				$(this).dialog('close');
			}
		}
	});
}

///確認ダイアログを開く
function openConfirm(msg,response){
	document.getElementById("dialog1").innerHTML = msg;
	$('#dialog1').dialog({
		height:'auto',
		width:300,
    		 dialogClass: 'noTitleDialog',
		buttons: {
			"OK": function(){
				$(this).dialog('close');
				response(false);
			},
			"キャンセル": function(){
				$(this).dialog('close');
				response(true);
			}
		}
	});
}
