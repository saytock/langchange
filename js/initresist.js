onload=init

var pointa;
var hobbyCount=0;
var hobbyArray=[];
var hobbyTags=[];

var key = window.location.pathname;
key = key.split("/");
key = key[1].slice(0,10);

///初期化
function init(){
	check();

	//誕生日スピン表示
	var birthdaycheck;
	try{
		birthdaycheck = document.getElementById("birthday").innerHTML;
	}catch(e){
		birthdaycheck = null;
	}

	if(birthdaycheck)
	setBirthdaySpinbox();

	//紹介コード確認
	if(key=="register-4")
	checkInvitation();

	//自動入力
	if(key=="register-2")
	initForm();

}

///メールを送信する
function sendMail(){
if(document.getElementById("checks").checked ==true){

	if(!$('#mail').val().match(/[@]/g)){
		openDialog("メールアドレスが正しく入力されていません");
	}else if($('#mail').val().match(/[\;\:\,\+\*\/\\\?\$\^\|]/g)){
		openDialog("記号（;:,+*\\/?$^|）は利用できません");
	}else{

	var data ={
			sendmail : "sendmail",
			email : $('#mail').val(),
		};

		$.ajax({
			type:"POST",
			url: "php/initresist.php",
			data: data,
			success: function(data,dataType){
				openDialog(data);
				setTimeout('gotoRegister()',3000);
					
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('メールが正しく送信されませんでした<br>メールアドレスを確認し、再度送信してください');
			}
		});
	}

}else{
	openDialog("利用規約をご確認の上、チェックしてください");
}



}

///レジスターに飛ぶ
function gotoRegister(){
	window.location = "register-1.html";
}



///ログインする
function login(){
if($('#password').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g)){
	openDialog("パスワードが間違っています");
}else{

	var data ={
			login : "login",
			password : $('#password').val(),
		};

		$.ajax({
			type:"POST",
			url: "php/initresist.php",
			data: data,
			success: function(data,dataType){
				if(data=="ok"){
					window.location="register-2.html";
				}else{
					openDialog(data);
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});
}

}

///セッションをチェックする
function check(){
if(key == "register-2" || key == "register-3" || key == "register-4" || key == "register-5"){

	var data={
		check:"check"
	};

	$.ajax({
			type:"POST",
			url: "php/initresist.php",
			data: data,
			success: function(data,dataType){
				if(data==""){
					window.location = "http://langchange.org/register-1.html";
				}else if(key!=data){
					window.location = "http://langchange.org/"+data+".html";
				}

			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});
}

}


//確認
function next(){
	//一時保存
	var data;
	var msg="";


	switch (key){
		case 'register-2':
			if($('#name').val()=="" || $('#country').val()=="" || $('#mlanguage').val()=="" || $('#sex').val()=="" || $('#nation').val()=="" || $('#hobby').val()=="" || $('#mail').val()=="" || $('#password').val()=="" || $('#password2').val()==""){
				msg="入力されていない箇所があります";
				break;
			}
			if($('#name').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g)){
				msg="記号（;:,-+*\\/?$^|.）は利用できません";
				break;
			}

			if($('#college').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g)){
				msg="記号（;:,-+*\\/?$^|.）は利用できません";
				break;
			}
			if($('#nation').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g)){
				msg="記号（;:,-+*\\/?$^|.）は利用できません";
				break;
			}
			if(!$('#mail').val().match(/[@]/g)){
				msg="メールアドレスが正しく入力されていません";
				break;
			}

			if($('#mail').val().match(/[;:,\+\*\/\\\?\$\^\|]/g)){
				msg="記号（;:,+*\\/?$^|）は利用できません";
				break;
			}

			if($('#password').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g)){
				msg="記号（;:,-+*\\/?$^|.）は利用できません";
				break;
			}
			if($('#password2').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g)){
				msg="記号（;:,-+*\\/?$^|.）は利用できません";
				break;
			}

			if($('#password').val() != $('#password2').val()){
				msg="パスワードが一致しません";
				break;
			}

			//趣味配列調整
			for(var i = 0;i < hobbyArray.length;i=i+1){
				if(hobbyArray[i]==""){
					hobbyArray.splice(i,1);
					i = i-1;
				}
			}

			var birthday = $('#year').val()+"/"+$('#month').val()+"/"+$('#day').val();
			data={
				name : $('#name').val(),
				country:$('#country').val(),
				mlanguage:$('#mlanguage').val(),
				sex : $('#sex').val(),
				birthday : birthday,
				college : $('#college').val(),
				nation:$('#nation').val(),
				"hobby[]":hobbyArray,
				mail : $('#mail').val(),
				password : $('#password').val(),
				register3: "register-3",
			};
			pointa="3";
			break;
		case 'register-3':
			data={
				support : $('#support').val(),
				register4: "register-4",
			};
			pointa="4";
			break;
		case 'register-5':
			pointa="6";
			break;
	}


