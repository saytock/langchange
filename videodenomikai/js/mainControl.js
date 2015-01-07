onload = init;


//出席確認のための初期化
var checkTime=999;
var tillHour;
var tillMinute;
var tmpContain;
var videoOn = "off";
var videoTIme=0;
var checkAttends;
var checkstanby;
var stanbyFlag="on";

var year = eday.getFullYear();
var month = eday.getMonth() + 1; //何故か月は0‾11月に設定されてる
var date = eday.getDate();
var room="";

var timedifference=0;
var todayApoint=[];

var selfattend="";
var talktype;

///初期化
function init(){
	//ブラウザ対応確認
	isSupported(['chrome','firefox']);
	//セッション確認->checkSession.js
	checkSession();
	//サイドバー->sidebar.js
	sidebar();
	//ポップアップ設定
	$('.balloon').balloon({ position: "right"});//吹出しの用意
	//時差の取得
	getTimeDifference();
	//出席確認（ループ）
	//aLoop = setInterval("attendLoop()",1000*15);
	todaysApoint();
	setInterval("todaysApoint()",1000*10);

	//ビデオチャット確認
	checkVideo();



	//チュートリアル
	//if(document.cookie.indexOf("lang-tutorial")==-1)
	//showTutorial();


	//setAwayTimeout(10000); // 4 seconds
	//document.onAway = function() {window.open("https://appear.in/masanori","video chat","width=600px,height=400px,location=1");}
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
     if(browserFlag != "on")
     openDialog("現在のブラウザではビデオチャットが起動しないおそれがあります");

    return false;
};


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
				if(25<Number(thour)){
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
				if(tdate==date)
				todayApoint.push(init[i].slice(7));

				

			}


		
			//現在の予定を取得
			todaysApoint();

		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中');
		}
	});

	return false;

}



///本日の予定を作成
function todaysApoint(){
	var tmp="";
	for(var i = 0;i<todayApoint.length;i=i+1){

		if(cHour<=Number(todayApoint[i].slice(0,2))){ //現在の時間よりも先だったら
					//tmp = tmp + todayApoint[i];
					showAttend(todayApoint[i]); //出席ボタン表示
				

		}
	}

	if(document.getElementById("today-attend").innerHTML=="" && document.getElementById("skype").innerHTML==""){
		document.getElementById("today-attend").innerHTML = "トーク5分前にスタンバイボタンが表示されるので、準備ができたらクリックしてください。 おたがいにスタンバイ中になったら、ビデオウィンドウが立ち上がります。<br>トーク開始5分前から開始10分後までの間にスタンバイボタンを押してください。押されなかった場合、欠席扱いとなり、ペナルティーが生じます。 ";
	}
/*
	if(tmp!=""){
		//出席確認
		checkAttend();
	}
*/
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
		}else if(cHour == targetHour && cMinute<=10){
			timePoint=1;
		}else{
			triger = 1;
		}
	}else if(targetMinute=="30"){
		if(cHour==targetHour){
			if(25<=cMinute&&cMinute<=40)
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
    			foriPhone = "<br/>※appear.inをダウンロードしていない人は、<a href='howtouse.html#browser'>こちら</a>から必ずダウンロードを済ませてください。<br/>ビデオチャットに必要のアプリとなります。";
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
		attendText = "<div style='font-size:14pt'>"+targetTime + "</div><br/>出席ボタンを押して相手を待とう！<br/>お互いにスタンバイ中になるとビデオチャットが表示されます。コンタクトを取り、<div style='font-size:14pt;display:inline-block'>"+tillHour+":"+tillMinute+"</div>までトークしよう。<br/>※開始10分後までにボタンを押さないと出席扱いとならず、ペナルティが発生するので注意しましょう！<br/>自分： <div id='self-attend' style='display:inline-block'><button  style='width:200px' class='buttons' id='attend' value='"+targetTime+"' onClick='attend(this)'><img style='position:relative;bottom:-17px' class='stanby' src='images/stanby.png' width='200px' /></button></div>   相手： <div id='friendAttend' style='display:inline-block'> -未ログイン-</div>"+foriPhone;
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

///リローダー
function reloader(){
	window.location.reload();
}


///出席登録
function attend(time){


//出席ボタン連打防止も兼ねて
openDialog("あなたのスタンバイが完了しました。\nトーク開始までこちらのページでお待ちください。\n\n※10分経っても相手がスタンバイしない場合、あなたはLCコインを1枚獲得します。\n開始10分後までは相手を待ちましょう！");

	var dateTmp = date;
	var monthTmp=eday.getMonth() + 1;
	var timeTmp=time.value;

	//日付を整える
	if(date<10)
	dateTmp = "0"+date;

	//月を整える
	if(monthTmp<10)
	monthTmp = "0"+String(monthTmp);

	//時間を整える
	if(timeTmp.slice(1,2)==":")
	timeTmp = "0" + timeTmp;

	//出席処理
	var data ={
			attend	    : "attend",
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
				if(data=="plus"){
					openDialog("LCコインを1枚獲得しました");
					talktype="teaching";
				}else{
					talktype="learning";
				}

				stanbyFlag="on";
				clearTimeout(checkstanby);
				checkAttend(); //出席確認

			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中');
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
				openDialog('データ更新中');
			}
		});




	
}

