onload=check
var pointa;


var key = window.location.pathname;
key = key.split("/");
key = key[1].slice(0,7);


///セッションをチェックする
function check(){
if(key == "reset-3" || key == "reset-4"){

	var data={
		check:"check"
	};

	$.ajax({
			type:"POST",
			url: "php/reset.php",
			data: data,
			success: function(data,dataType){
				if(data==""){
					window.location = "http://langchange.org/reset-2.html";
				}else if(key!=data){
					window.location = "http://langchange.org/"+data+".html";
				}

			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});
}

}


///メールを送信する
function sendMail(){

if(!$('#mail').val().match(/[@]/g)){
	alert("メールアドレスが正しく入力されていません");
}else if($('#mail').val().match(/[;:,\-\+\*\/\\\?\$\^\|]/g)){
	alert("記号（;:,-+*\\/?$^|）は利用できません");
}else{

	var data ={
			sendmail : "sendmail",
			mail : $('#mail').val(),
		};

		$.ajax({
			type:"POST",
			url: "php/reset.php",
			data: data,
			success: function(data,dataType){
				alert(data);
				setTimeout('gotoReset()',3000);
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				alert('メールが正しく送信されませんでした<br>メールアドレスを確認し、再度送信してください');
			}
		});
}

}

///リセットに飛ぶ
function gotoReset(){
	window.location = "reset-2.html";
}


///ログインする
function login(){

if($('#password').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g)){
	alert("パスワードが間違っています");
}else{

	var data ={
			login : "login",
			password : $('#password').val(),
		};

		$.ajax({
			type:"POST",
			url: "php/reset.php",
			data: data,
			success: function(data,dataType){
				if(data=="ok"){
					window.location="reset-3.html";
				}else{
					alert(data);
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});
}

}

///登録
function resistPassword(){

if($('#password').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g) || $('#password2').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g)){
	alert("記号（;:,-+*\\/?$^|.）は利用できません");
}else{

	var msg="";
	var data="";

	if($('#password').val()=="" || $('#password2').val()==""){
		msg="入力されていない箇所があります";
	}else{
		if($('#password').val() != $('#password2').val()){
			msg="パスワードが一致しません";
		}else{
			data={	resist : "resist" , password : $('#password').val(),reset4:"reset-4"};
		}
	}


if(msg==""){
    // Ajaxで送信
    $.ajax({
	type:"POST",
	url:"php/reset.php",
      data: data,
      success:function(data,dataType){
		if(data!=""){
			alert(data);
		}else{
			window.location = "reset-4.html";
		}
	},
	error:function(XMLHttpRequest,textStatus,errorThrown){

	}
    });
}else{
	alert(msg);
}

}

    return false;
}
