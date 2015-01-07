
///プロフィールを取得する
function getProfile(friendid){
	var apple=false; ///変更：いつでもプロフィールを表示できるように
	if(friendid.className=="Talk in Japanese" && apple){
		openDialog('Open your talks <br>and wait for the partner.');
	}else{


	var tmpid = friendid.id
	var data ={
			prof     : "prof",
			friendid : tmpid
		};

		$.ajax({
			type:"POST",
			url: "php/friend.php",
			data: data,
			success: function(data,dataType){
				//スケジュール作成 (プロフィールのための）
				document.getElementById("schejule").innerHTML = "";
				document.getElementById("schejule").innerHTML = createCallender("friend");	
				//スケジュールの初期化
				Initialize(tmpid);
				//プロフィールの表示
				profile(data);
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});
	}
		return false;

}


//スケジュールの初期化
function Initialize(friendid){
	var data={
		init : "init",
		friendid : friendid,
		currentYear : year
	};

	$.ajax({
		type:"POST",
		url:"php/friend.php",
		data:data,
		success:function(data,dataType){
			var init = data.split(",");
			var val;
			//現在の予定や登録状況を表示
			for(var i=0;i<init.length-1;i=i+1){
				try{
					val = document.getElementById('f-'+init[i].slice(0,12));
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


//プロフィールを表示
function profile(data){
	var profArray = data.split(",");
	//写真を表示
	var prof = "<img src='../prof/"+profArray[0]+"' width='130px' height='150px' />";
	var val = document.getElementById("image");
	val.innerHTML = prof;
	//情報を表示
	prof = "Name: "+profArray[1]+"<br/>";
	prof = prof+"Gender: "+profArray[2]+"<br/>";
	//prof = prof+"Birthday: "+profArray[3]+"<br/>";
	//prof = prof+"School: "+profArray[4]+"<br/>";
	prof = prof+"Birth Place: "+profArray[5]+"<br/>";
	prof = prof+"Japanese Level: "+profArray[6]+"<br/>";
	prof = prof+"<br/><br/><input type='button' name='block' value='Block' onClick=\"block('"+profArray[7]+"')\" />";
	val = document.getElementById("privacy");
	val.innerHTML = prof;


	$('#profile').dialog({
		title: 'Profile',
		modal: true,
		height:600,
		width:'auto',
    		create: function( event, ui ) {
        		jQuery(this).css("maxWidth", "1000px");
    		},
		buttons: {
			"OK": function(){
				$(this).dialog('close');
			}
		}
	});
}

///登録処理
function resist(rDate){
var val;
var rDateArray = rDate.value.split("_");

//トーク12時間前は登録できない
eday = new Date();
cYear = eday.getFullYear();
cMonth = eday.getMonth()+1;
cDate = eday.getDate();
cHour = eday.getHours();
cMinute = eday.getMinutes();

var tmonth = rDateArray[0].slice(2,4);
var tdate = rDateArray[0].slice(5,7);
var thour = rDateArray[0].slice(9,11);
var tminute = rDateArray[0].slice(12,14);
var tval = rDateArray[0].slice(15);

//メールのための処理
forMailVal = forMail(tmonth,tdate,thour,tminute);

//時差を計算
prepareTime(cHour);

//処理のための一時変数
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

/*if((tmpDate==tdate && thour<=(tmpHour2)) || ((tmpDate2)==tdate && thour<=(tmpHour2)) || (tdate<tmpDate2)){
	openDialog("You cannot book talks later than 12 hours before they start.");
}

else{*/
openConfirm('Book the talk?',
function(cancel){
	if(cancel){
		return false;
	}else{

	val = document.getElementById(rDateArray[0]);
	val.innerHTML = "<div class='cancel buttons' onClick=\"cancelMatch('"+rDateArray[0]+"')\"><img src='images/resistbutton-c.png'/></div>";

	var data ={
			resistdate : rDateArray[0].slice(2),
			friendid   : rDateArray[1],
			currentYear : cYear,
			forMailVal : forMailVal,
	};

	$.ajax({
		type:"POST",
		url:"php/friend.php",
		data:data,
		success:function(data,dataType){
			openDialog(data);

		},
		error:function(XMLHttpRequest,textStatus,errorThrown){

		}
	});

	}});
/*}*/

}

///マッチング済キャンセル処理
function cancelMatch(dateIndex){
//トーク5分前はキャンセルできない
 eday = new Date();
cYear = eday.getYear();
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
else
tmpHour = tmpHour;

//日をまたぐときのための日付を整える
var tmpDate2 = cDate + 1;
if(tmpDate2<10)
tmpDate2 = "0" + tmpDate2;


if((tmpDate==tdate && tmpHour==thour && (tmpMinute-cMinute)<=5) || (thour=="00" && cHour == 23 && 55<=cMinute && tdate == tmpDate2)){
	openDialog("You cannot cancel talks later than 5 minutes before they start.");

}else{
openConfirm("Are you sure to cancel the talk?<br/><br/>**LC coin you used will not be returned.",
function(cancel){
	if(cancel){
		return false;
	}else{


	//キャンセルの時間によってはペナルティ
	var currentTime = cYear * 100000000 + cMonth * 1000000 + cDate * 10000 + cHour * 100 + cMinute;

	//セル内を書き換える(learningのほう)
	try{
		var val = document.getElementById(dateIndex);
		val.innerHTML = "";
	}catch(e){}
	//セル内を書き換える(friendのほう)
	try{
		var val = document.getElementById("f-"+dateIndex);
		val.innerHTML = "";
	}catch(e){}



	var data ={
			mCancel : "mCancel",
			date : dateIndex,
			currentYear:year,
			currentTime:currentTime,
			forMailVal : forMailVal,
	};

	$.ajax({
		type:"POST",
		url:"php/learning.php",
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


//ブロックする
function block(friendid){
openConfirm('Are you sure to block the user?',
function(cancel){
	if(cancel){
		return false;
	}else{

		var data ={
			block     : "block",
			friendid : friendid
		};

		$.ajax({
			type:"POST",
			url: "php/friend.php",
			data: data,
			success: function(data,dataType){
				openDialog(data);
				window.location.reload();
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});
	}});

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