///出席確認
function checkAttend(){
	var eday = new Date();
	var dateTmp=eday.getDate();
	var monthTmp=eday.getMonth() + 1;

	//日付を整える
	if(date<10)
	dateTmp = "0"+date;

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
				//相手が出席してるかの確認
				if(tmp[1]!="c"){
					checkStanby();
				}			

				//両者が出席していたらビデオチャット表示
				if(tmp[0]=="c"&&tmp[1]=="c"){
					document.getElementById("today-attend").innerHTML ="";
					document.getElementById("skype").innerHTML = "お互いの出席の確認がとれました。トークの時間は<div style='font-size:14pt;display:inline-block'>"+tillHour+":"+tillMinute+"</div>までです。<br/><br/>※ビデオチャットの起動に失敗した場合は、このページを再読み込みしてください";
					room = tmp[2];
					videoInit(tillHour,tillMinute);


				}else if(tmp[0]=="c"){
					try{
						selfattend="ok";
						document.getElementById("self-attend").innerHTML="<img style='position:relative;bottom:-17px' class='stanby' src='images/stanby-c.png' width='200px' />";
					}catch(e){}
				}

			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});

}

///出席確認（ループ）
/*
function attendLoop(){
	var dateTmp=eday.getDate();
	var monthTmp=eday.getMonth() + 1;

	//日付を整える
	if(date<10)
	dateTmp = "0"+date;

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
				//両者が出席していたらビデオチャット表示
				if(tmp[0]=="c"&&tmp[1]=="c"){
					document.getElementById("today-attend").innerHTML ="";
					document.getElementById("skype").innerHTML = "お互いの出席の確認がとれました。トークの時間は<div style='font-size:14pt;display:inline-block'>"+tillHour+":"+tillMinute+"</div>までです。<br/><br/>※ビデオチャットの起動に失敗した場合は、このページを再読み込みしてください";
					room=tmp[2];
					videoInit(tillHour,tillMinute);


				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});

}
*/

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
				setTimeout('stopVideo()',videoTime * 60 * 1000); 
				openDialog("あと"+videoTime+"分間トークができます");
				videoOn = "on";
				}

			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中');
			}
		});

}

}

function startVideo(){
	video = window.open("https://appear.in/"+room,"video chat","width=600px,height=400px,location=1");
	clearTimeout(videoApp);

}

///ビデオを止める
function stopVideo(){
	video.window.close();
	//表示を初期化
	document.getElementById("skype").innerHTML = "更新中です。";
	
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
				if(dataArray[0]=="c"&&dataArray[1]=="c"){
				room = dataArray[2]; //部屋の取得
				videoInit(dataArray[0],dataArray[1]);

				//トークの残り時間表示
				document.getElementById("today-attend").innerHTML ="";
				document.getElementById("skype").innerHTML = "お互いの出席の確認がとれました。トークの時間は<div style='font-size:14pt;display:inline-block'>"+tillHour+":"+tillMinute+"</div>までです。<br/><br/>※ビデオチャットの起動に失敗した場合は、このページを再読み込みしてください";

				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中');
			}
		});
}

///QRコードを表示
function openQR(){
	document.getElementById("qrcode").innerHTML = "";
	$('#qrcode').qrcode(document.getElementById("invLink").href);
	$('#qrcode').dialog({
		title: 'QRコード',
		modal: true,
		width:300,
		height:400,
		buttons: {
			"閉じる": function(){
				$(this).dialog('close');
			}
		}
	});


}

/*チュートリアルを表示
function showTutorial(){
	if(document.cookie.indexOf("lang-tutorial")==-1){
		$('#tutorial').dialog({
		title: 'チュートリアル',
		modal: true,
		width:600,
		height:600,
		buttons: {
			"閉じる": function(){
				$(this).dialog('close');
			}
		}
		});
	}

	if(document.getElementById("tutori-check").checked)
	document.cookie = "lang-tutorial=lang-tutorial";
	else
	document.cookie = "";

		$('#tutori-check').change(function(){
	if ($(this).is(':checked')) {
		document.cookie = "lang-tutorial=langtutorial";
	} else {
		 //日付データを作成する
  		var date1 = new Date();

 		 //1970年1月1日00:00:00の日付データをセットする
  		date1.setTime(0);

 		 //有効期限を過去にして書き込む
 		 document.cookie = "lang-tutorial=;expires="+date1.toGMTString();

	}
	});


}*/


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
		
			//現在の予定をとる
			schejule();
			//ポップを確認
			checkPop();
	
						
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中');
		}
	});

	return timedifference;
}
