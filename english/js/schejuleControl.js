onload = init;
unload = clearInterval();

//カレンダーのための初期化
var eday = new Date();
var year = eday.getFullYear();
var month = eday.getMonth() + 1; //何故か月は0?11月に設定されてる
var date = eday.getDate();
var cHour = eday.getHours();
var cMinute = eday.getMinutes();
var l_day = new Date(year,eday.getMonth()+1,0).getDate();
var youbi = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var timedifference=0;

var todayApoint=[];
var tomorrowApoint=[];
var pageControl="off";

///初期化
function init(){
	//セッション確認->checkSession.js
	checkSession();
	//時差の取得
	getTimeDifference();
	//チュートリアル
	//showTutorial();

	//自動更新
	//setInterval("checkAttend()",1000*10);

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

				if(pageControl=="off"){
				//今日の予定を取得
				if(tdate==date)
				todayApoint.push(init[i].slice(7));
				//明日の予定を取得
				if(tdate==(date+1))
				tomorrowApoint.push(init[i].slice(7));
				}

				val = document.getElementById(init[i].slice(0,6));

				if(val.innerHTML.slice(0,1)=="<"){
					document.getElementById('b-'+init[i].slice(0,6)).title = document.getElementById('b-'+init[i].slice(0,6)).title + "<br/>" + init[i].slice(7);
				}else{
					document.getElementById(init[i].slice(0,6)).className = 'apoint';
					val.innerHTML = "<a id='b-"+init[i].slice(0,6)+"' class='balloon' title='"+init[i].slice(7)+"'>"+val.innerHTML+"</a>";
				}

			}


			$('.balloon').balloon({ position: "right"});//吹出しの用意
			//※HTMLで該当個所を記述した後にバルーンを開始しないといけない

			//今日の予定を取得
			todaysApoint();
			//明日の予定を取得
			tomorrowsApoint();
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				alert('Error : ' + errorThrown);
		}
	});

	return false;

}

///カレンダーを作成する
function createCallendar(){
	var dateTmp;
	var monthTmp = month;
	var rowCounta=0;
	var callendar = "<input style='position:absolute;left:0' type='button' id='left' value='←' onClick='changepage(-1)' /><input style='position:absolute;left:40px' type='button' id='right' value='→' onClick='changepage(1)' /><ul><li style='background:#ff6666'>Today</li><li style='background:#ffeeaa'>Talk Schedule</li></ul><table width='400px' height='400px'><span>"+year+"/"+month+"</span><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr><tr>";
	//月末を取得
	var l_day = new Date(year,month,0).getDate();
	//月初めの曜日を取得
	var week = new Date(year,month-1,1).getDay();
	//月を整える
	if(month<10)
	monthTmp = "0"+month;

	//空白を埋める
	for(var k=0;k<week;k=k+1){
		callendar = callendar + "<td></td>";
		rowCounta = rowCounta + 1;
	}
	//カレンダーを作成
	for(var i=1;i<=l_day;i=i+1){
		//7日ごとに改行
		if((rowCounta%7) == 0){
			callendar = callendar + "</tr><tr>";
		}
		//日にちを整える
		if(i<10){
			dateTmp = "0"+i;
		}else{
			dateTmp = i;
		}
		callendar = callendar + "<td id='"+monthTmp+"月"+dateTmp+"日"+"'>"+i+"</td>";
		rowCounta = rowCounta + 1;
	}
	//空白を埋める
	while(rowCounta%7 != 0){
		callendar = callendar + "<td></td>";
		rowCounta = rowCounta + 1;
	}

	callendar = callendar + "</tr></table>";
	return callendar;
}

///本日の予定を作成
function todaysApoint(){
//	var currentTime = eday.getHours() * 100 + eday.getMinutes();


var tmpMonth = month;
var tmpDate = date;

if(tmpMonth<10)
tmpMonth = "0" + tmpMonth;
if(tmpDate<10)
tmpDate = "0" + tmpDate;

	//本日のカレンダーを強調
	if(month==eday.getMonth()+1&&year==eday.getFullYear())
	document.getElementById(tmpMonth+"月"+tmpDate+"日").className = 'currentDay';


	//予定を表示
	var tmp ="<h2>Today's Schedule-</h2>";
	for(var i = 0;i<todayApoint.length;i=i+1){
			tmp = tmp + todayApoint[i];
			tmp = tmp + "<br/>";
	}
	document.getElementById("todaysApoint").innerHTML = "";
	document.getElementById("todaysApoint").innerHTML = tmp;


}

///明日の予定を取得
function tomorrowsApoint(){

	//予定を表示
	var tmp ="<h2>-Tommorow's Schedule-</h2>";
	for(var i = 0;i<tomorrowApoint.length;i=i+1){
			tmp = tmp + tomorrowApoint[i];
			tmp = tmp + "<br/>";
	}

	document.getElementById("tomorrowApoint").innerHTML = "";
	document.getElementById("tomorrowApoint").innerHTML = tmp;


}


///ページの切り替え
function changepage(control){
	month = month + control;
	if(month ==0){
		year = year -1;
		month = 12;
	}
	if(month == 13){
		year = year + 1;
		month = 1;
	}

	val = document.getElementById("schejule");
	val.innerHTML = "";
	pageControl="on";
	getTimeDifference();
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

			//カレンダーの初期化
			document.getElementById("schejule").innerHTML = createCallendar();
			//スケジュール表示
			schejule();
			//ポップの確認
			checkPop();
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				alert('Error : ' + errorThrown);
		}
	});

	return false;
}

//チュートリアル
/*
function showTutorial(){
	if(document.cookie.indexOf("lang-tutorial")==-1){
		introJs().setOption('doneLabel', 'Next page').start().oncomplete(function() {
            window.location.href = 'mainpage-g1.html?multipage=true';
  	  });

       if (RegExp('multipage', 'gi').test(window.location.search)) {
         introJs().start();
       }
		document.cookie = "lang-tutorial=lang-tutorial";

	}
}*/

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
