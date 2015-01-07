onload = init;

var eday = new Date();
var year = eday.getFullYear();

var hobbyCount=0;
var hobbyTags=[];
var hobbyArray=[];

var timedifference=0;

function init(){
	checkSession();
	setBirthdaySpinbox();
	initialize();
	getTimeDifference();

	//自動更新
	//setInterval("checkAttend()",1000*10);

}

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
				if(data=="ok")
				window.location="login.html";
				
			},

			error: function(XMLHttpRequest,textStatus,errorThrown){
				
			}
		});
	return false;	
}


//設定情報取得
function initialize(){
	var data = { init :"init"};

	$.ajax({
		type:"POST",	
		url:"php/setting.php",
	      data: data,
	      success:function(data,dataType){
			var dataArray = data.split(",");
			document.getElementById("name").value = dataArray[0];
			document.getElementById("mlanguage").value = dataArray[1];
			document.getElementById("sex").value = dataArray[2];
			var birthdayArray = dataArray[3].split("/");
			document.getElementById("year").value = birthdayArray[0];
			document.getElementById("month").value = birthdayArray[1];
			document.getElementById("day").value = birthdayArray[2];
			document.getElementById("college").value = dataArray[4];
			document.getElementById("nation").value = dataArray[5];
			var hobbyVal = dataArray[6].split("_");
			for(var i=0;i<hobbyVal.length-1;i=i+1){
				hobbyTags.push("<input type='button' name='hobby"+hobbyCount+"' onClick='delHobby("+hobbyCount+")' value='"+hobbyVal[i]+" ×' /> <input type='hidden' name='hobby"+hobbyCount+"' onClick='delHobby("+hobbyCount+")' value='"+hobbyVal[i]+" ×' /> ");
				hobbyArray.push(hobbyVal[i]);
				hobbyCount = hobbyCount + 1;	
			}
			var hobbyTag = document.getElementById("hobby");
			hobbyTag.innerHTML = "";
			for(var i=0;i<hobbyTags.length;i=i+1)
			hobbyTag.innerHTML = hobbyTag.innerHTML + hobbyTags[i];
			document.getElementById("support").value = dataArray[7];
			document.getElementById("mail").value = dataArray[8];
			document.getElementById("password").value = dataArray[9];
			document.getElementById("password2").value = dataArray[9];

		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				
		}
	    });

    return false;
}

//プロフィールを登録
function resist(){

if($('#name').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g))
openDialog("記号（;:,-+*\\/?$^|.）は利用できません");
else if($('#college').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g))
openDialog("記号（;:,-+*\\/?$^|.）は利用できません");
else if($('#nation').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g))
openDialog("記号（;:,-+*\\/?$^|.）は利用できません");
else if(!$('#mail').val().match(/[@]/g))
openDialog("メールアドレスが正しく入力されていません");
else if($('#mail').val().match(/[;:,\-\+\*\/\\\?\$\^\|]/g))
openDialog("記号（;:,-+*\\/?$^|）は利用できません");
else if($('#password').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g))
openDialog("記号（;:,-+*\\/?$^|.）は利用できません");
else if($('#password2').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g))
openDialog("記号（;:,-+*\\/?$^|.）は利用できません");
else if($('#password').val() != $('#password2').val())
openDialog("パスワードが一致しません");
else{
	//趣味の数を記憶
	document.getElementById("hobby").innerHTML = document.getElementById("hobby").innerHTML + "<input type='hidden' name='hCount' value='"+hobbyCount+"' />";

	// FormData オブジェクトを作成
	var form = $('#settingform').get()[0];
	var formData = new FormData( form );
    
	

    // Ajaxで送信
    $.ajax({
	type:"POST",	
	url:"php/setting.php",
      // dataに FormDataを指定
      data: formData,
      // Ajaxがdataを整形しない指定
      processData: false,
      // contentTypeもfalseに指定
      contentType: false,
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
	hobbyTags.push("<input type='button' name='hobby"+hobbyCount+"' onClick='delHobby("+hobbyCount+")' value='"+hobby.value+" ×' /> <input type='hidden' name='hobby"+hobbyCount+"' onClick='delHobby("+hobbyCount+")' value='"+hobby.value+" ×' /> ");
	hobbyCount = hobbyCount + 1;	


	var hobbyTag = document.getElementById("hobby");
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
	
	var hobbyTag = document.getElementById("hobby");
	hobbyTag.innerHTML = "";
	for(var i=0;i<hobbyTags.length;i=i+1)
	hobbyTag.innerHTML = hobbyTag.innerHTML + hobbyTags[i];

}

///時差を取得
function getTimeDifference(){
	var currentDay = eday.getDate();
	var currentHour = eday.getHours();
	var data={
		currentDay : currentDay,
		currentHour: currentHour,
	};

	$.ajax({
		type:"POST",
		url:"php/timedifference.php",
		data:data,
		success:function(data,dataType){
			timedifference =  data;
			//ポップの確認
			checkPop();
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){

		}
	});
	return false;
}

