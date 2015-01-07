onload = init;

///初期化
function init(){
	checkSession();	
	checkCookie();
}

///セッション情報をチェック
function checkSession(){
	var data ={
			checkSession : "checkSession",
		};

		$.ajax({
			type:"POST",
			url: "php/check.php",
			data: data,
			success: function(data,dataType){
				if(data=="japanese")
				window.location = "http://langchange.org/mainpage.html";
				else if(data=="english")
				window.location = "http://langchange.org/english/mainpage.html";
					
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中');
			}
		});
}

///クッキーを確認する
function checkCookie(){
	var tmp = document.cookie;
	var tmpArray = tmp.split(";");
	tmp = tmpArray[0];
	var valueIndex = tmp.indexOf("=");		
	if(tmp.substring(0,2)=="id"){
		document.forms[0].id.value = unescape(tmp.slice(valueIndex+1));
	}
}

///ログイン
$(document).ready(function(){
	$('#login').click(function(){
		
	if($('#id').val().match(/[;:,\-\+\*\/\\\?\$\^\|]/g) || $('#password').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g)){
		openDialog("IDもしくはパスワードが間違えています");
	}else{

		var data ={
			login : $('#login').val(),
			id : $('#id').val(),
			password : $('#password').val()
		};

		$.ajax({
			type:"POST",
			url: "php/login.php",
			data: data,
			success: function(data,dataType){
				///退会処理の場合
				if(data=="gotoExit"){
					window.location = "leave.html";
				}else if(data=="japanese"){
					if(document.forms[0].idkeep.checked)
					saveid();
					window.location = "mainpage.html";
				}else if(data=="english"){
					if(document.forms[0].idkeep.checked)
					saveid();
					window.location = "english/mainpage.html";
					
				}else{
					openDialog(data);
				}
			},

			error: function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中');
			}
		});
	}

		return false;
	});
});

//クッキーにIDを保存
function saveid(){
	var tmp = document.forms[0].id.value;
	document.cookie = "id = " + tmp;
}

