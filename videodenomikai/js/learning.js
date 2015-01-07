onload=init;

var currentLevel = 'all'; ///レベルの変更
var currentSex = 'all';///性別の変更
var currentBirthday = 'all';///誕生日の変更
var currentNation = 'all';///出身国の変更
var serchable = ""; ///検索可能かどうか

var hobbyTags = ['all'];
var hobbyArray =['']; //タグajax用
var hobbyCount = 1;
var timedifference=0;

//初期化
function init(){
	//セッションの確認
	checkSession();
	//プロフィールダイアログ部分の非表示
	document.getElementById("profile").style.display="none";
	//スマフォ版とPC版の表示切り替えのための処理
	if($("#for_sp").css("display")){
	document.getElementById("for_sp").innerHTML = "";
	}else{
	document.getElementById("for_pc").innerHTML = "";
	}
	//時差を取得する
	getTimeDifference();
	
	
}

///予定の初期化
function initialize(){


	var data={
		init : "init",
		currentYear : year,
		currentLevel:currentLevel,
		currentSex  : currentSex,///性別の変更
		currentBirthday : currentBirthday,///誕生日の変更
		currentNation : currentNation,///出身国の変更
		currentName  : $("#username").val(),///名前
		"currentHobby[]": hobbyArray,
	};

	$.ajax({
		type:"POST",	
		url:"php/learning.php",
		data:data,	
		success:function(data,dataType){
			var flag=0;
			var init = data.split(",");
			var val;
			//現在の予定や登録状況を表示
			for(var i=0;i<init.length-1;i=i+1){
				if(init[i]=="="){
					flag = i;
					break;
				}
				try{
					val = document.getElementById(init[i].slice(0,12));
					val.innerHTML = init[i].slice(12);
				}catch(e){}
			}
			//友達の予定を追加
			for(var i=flag+1;i<init.length;i=i+1){
				try{
					if(i==init.length-2){
						flag = i;
						break;
					}
					val = document.getElementById("b-"+init[i].slice(0,12));
					val.title = val.title + init[i].slice(12);
				}catch(e){}	
			}
			$('.balloon').balloon({ position: "right"});//吹出しの用意
			//検索可能回数を表示
			try{
				document.getElementById("serching-count-sp").innerHTML = "検索可能回数： "+init[flag]+"回 <button onClick='addSerching()'>増やす</button>";
			}catch(e){};
			try{
				document.getElementById("serching-count").innerHTML = "検索可能回数： "+init[flag]+"回 <button onClick='addSerching()'>増やす</button>";
			}catch(e){};
			
			//検索状況
			if(init[flag+1]=="c")
			document.getElementById("start").disabled = "disabled";
			else
			serchable = 'no';
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中');
		}
	});
	return false;
}


///登録処理
function Resist(rDate){

//トーク5分前は登録できない
var eday = new Date();
var cYear = eday.getYear();
var cMonth = eday.getMonth()+1;
var cDate = eday.getDate();
var cHour = eday.getHours();
var cMinute = eday.getMinutes();

tmonth = rDate.value.slice(0,2);
tdate = rDate.value.slice(3,5);
thour = rDate.value.slice(7,9);
tminute = rDate.value.slice(10,12);
tval   = rDate.value.slice(13);


var tmpDate;
var tmpHour;
var tmpMinute=0;

//日付を整える
if(cDate<10)
tmpDate = "0" + cDate;
else
tmpDate = cDate;


//時間を整える
if(tminute=="00"){
tmpMinute=60;
tmpHour = cHour +1;
}else{
tmpMinute=30;
tmpHour = cHour;
}

//時間を整える
if(cHour<10)
tmpHour = "0" + tmpHour;
else
tmpHour = tmpHour;



if((tmpDate==tdate && tmpHour==thour && (tmpMinute-cMinute)<=5) || (tmpDate==tdate && thour<tmpHour)){
	openDialog("このトークはもう登録できません\n\n※トーク開始5分前まで登録ができます");
}

else{
openConfirm('LCコインを1枚使用し、自動マッチングを行います<br/><br/>※もう一度クリックでキャンセルできます<br/>ただしLCコインは戻りません',function(cancel){
	if(cancel){
		return false; 
	}else{ 	
	//検索に関する処理
	var serchingnow = "";
	if(currentSex == 'all'&& currentBirthday == 'all' && currentNation == 'all' && hobbyTags[0] == 'all' && $("#username").val() ==''){
		serchingnow = "no";
	}else{
		document.getElementById("start").disabled = "";
		document.getElementById("support").value="all";
		document.getElementById("sex").value="all";
		document.getElementById("birthday").value="all";
		document.getElementById("nation").value="all";
		document.getElementById("hobby").value="all";
		document.getElementById("username").value="";
		serchable="no";

		hobbyTags = ['all'];
		hobbyArray =[''];
		document.getElementById("hobbys").innerHTML="";
	}

	var data ={
			resistdate  : rDate.value,
			currentYear : year,
			serchingnow : serchingnow,
	};
	
	$.ajax({
		type:"POST",	
		url:"php/learning.php",
		data:data,		
		success:function(data,dataType){
			var dataArray = data.split(",");
			openDialog(dataArray[0]);
			if(dataArray[1]=="ok"){
				document.getElementById(dataArray[2]).innerHTML = "<div class='cancel buttons' onClick=\"cancelMatch('"+dataArray[2]+"')\"><img src='images/resistbutton-c.png'/></div>";
			}
			
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中');
		}
	});


	}});
}

}


