onload = init;

//出席確認のための初期化
var checkTime=999;
var tillHour;
var tillMinute;
var tmpContain;
var videoOn = "off";
var videoTime=0;
var checkAttends;
var checkstanby;
var stanbyFlag="on";

var eday = new Date();
var year = eday.getFullYear();
var month = eday.getMonth() + 1; //何故か月は0?11月に設定されてる
var date = eday.getDate();
var room="";

var timedifference=0;
var todayApoint=[];

var selfattend="";
var talktype;
var tmpcHour;

///初期化
function init(){
	//ブラウザ対応確認
	//isSupported(['chrome','firefox','crios']);
	//セッション確認->checkSession.js
	checkSession();
	//サイドバー->sidebar.js
	sidebar();
	//時差の取得
	getTimeDifference();

}


///スケジュール表示
function schejule(){


//月を整える
var tmpMonth=month;
if(tmpMonth<10)
tmpMonth = "0"+String(tmpMonth);

//スケジュール（予定）の取得
var data = {
		init : "init",
		year : year,
		month: tmpMonth
};

	$.ajax({
		type:"POST",
		url:"php/main.php",
		data:data,
		success:function(data,dataType){
			var init = data.split(",");
			init.sort();
			var val;
			var tmonth;
			var tdate;
			var thour;
			var tminute;
			var tval;


			//予定表示
			for(var i=1;i<init.length;i=i+1){
				//時差を整える
				tmonth = init[i].slice(0,2);
				tdate = init[i].slice(3,5);
				thour = init[i].slice(7,9);
				tminute = init[i].slice(10,12);
				tval   = init[i].slice(13);

				thour = Number(thour) + Number(timedifference);
				//時差がプラスのときの処理
				if(24<=Number(thour)){
					thour = Number(thour) - 24;
					tdate = Number(tdate) + 1;
					if(tdate>l_day)
					continue;
					else if(tdate<10)
					tdate = "0" + String(tdate);
				}
				//時差がマイナスの時の処理
				if(Number(thour)<0){
					thour = Number(thour) + 24;
					tdate = Number(tdate) -1;
					if(tdate==0)
					continue;
					else if(tdate<10)
					tdate = "0" + String(tdate);
				}
				if(thour<10)
				thour = "0" + String(thour);

				init[i] = tmonth+"月"+tdate+"日="+thour+":"+tminute+tval;

				//今日の予定を取得
				eday = new Date();
				cDate = eday.getDate();
				cHour = eday.getHours();
				cMinute = eday.getMinutes();
				if(tdate==date)
				todayApoint.push(init[i].slice(7));
				else if(tdate==(cDate+1)&&thour=="00"&&tminute=="00"&&cHour==23&&55<=cMinute)
				todayApoint.push(init[i].slice(7));

			}



			//現在の予定を取得
			todaysApoint();

		},
		error:function(XMLHttpRequest,textStatus,errorThrown){

		}
	});

	return false;

}



///本日の予定を作成
function todaysApoint(){
		eday = new Date();
		cYear = eday.getFullYear();
		cMonth = eday.getMonth() + 1; //何故か月は0?11月に設定されてる
		cDate = eday.getDate();
		cHour = eday.getHours();
		cMinute = eday.getMinutes();
		l_day = new Date(cYear,eday.getMonth()+1,0).getDate();



	var tmp="";
//	eday = new Date();
//	cHour = eday.getHours();

	for(var i = 0;i<todayApoint.length;i=i+1){

		if(cHour<=Number(todayApoint[i].slice(0,2))){ //現在の時間よりも先だったら
				showAttend(todayApoint[i]); //出席ボタン表示

		}else if(todayApoint[i].slice(0,2)=="00"&&cHour==23&&55<=cMinute){
//alert(todayApoint[i]);
			showAttend(todayApoint[i]); //出席ボタン表示

		}
	}

	//出席確認デフォルト表示
	if(document.getElementById("today-attend").innerHTML=="" && document.getElementById("skype").innerHTML==""){
		document.getElementById("today-attend").innerHTML = "Standby button will show up 5 minutes before the talk. Click it when you're ready. Video window will show up when both of you have already clicked the button.<br>Please click the button no later than 10 minutes after the starting time. If you didn't, you will be regarded to be absent, and there will be <span style='color:#f00'>a penalty</span>.<br/>**Try reloading this page 5 minutes before the talk.";
	}

}


