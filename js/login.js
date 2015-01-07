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

			}
		});
}

///クッキーを確認する
function checkCookie(){
	tmp = document.cookie;
	var tmpArray = tmp.split(";");
	tmp = tmpArray[1];
	try{
	if(tmp.slice(1,3)=="id"){
		document.getElementById("id").value = tmp.slice(4);
	}
	}catch(e){}
}

///ログイン
$(document).ready(function(){
	$('#login').click(function(){

	if($('#id').val().match(/[;:,\-\+\*\/\\\?\$\^\|]/g) || $('#password').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g)){
		openDialog("IDもしくはパスワードが間違っています");
	}else if(isSupported(['chrome','firefox','crios'])){
		openDialog("現在お使いのブラウザではご利用いただけません");
		setTimeout("gotoRedirect()",3000);
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

			}
		});
	}

		return false;
	});
});

///howtouseへ
function gotoRedirect(){
	window.location = "howtouse.html#browser";
}

//クッキーにIDを保存
function saveid(){
	var tmp = document.forms[0].id.value;
	document.cookie = "id = " + tmp;
}


///ブラウザ名を取得
var getBrowser = function(){
    var ua = window.navigator.userAgent.toLowerCase();
    var ver = window.navigator.appVersion.toLowerCase();
    var name = 'unknown';


    if (ua.indexOf("msie") != -1){
        if (ver.indexOf("msie 6.") != -1){
            name = 'ie6';
        }else if (ver.indexOf("msie 7.") != -1){
            name = 'ie7';
        }else if (ver.indexOf("msie 8.") != -1){
            name = 'ie8';
        }else if (ver.indexOf("msie 9.") != -1){
            name = 'ie9';
        }else if (ver.indexOf("msie 10.") != -1){
            name = 'ie10';
        }else{
            name = 'ie';
        }
    }else if(ua.indexOf('trident/7') != -1){
        name = 'ie11';
    }else if (ua.indexOf('chrome') != -1){
        name = 'chrome';
    }else if (ua.indexOf('safari') != -1){
        name = 'safari';
    }else if (ua.indexOf('opera') != -1){
        name = 'opera';
    }else if (ua.indexOf('firefox') != -1){
        name = 'firefox';
    }
   //androidのための処理
    /* if(ua.indexOf('safari') != -1 && ua.indexOf('chrome') != -1){
	name = 'unavarable';
     }*/

     //iphoneのための処理
    if(ua.indexOf('crios') != -1){
	name = 'crios';
     }
    return name;
};

///対応ブラウザかの確認
var isSupported = function(browsers){
    var browserFlag = "off";
    var thusBrowser = getBrowser();
    for(var i=0; i<browsers.length; i++){
        if(browsers[i] == thusBrowser)
         browserFlag = "on";
     }
	if(browserFlag != "on"){
		return true;
	}else{
		return false;
	}
     
};
