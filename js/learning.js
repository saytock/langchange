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

var nationFlag="on";

//初期化
function init(){
	//セッションの確認
	checkSession();
	//プロフィールダイアログ部分の非表示
	document.getElementById("profile").style.display="none";
	//スマフォ版とPC版の表示切り替えのための処理
	if($("#for_sp").css("display")=="none"){
	document.getElementById("for_sp").innerHTML = "";
	}else{
	document.getElementById("for_pc").innerHTML = "";
	}

	//時差を取得する
	getTimeDifference();

}

///予定の初期化
function initialize(){
	eday = new Date();
	cYear = eday.getFullYear();

	var data={
		init : "init",
		currentYear : cYear,
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
					if(val.className=="talk-fail"){
					val.innerHTML = "<span style='color:#fff;text-weight:bold'>トーク不成立</span>";
					}else{
					val.innerHTML = init[i].slice(12);
					}
				}catch(e){}
			}
			//友達の予定を追加
			for(var i=flag+1;i<init.length;i=i+1){
				try{
					if(i==init.length-3){
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
				document.getElementById("serching-count-sp").innerHTML = "検索可能回数： "+init[flag]+"回 <button class='addsearch' onClick='addSerching()'>増やす</button>";
			}catch(e){};
			try{
				document.getElementById("serching-count").innerHTML = "検索可能回数： "+init[flag]+"回 <button class='addsearch' onClick='addSerching()'>増やす</button>";
			}catch(e){};

			//検索状況
			if(init[flag+1]=="c")
			document.getElementById("start").disabled = "disabled";
			else
			serchable = 'no';

			//出身地取得
			if(nationFlag=="on")
			document.getElementById("nation").innerHTML = init[flag+2];
			nationFlag = "off";


		},
		error:function(XMLHttpRequest,textStatus,errorThrown){

		}
	});
	return false;
}


///登録処理
function Resist(rDate){

/*トーク12時間前は登録できない*/
//現在の時間を取得
eday = new Date();
cYear = eday.getFullYear();
cMonth = eday.getMonth()+1;
cDate = eday.getDate();
cHour = eday.getHours();
cMinute = eday.getMinutes();

//対象の時間を取得
var tmonth = rDate.value.slice(0,2);
var tdate = rDate.value.slice(3,5);
var thour = rDate.value.slice(7,9);
var tminute = rDate.value.slice(10,12);
var tval   = rDate.value.slice(13);

//メールのための処理
forMailVal = forMail(tmonth,tdate,thour,tminute);


//時差の計算
prepareTime(cHour);

//処理用の一時変数
var tmpDate;
var tmpHour;
var tmpMinute=0;

//日付を整える
if(cDate<10)
tmpDate = "0" + cDate;
else
tmpDate = cDate;


//時間を整える
/*if(tminute=="00"){
tmpMinute=60;
tmpHour = cHour +1;
}else{
tmpMinute=30;
tmpHour = cHour;
}*/
tmpHour = cHour;

//12時間前は登録できない
var tmpHour2 = tmpHour + 12;
var tmpDate2=-999;
if(24<=tmpHour2){
tmpHour2 = tmpHour2 -24;
tmpDate2 = cDate + 1;
if(l_day<tmpDate2)
tmpDate2 = 1;
}

//時間を整える
if(tmpHour2<10)
tmpHour2 = "0" + tmpHour2;

//日付を整える
if(tmpDate2<10)
tmpDate2 = "0" + tmpDate2;

//日をまたぐときのための日付を整える
/*var tmpDate2 = cDate + 1;
if(tmpDate2<10)
tmpDate2 = "0" + tmpDate2;
*/

/*
if((tmpDate==tdate && thour<=(tmpHour2)) || ((tmpDate2)==tdate && thour<=(tmpHour2)) || (tdate<tmpDate2)){
	openDialog("このトークはもう予約できません<br><br>※トーク開始12時間前まで予約ができます");
}

else{*/
openConfirm('LCコインを1枚使用し、予約を行います。OKを押すと予約完了となり、メールが届きます。<br/><br/>※もう一度クリックでキャンセルできますが、LCコインは戻りません',function(cancel){
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
			currentYear : cYear,
			serchingnow : serchingnow,
			forMailVal : forMailVal,
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
				openDialog('この時間のトークは現在予約されていません');
				setTimeout("window.location.reload()",5000);
		}
	});


	}});
/*}*/

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
	 var hobbyFlag="off";
	 for(var i=0;i<hobbyArray.length;i=i+1){
	 	if(hobbyArray[i]==hobby.value)
	 	hobbyFlag = "on";
	 }

	if(hobbyFlag!="on"){


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

openConfirm("検索可能回数を1消費し<br>検索を開始しますか？<br><br>※絞り込み予約が完了するまで効果が続きます",
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

		}
	});
	return false;
}

///時差を計算する
function prepareTime(cTime){
	//時差の計算
	cTime = Number(cTime) - Number(timedifference);

	//時差がマイナスのときの処理
	if(24<=cTime){
		cTime = cTime - 24;
		cDate = cDate + 1;
	}

	//日の最後にいったら次の月へ
	if(cDate>l_day){
		cDate = 1;
		cMonth = cMonth + 1;
		if(cMonth==13){
			cMonth=1;
			cYear=cYear+1;
		}
	}

	//時差がプラスのときの処理
	if(cTime<0){
		cTime = cTime + 24;
		cDate = cDate -1;
	}
	//日が0日だったら、先月の最終日へ
	if(cDate==0){
		cDate= new Date(cYear,eday.getMonth(),0).getDate();
		cMonth = cMonth -1;
		if(cMonth==0){
			cMonth=12;
			cYear = cYear-1;
			//年が跨ぐ時の処理を考える
		}
	}

	cHour = cTime;
}

///メールのための処理
function forMail(mMonth,mDate,mHour,mMinute){
	mMonth = Number(mMonth);
	mDate = Number(mDate);
	mHour = Number(mHour);
	mMinute = Number(mMinute);

	//時差の計算
	mHour = Number(mHour) + Number(timedifference);

	//時差がマイナスのときの処理
	if(24<=mHour){
		mHour = mHour - 24;
		mDate = mDate + 1;
	}

	//日の最後にいったら次の月へ
	if(mDate>l_day){
		mDate = 1;
		mMonth = mMonth + 1;
		if(mMonth==13){
			mMonth=1;
			//cYear=cYear+1;
		}
	}

	//時差がプラスのときの処理
	if(mHour<0){
		mHour = mHour + 24;
		mDate = mDate -1;
	}
	//日が0日だったら、先月の最終日へ
	if(mDate==0){
		mDate= new Date(cYear,eday.getMonth(),0).getDate();
		mMonth = mMonth -1;
		if(mMonth==0){
			mMonth=12;
			//cYear = cYear-1;
			//年が跨ぐ時の処理を考える
		}
	}

	if(mMinute==0)
	mMinute = "00";

	return mMonth+"/"+mDate+" "+mHour+":"+mMinute;
}