if(msg==""){
    // Ajaxで送信
    $.ajax({
	type:"POST",
	url:"php/initresist.php",
      data: data,
      success:function(data,dataType){
		if(data!=""){
			openDialog(data);
		}else if($("#country").val()=="外国人"){
			window.location = "english/register-3.html";
		}else{
			window.location = "register-"+pointa+".html";
		}
	},
	error:function(XMLHttpRequest,textStatus,errorThrown){

	}
    });
}else{
	openDialog(msg);
}

    return false;
}

///戻るボタン処理
function back(){

}

///プロフィールを登録
function resist(){
	var data={
		resist:"resist",
		register5:"register-5",
	};

    // Ajaxで送信
    $.ajax({
	type:"POST",
	data:data,
	url:"php/initresist.php",
      success:function(data,dataType){
		window.location = "register-5.html";
	},
	error:function(XMLHttpRequest,textStatus,errorThrown){

	}
    });

    return false;

}


///利用規約表示
function getTermofuse(){
	$('#termofuse').dialog({
		title: '利用規約',
		modal: true,
		width:'auto',
		height:'auto',
		create: function( event, ui ) {
        		jQuery(this).css("maxWidth", "850");
    		},
		buttons: {
			"閉じる": function(){
				$(this).dialog('close');
			}
		}
	});
}

///紹介者コード入力
function resistCode(){
if($('#invite-code').val().match(/[;:,\+\*\/\\\?\$\^\|\.]/g)){
	openDialog("紹介コードが間違っています");
}else{

	var data={
		resistCode:"resistCode",
		inviteCode:$("#invite-code").val(),
	};

    // Ajaxで送信
    $.ajax({
	type:"POST",
	data:data,
	url:"php/initresist.php",
      success:function(data,dataType){
		openDialog(data);
	},
	error:function(XMLHttpRequest,textStatus,errorThrown){

	}
    });
}
    return false;
}

///趣味
function changeHobby(hobby){
	if(hobby.value!="all"){
	 var hobbyFlag="off";
	 for(var i=0;i<hobbyArray.length;i=i+1){
	 	if(hobbyArray[i]==hobby.value)
	 	hobbyFlag = "on";
	 }

	if(hobbyFlag!="on"){
	hobbyArray.push(hobby.value);
	hobbyTags.push("<button onClick='delHobby("+hobbyCount+")'>"+hobby.value+" ×</button> ");
	hobbyCount = hobbyCount + 1;


	var hobbyTag = document.getElementById("hobbys");
	hobbyTag.innerHTML = "";
	for(var i=0;i<hobbyTags.length;i=i+1)
	hobbyTag.innerHTML = hobbyTag.innerHTML + hobbyTags[i];
	}

	}

}

///趣味タグを削除
function delHobby(count){
	hobbyTags[count] = "";
	hobbyArray[count] = "";

	var hobbyTag = document.getElementById("hobbys");
	hobbyTag.innerHTML = "";
	for(var i=0;i<hobbyTags.length;i=i+1)
	hobbyTag.innerHTML = hobbyTag.innerHTML + hobbyTags[i];

}

//iPhoneのための処理
function checkiPhone(){
	if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0){
    		openDialog("あなたが現在お使いの端末では、ビデオチャットを行うためにAppear.inのダウンロードが必須となります。");
	}

	//ブラウザ対応確認
	isSupported(['chrome','firefox']);
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
	if(thusBrowser=='crios'){
	openDialog("※注意<br/><br/> iPhoneをお持ちのかたは、ビデオチャットアプリ「Appear.in」をダウンロードの上、ブラウザはGoogle Chromeを必ずおつかいください。");
		return false;
	}
	else if(browserFlag != "on"){
		return true;
	}else{
		return false;
	}
     
};

///ブラウザ対応確認
function checkBrowser(){
	//ブラウザ対応確認
	if(isSupported(['chrome','firefox','crios']))
	openDialog("現在お使いのブラウザではご利用いただけません");
	else
	window.location = "login.html";
	
}
///紹介コード確認
function checkInvitation(){
	var data ={
			checkInvitation : "invitation",
		};

		$.ajax({
			type:"POST",
			url: "php/initresist.php",
			data: data,
			success: function(data,dataType){
				if(data!=""){
				document.getElementById("invite-code").value=data;
				document.getElementById("invite-code").disabled = "disabled";
				document.getElementById("invite-button").disabled = "disabled";
				resistCode();
				}

			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('メールが正しく送信されませんでした<br>メールアドレスを確認し、再度送信してください');
			}
		});
}

///教える言語調整
function changeLang(lang){
	if(lang.value=="外国人")
	document.getElementById("mlanguage").value="English";
	else
	document.getElementById("mlanguage").value="日本語";

}


///フォームを初期化
function initForm(){
	var data ={
			initForm : "initForm",
		};

		$.ajax({
			type:"POST",
			url: "php/initresist.php",
			data: data,
			success: function(data,dataType){
				var dataArray = data.split(",");
				document.getElementById("name").value = dataArray[0];
				document.getElementById("mail").value = dataArray[1];

			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
			}
		});
}