///出席ボタン表示
function showAttend(targetTime){
if(targetTime.indexOf("マッチング待ち")==-1){


	var timePoint=0;
	var targetHour = Number(targetTime.slice(0,2));
	var targetMinute = Number(targetTime.slice(3,5));
	var attendText = targetTime;
	tmpContain = document.getElementById("today-attend").innerHTML;
	var triger=0;

	eday = new Date();
	cHour = eday.getHours();
	cMinute = eday.getMinutes();



	//最も近いトークタイムを取得	※ボタンを表示するタイミング
	if(targetMinute=="00"){
		if((cHour+1) == targetHour && 55<=cMinute){
			timePoint=1;
		}else if(cHour == targetHour && cMinute<10){
			timePoint=1;
		}else if(cHour == 23 && 55<=cMinute && targetHour=="00" && targetMinute=="00"){
			timePoint=1;
		}else{
			triger = 1;
		}
	}else if(targetMinute=="30"){
		if(cHour==targetHour){
			if(25<=cMinute&&cMinute<40)
			timePoint=1;
			else
			triger=1;
		}else{
			triger=1;
		}
	}


	//トークタイムが予定と一致していたら出席ボタンを表示
	if(timePoint==1){
		//iPhoneユーザのための初期化
		var foriPhone = "";
		if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0){
    			foriPhone = "<br/>**Appear.in, app for video chat, is required. Please download one <a href='howtouse.html#browser'>here</a> if you haven't done.";
		}
		if(tillHour!=targetHour || tillMinute!=targetMinute+25){
			//次のトークスタンバイのための初期化
			document.getElementById("skype").innerHTML = "";
			selfattend="";
			videoOn="off";
		}

		tillHour = targetHour;
		tillMinute = targetMinute+25;
		checkTime = targetTime.slice(0,5);
		prepareTime(); //時差の計算
		attendText = "<div style='font-size:14pt'>"+targetTime + "</div><br/>Click the standby button and wait for your partner!<br/>When both of you have already clicked the button, video window will show up and automatically starts the call. The talk lasts unitl <div style='font-size:14pt;display:inline-block'>"+tillHour+":"+tillMinute+"</div>.<br/>Please click the button no later than 10 minutes after the starting time. If you didn't, you will be regarded to be absent, and there will be <span style='color:#f00'>a penalty</span>.<br/>You: <div id='self-attend' style='display:inline-block'><button  style='width:200px' class='buttons' id='attend' value='"+targetTime+"' onClick='attend(this)'><img style='position:relative;bottom:-17px' class='stanby' src='images/stanby.png' width='200px' /></button></div>   Your partner: <div id='friendAttend' style='display:inline-block'> -Coming Soon-</div>"+foriPhone;

		if(document.getElementById("skype").innerHTML=="" && selfattend!="ok"){
			val  = document.getElementById("today-attend");
			val.innerHTML = "";
			val.innerHTML =  attendText;
		}

		//出席確認
		checkAttend();

	}
}

	return false;
}