///レベルの変更
function changeLevel(level){
	currentLevel = level.value;
	var val = document.getElementById("resist");
	val.innerHTML = "";
	val.innerHTML = createCallender("learning");
	initialize();

}

///性別の変更
function changeSex(sex){
if(checkSerching()){
	currentSex = sex.value;
	var val = document.getElementById("resist");
	val.innerHTML = "";
	val.innerHTML = createCallender("learning");
	initialize();
}else{
	openDialog("まずは検索開始ボタンを押し、次に検索条件を設定してください");
	document.getElementById("sex").value="all";
}

}

///誕生日の変更
function changeBirthday(birthday){
if(checkSerching()){
	if(birthday.value=='all')
	currentBirthday = 'all';
	else
	currentBirthday = birthday.value;
	
	var val = document.getElementById("resist");
	val.innerHTML = "";
	val.innerHTML = createCallender("learning");
	initialize();
}else{
	openDialog("まずは検索開始ボタンを押し、次に検索条件を設定してください");
	document.getElementById("birthday").value="all";
}
}

///出身国の変更
function changeNation(nation){
if(checkSerching()){
	currentNation = nation.value;
	var val = document.getElementById("resist");
	val.innerHTML = "";
	val.innerHTML = createCallender("learning");
	initialize();
}else{
	openDialog("まずは検索開始ボタンを押し、次に検索条件を設定してください");
	document.getElementById("nation").value="all";
}
}

///趣味
function changeHobby(hobby){
if(checkSerching()){

	if(hobby.value!="all"){


	//スケジュールの初期化	
	var val = document.getElementById("resist");
	val.innerHTML = "";
	val.innerHTML = createCallender("learning");

	
	hobbyArray.push(hobby.value); //趣味追加（検索用）
	hobbyTags.push("<button id='"+hobbyCount+"' onClick='delHobby("+hobbyCount+")'>"+hobby.value+" ×</button> "); //テーブルに趣味タグ追加
	hobbyCount = hobbyCount + 1; //趣味の数をカウント
	initialize(); //他ユーザーの予定を検索

	var hobbyTag = document.getElementById("hobbys");
	hobbyTag.innerHTML = "";
	for(var i=1;i<hobbyTags.length;i=i+1)
	hobbyTag.innerHTML = hobbyTag.innerHTML + hobbyTags[i];
	}
}else{
	openDialog("まずは検索開始ボタンを押し、次に検索条件を設定してください");
	document.getElementById("hobby").value="all";
}
}

///趣味タグを削除
function delHobby(count){
	hobbyTags[count] = "";
	hobbyArray[count] = "";

	//スケジュール再読み込み
	var val = document.getElementById("resist");
	val.innerHTML = "";
	val.innerHTML = createCallender("learning");
	initialize();	

	var hobbyTag = document.getElementById("hobbys");
	hobbyTag.innerHTML = "";
	for(var i=1;i<hobbyTags.length;i=i+1)
	hobbyTag.innerHTML = hobbyTag.innerHTML + hobbyTags[i];

}

///名前
function changeName(){
if(checkSerching()){

	if($('#username').val().match(/[;:,\-\+\*\/\\\?\$\^\|\.]/g)){
		openDialog("記号（;:,-+*\\/?$^|.）は利用できません");
	}else{

		var val = document.getElementById("resist");
		val.innerHTML = "";
		val.innerHTML = createCallender("learning");
		initialize();
	}
}else{
	openDialog("まずは検索開始ボタンを押し、次に検索条件を設定してください");
	document.getElementById("username").value="";
}
}

///検索開始ボタンが押されているかチェック
function checkSerching(){
	if(serchable == "no")
	return false;
	else
	return true;

}

///検索を開始する
function startSerching(){

openConfirm("検索可能回数を1消費し\n検索を開始しますか？\n\n※検索で絞り込んでのマッチング成立まで効果が続きます",
function(cancel){
	if(cancel){
		return false; 
	}else{

	var data = {
		start : "start",
	};

	$.ajax({
		type:"POST",	
		url:"php/serching.php",
		data:data,		
		success:function(data,dataType){
			var dataArray = data.split(",");
			if(dataArray[0]=="ok"){
				openDialog(dataArray[1]);
				document.getElementById("start").disabled = "disabled";
				serchable="";
			}else{
				openDialog(dataArray[1]);
			}
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中');
		}
	});

	}});
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
			//カレンダーの作成
			document.getElementById("resist").innerHTML = createCallender("learning"); //メインカレンダー
			document.getElementById("schejule").innerHTML = createCallender("friend"); //フレンド用カレンダー
	
			//予定の初期化
			initialize();

			//ポップの確認
			checkPop();
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中');
		}
	});
	return false;
}

