onload=init;

var side;
var timedifference=0;

//初期化
function init(){
	//セッションの確認
	checkSession();
	//時差の取得
	getTimeDifference();

	//自動更新
	//setInterval("checkAttend()",1000*10);

}


//スケジュールの初期化
function initialize(){
	eday = new Date();
	cYear = eday.getFullYear();

	var data={
		init : "init",
		currentYear:cYear,
	};

	$.ajax({
		type:"POST",
		url:"php/teaching.php",
		data:data,
		success:function(data,dataType){
			var init = data.split(",");
			var val;
			for(var i=0;i<init.length-1;i=i+1){
				try{
					val = document.getElementById(init[i].slice(0,12));
					if(val.className=="talk-fail"){
					val.innerHTML = "<span style='color:#fff;text-weight:bold'>not matched.</span>";
					}else{
					val.innerHTML = init[i].slice(12);
					}
				}catch(e){}
			}
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){

		}
	});
	return false;
}


///登録処理
function resist(rDate){

//トーク12時間前は登録できない
eday = new Date();
cYear = eday.getFullYear();
cMonth = eday.getMonth()+1;
cDate = eday.getDate();
cHour = eday.getHours();
cMinute = eday.getMinutes();

tmonth = rDate.value.slice(0,2);
tdate = rDate.value.slice(3,5);
thour = rDate.value.slice(7,9);
tminute = rDate.value.slice(10,12);
tval   = rDate.value.slice(13);


var tmpDate;
var tmpHour;
var tmpMinute=0;

//時差を計算する
prepareTime(cHour);


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


/*if((tmpDate==tdate && thour<=(tmpHour2)) || ((tmpDate2)==tdate && thour<=(tmpHour2)) || (tdate<tmpDate2)){
	openDialog("You cannot open talks later than 12 hours before they start.");
}


else{*/
openDialog('You opened the talk.<br>Click the button again to close it.<br><br>**You will lose 1 LC coin if you cancel a booked talk.');
	//セル内を書き換える
	var val = document.getElementById(rDate.value);
	val.innerHTML = "<button class='cancel buttons' onClick=\"cancel('"+rDate.value+"')\"><img src='images/resistbutton-w.png'/></button>";


	var data ={
			resistdate : rDate.value,
			currentYear : cYear
	};

	$.ajax({
		type:"POST",
		url:"php/teaching.php",
		data:data,
		success:function(data,dataType){

		},
		error:function(XMLHttpRequest,textStatus,errorThrown){

		}
	});
/*}*/

	return false;

}

///キャンセル処理
function cancel(dateIndex){
	eday = new Date();
	cYear = eday.getFullYear();

	//セル内を書き換える
	var val = document.getElementById(dateIndex);
	val.innerHTML = "<div class='cancel' id='"+dateIndex+"'><button class='buttons' id='resistbutton' value='"+dateIndex+"' onClick='resist(this)' ><img src='images/resistbutton2.png'/></button></div>";
	var data ={
			cancel : "cancel",
			date : dateIndex,
			currentYear:cYear,
	};

	$.ajax({
		type:"POST",
		url:"php/teaching.php",
		data:data,
		success:function(data,dataType){
			if(data!="ok"){
				openDialog(data);
				window.location.reload();
			}
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){

		}
	});

}

///マッチング済キャンセル処理
function cancelMatch(dateIndex){
//トーク5分前はキャンセルできない
eday = new Date();
cYear = eday.getFullYear();
cMonth = eday.getMonth()+1;
cDate = eday.getDate();
cHour = eday.getHours();
cMinute = eday.getMinutes();

tmonth = dateIndex.slice(0,2);
tdate = dateIndex.slice(3,5);
thour = dateIndex.slice(7,9);
tminute = dateIndex.slice(10,12);
tval   = dateIndex.slice(13);

//メールのための処理
forMailVal = forMail(tmonth,tdate,thour,tminute);


//時差を計算する
prepareTime(cHour);


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

//日をまたぐときのための日付を整える
var tmpDate2 = cDate + 1;
if(tmpDate2<10)
tmpDate2 = "0" + tmpDate2;


if((tmpDate==tdate && tmpHour==thour && (tmpMinute-cMinute)<=5) || (thour=="00" && cHour == 23 && 55<=cMinute && tdate == tmpDate2)){
	openDialog("You cannot cancel talks later than 5 minutes before they start.");


}else{
openConfirm("Are you sure to cancel the talk?<br><br>You will lose 1 LC coin.",
function(cancel){
	if(cancel){
		return false;
	}else{


	var currentTime = cYear * 100000000 + (eday.getMonth()+1) * 1000000 + eday.getDate() * 10000 +  eday.getHours() * 100 + eday.getMinutes();


	//セル内を書き換える
	var val = document.getElementById(dateIndex);
	val.innerHTML = "<div class='cancel' id='"+dateIndex+"'><button id='resist' class='buttons' value='"+dateIndex+"' onClick='resist(this)' ><img src='images/resistbutton2.png' /></button></div>";
	var data ={
			mCancel : "mCancel",
			date : dateIndex,
			currentYear:cYear,
			currentTime:currentTime,
			forMailVal : forMailVal,
	};

	$.ajax({
		type:"POST",
		url:"php/teaching.php",
		data:data,
		success:function(data,dataType){
			openDialog(data);
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){

		}
	});

	}});

}


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
			document.getElementById("resist").innerHTML = createCallender("teaching");
			//予定を表示
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

	return mMonth+"月"+mDate+"日 "+mHour+":"+mMinute;
}