///出席登録
function attend(time){

//出席ボタン連打防止も兼ねて
openDialog("You have clicked the standby button.<br>Wait here until the talk starts.<br><br>In case your partner is late, please wait for him/her at most 10 minutes.");

	var dateTmp = cDate;
	var monthTmp=cMonth;
	var timeTmp=time.value;
	var yearTmp = eday.getFullYear();

	//日をまたぐときの処理
	if(tmpcHour=="00"&&cHour==23){
		//alert("ok");
		dateTmp = dateTmp + 1;
		if(dateTmp>l_day){
			monthTmp = monthTmp + 1;
			dateTmp = 1;
			if(monthTmp==13){
				monthTmp=1;
				yearTmp = yearTmp + 1;
			}
		}
	}


	//日付を整える
	if(dateTmp<10)
	dateTmp = "0"+dateTmp;

	//月を整える
	if(monthTmp<10)
	monthTmp = "0"+String(monthTmp);

	//時間を整える
	if(timeTmp.slice(1,2)==":")
	timeTmp = "0" + timeTmp;

//alert(yearTmp);
//alert(dateTmp);
//alert(monthTmp);
//alert(checkTime);


	//出席処理
	var data ={
			attend	    : "attend",
			year	    : yearTmp,
			month      : monthTmp,
			date	    : dateTmp,
			time 	    : checkTime,
		};

		$.ajax({
			type:"POST",
			url: "php/attend.php",
			data: data,
			success: function(data,dataType){
				if(data=="plus")
				openDialog("You got a LC coin.");

				stanbyFlag="on";
				clearTimeout(checkstanby);
				checkAttend(); //出席確認

			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});
}

///相手のスタンバイ状況取得→時間内に来なかったら、ポップアップ表示
function checkStanby(){

if(stanbyFlag=="on"){

	var stanbyTime;
	eday = new Date();
	cMinute = eday.getMinutes();


	if(25<=cMinute && cMinute<=40)
	stanbyTime = 40-cMinute;
	else if(55<=cMinute && cMinute<=60)
	stanbyTime = 70-cMinute;
	else if(0<=cMinute && cMinute<=10)
	stanbyTime = 10-cMinute;

	stanbyFlag="off";
	if(stanbyTime!=0)
	checkstanby = setTimeout("popMessage()",1000*60*stanbyTime);
}

}

///ポップアップ表示
function popMessage(){
	var data ={
			checkStanby	    : "checkStanby",
			talktype          : talktype,
		};

		$.ajax({
			type:"POST",
			url: "php/main.php",
			data: data,
			success: function(data,dataType){
				openDialog(data);
				clearTimeout(checkstanby);
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});

}

///出席確認
function checkAttend(){
	var dateTmp=cDate;
	var monthTmp=cMonth;

	//日をまたぐときの処理
	if(tmpcHour=="00"&&cHour==23){
		//alert("ok");
		dateTmp = dateTmp + 1;
		if(dateTmp>l_day){
			monthTmp = monthTmp + 1;
			dateTmp = 1;
			if(monthTmp==13){
				monthTmp=1;
				yearTmp = yearTmp + 1;
			}
		}
	}

	//日付を整える
	if(dateTmp<10)
	dateTmp = "0"+dateTmp;

	//月を整える
	if(monthTmp<10)
	monthTmp = "0"+String(monthTmp);


	//出席確認
	var data ={
			check	    : "check",
			year	    : eday.getFullYear(),
			month      : monthTmp,
			date	    : dateTmp,
			time 	    : checkTime,
		};

		$.ajax({
			type:"POST",
			url: "php/attend.php",
			data: data,
			success: function(data,dataType){
				var tmp = data.split(",");
				talktype=tmp[3];
				//相手が出席してるかの確認
				if(tmp[1]!="c"){
					checkStanby();
				}
				//両者が出席していたらビデオチャット表示
				if(tmp[0]=="c"&&tmp[1]=="c"){
					document.getElementById("today-attend").innerHTML ="";
					document.getElementById("skype").innerHTML = "<img style='float:right;' src='images/allowpopups.png' width='250px' /><span style='color:#f00;'>Please allow pop-ups when video window shows up.</span>Your partner is now ready! Enjoy the talk until <div style='font-size:14pt;display:inline-block'>"+tillHour+":"+tillMinute+"</div>.<br/><br/>**If video chat window didn't show up, please reload this page (Press F5).";
					room = tmp[2];
					videoInit(tillHour,tillMinute);

				}else if(tmp[0]=="c"){
					try{
						selfattend="ok";
						document.getElementById("today-attend").innerHTML = "";
						document.getElementById("today-attend").innerHTML="<img style='float:right;' src='images/newtab.png' width='250px' /><br>**Please do not close Main Page or move to other page during the video. Open <span style='color:#f00;'>a new tab</span> or<span style='color:#f00;'> a new window</span> to see other pages.<br/>You: <img style='position:relative;bottom:-17px' class='stanby' src='images/stanby-c.png' width='200px' />  Your partner: <div id='friendAttend' style='display:inline-block'> -Coming Soon-</div>";
					}catch(e){}
				}

			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});

}


///ビデオチャットを表示する
var video;
var videoApp;

function videoInit(tillHour,tillMinute){
clearTimeout(checkstanby);
if(videoOn=="off"){
	eday = new Date();
	cHour = eday.getHours();
	cMinute = eday.getMinutes();


	var currentTime = cHour * 100 + cMinute;
	var tillTime = Number(tillHour) * 100 + Number(tillMinute);
	if(55<=cMinute)
	currentTime = currentTime + 40;
	videoTime = tillTime - currentTime;
	var endVideo = "";

	if(tillHour==0&&55<=cMinute)
	videoTime = 25 + cMinute-55;


	//ビデオチャット終了
	if(videoTime<=0)
	endVideo = "end";


	var data = {
			tillHour:tillHour,
			tillMinute:tillMinute,
			langVideo : "langVideo",
			endVideo  : endVideo,
		};
	$.ajax({
			type:"POST",
			url: "php/langvideo.php",
			data:data,
			success: function(data,dataType){
				if(data!="end" && 0<videoTime){
					videoApp = setTimeout('startVideo()',3000);
					setTimeout('setPopup()',videoTime * 60 * 1000 - 15000);
					setTimeout('stopVideo()',videoTime * 60 * 1000);
					openDialog(" "+videoTime+" minutes are left for the talk.");
					videoOn = "on";
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});

}

}


///ビデオ終了ポップアップ
function setPopup(){
	openDialog("まもなくビデオが終了致します（あと15秒）");
}

///ビデオを始める
function startVideo(){
	video = window.open("https://appear.in/"+room,"video chat","width=600px,height=400px,location=1");
	clearTimeout(videoApp);

}

///ビデオを止める
function stopVideo(){
	video.window.close();
	//表示を初期化
	videoOn="off";
	window.location.reload();

}

///トーク中かの確認
function checkVideo(){
	var data ={
			checkVideo:"checkVideo",
		};

		$.ajax({
			type:"POST",
			url: "php/langvideo.php",
			data: data,
			success: function(data,dataType){
				var dataArray = data.split(",");
				if(dataArray[0]!=""&&dataArray[1]!=""){
				room = dataArray[2]; //部屋の取得
				videoInit(dataArray[0],dataArray[1]);
				if(videoOn=="on"){
				//トークの残り時間表示
				document.getElementById("today-attend").innerHTML ="";
				document.getElementById("skype").innerHTML = "<img style='float:right;' src='images/allowpopups.png' width='250px' />Your partner is now ready! Enjoy the talk until <div style='font-size:14pt;display:inline-block'>"+tillHour+":"+tillMinute+"</div>.<br/><br/>**If video chat window didn't show up, please reload this page (Press F5).<br><span style='color:#f00;'>Please allow pop-ups when video window shows up.</span>";
				}
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});
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
			timedifference = data;
			//ポップを確認
			checkPop();

			//現在の予定をとる
			schejule();
			//出席確認（ループ）
			setInterval("todaysApoint()",1000*10);
			//ビデオチャット確認
			checkVideo();
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){

		}
	});

	return timedifference;
}

///時差の計算
function prepareTime(){
	tmpcHour = checkTime.slice(0,2);
	cTime = Number(tmpcHour) - Number(timedifference);

	//時差がマイナスのときの処理
	if(24<=cTime){
		cTime = cTime - 24;
		cDate = Number(cDate) + 1;
	}

	//日の最後にいったら次の月へ
	if(Number(cDate)>l_day){
		cDate = 1;
		cMonth = Number(cMonth) + 1;
		if(cMonth==13){
			cMonth2=1;
			//cYear=cYear+1;
		}
	}

	//時差がプラスのときの処理
	if(cTime<0){
		cTime = cTime + 24;
		cDate = Number(cDate) -1;
	}
	//日が0日だったら、先月の最終日へ
	if(cDate==0){
		cDate= new Date(cYear,eday.getMonth(),0).getDate();
		cMonth = Number(cMonth) -1;
		if(cMonth==0){
			cMonth=12;
			//cYear = cYear-1;
			//年が跨ぐ時の処理を考える
		}
	}

	if(cTime<10)
	cTime = "0" + cTime;

	checkTime = cTime + ":" + checkTime.slice(3,5);

}

///プロフィールを取得する
function getProfile(friendid){
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
				//プロフィールの表示
				profile(data);
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

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
	prof = "Name： "+profArray[1]+"<br/>";
	prof = prof+"Gender： "+profArray[2]+"<br/>";
	//prof = prof+"生年月日： "+profArray[3]+"<br/>";
	//prof = prof+"大学： "+profArray[4]+"<br/>";
	prof = prof+"Birth Place: "+profArray[5]+"<br/>";
	prof = prof+"Japanese Level: "+profArray[6]+"<br/>";
	val = document.getElementById("privacy");
	val.innerHTML = prof;


	$('#profile').dialog({
		title: 'profile',
		modal: true,
		height:'auto',
		width:'auto',
    		create: function( event, ui ) {
        		jQuery(this).css("maxWidth", "300px");
    		},
		buttons: {
			"OK": function(){
				$(this).dialog('close');
			}
		}
	});
}
