onload = init

var type = "week";
var eday = new Date();
var currentMonth = eday.getMonth() + 1;
var currentYear = eday.getFullYear();
var timedifference = 0;

function init(){
	//セッションを確認
	checkSession();
	//最初は週間チャート
	text = "Weekly Chart";
	document.getElementById("week").disabled = "disabled";
	//時差を所得する
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
				openDialog('loading...');
			}
		});
	return false;
}



//データを取得する
function getData(){
	var data={
		currentYear : currentYear
	};

	$.ajax({
		type:"POST",
		url:"php/log.php",
		data:data,
		success:function(data,dataType){
			createGraph(data,type);
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('loading...');
		}
	});

	return false;
}

//グラフを作成する
function createGraph(data,type){
	var dataArray = data.split(",");
	var counta = [0,0,0,0,0,0,0,0];
	var tmp = 0;
	var pointa = 0;
	var key = currentMonth; //現在の月をキーとして初期化;
	var flag = 0;
	var endflag = 0; //処理をせずに終了する為のフラグ

	var text;
	var xline;
	var yline;

	var tmonth;
	var tdate;
	var thour;
	var tminute;
	var tval;


//月を整える
if(key<10)
key = "0"+key;

//週間チャートのグラフ作成
if(type=="week"){
text = "Weekly Chart:"+currentYear+"/"+currentMonth+"";
label = "";
xline = ['1?7th','8?15th','16?23rd','24th?'];


//学んだ時間の統計
	//該当個所まで時間を進める
	for(var i=0;i<dataArray.length;i=i+1){
		//時差を整える
		tmonth = dataArray[i].slice(0,2);
		tdate = dataArray[i].slice(3,5);
		thour = dataArray[i].slice(7,9);
		tminute = dataArray[i].slice(10,12);
		tval   = dataArray[i].slice(13);

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

		dataArray[i] = tmonth+"月"+tdate+"日="+thour+":"+tminute+tval;

		if(dataArray[i].substring(0,2) == key){
			flag = i;
			break;
		}
		if(dataArray[i] == "="){
			flag = i;
			endflag = 1;
			break;
		}
	}

//該当するデータが存在したら統計処理
if(endflag==0){
	for(var i=flag;i<dataArray.length;i=i+1){
		if(dataArray[i].substring(0,2) != key ){
			flag = i;
			break;
		}
		if(Math.floor(Number(dataArray[i].substring(3,5))/8) == 0){
			counta[0] = counta[0] + 1;
		}
		else if(Math.floor(Number(dataArray[i].substring(3,5))/8) == 1){
			counta[1] = counta[1] + 1;
		}
		else if(Math.floor(Number(dataArray[i].substring(3,5))/8) == 2){
			counta[2] = counta[2] + 1;
		}
		else{
			counta[3] = counta[3] + 1;
		}
	}


	//学んだ時間の末まで移動
	for(var i=flag;i<dataArray.length;i=i+1){
		if(dataArray[i] == "="){
			flag = i;
			break;
		}
	}
}

endflag=0;
//教えた時間の統計
	//該当の箇所まで時間を進める
	for(var i=flag+1;i<dataArray.length;i=i+1){
		if(dataArray[i].substring(0,2) == key){
			flag = i;
			break;
		}
		if(dataArray[i].substring(0,1) == "="){
			flag = i;
			endflag=1;
			break;
		}
	}



//該当するデータが存在したら統計処理
if(endflag==0){
	for(var i=flag;i<dataArray.length;i=i+1){
		if(dataArray[i].substring(0,2) != key){
			break;

		}
		if(Math.floor(Number(dataArray[i].substring(3,5))/8) == 0){
			counta[4] = counta[4] + 1;
		}
		else if(Math.floor(Number(dataArray[i].substring(3,5))/8) == 1){
			counta[5] = counta[5] + 1;
		}
		else if(Math.floor(Number(dataArray[i].substring(3,5))/8) == 2){
			counta[6] = counta[6] + 1;
		}
		else{
			counta[7] = counta[7] + 1;
		}
	}

}

}

//月間チャートのグラフ作成  ※見直し
if(type=="month"){

text = "Monthly Chart:"+currentYear+"";

var line1=currentMonth-3;
var line2=currentMonth-2;
var line3=currentMonth-1;
if(line1<1) line1 = line1+12;
if(line2<1) line2 = line2+12;
if(line3<1) line3 = line3+12;




xline = [String(line1)+'月',String(line2)+'月',String(line3)+'月',String(currentMonth)+'月'];
label = "月";
key = line1;

var key1=key;
var key2=key+1;
var key3=key+2;
var key4=key+3;

//月を整える
if(key<10) key = "0" + key;
if(key1<10) key1 = "0" + key1;
if(key2<10) key2 = "0" + key2;
if(key3<10) key3 = "0" + key3;
if(key4<10) key4 = "0" + key4;



//学んだ時間の統計
	//該当個所まで時間を進める
	for(var i=0;i<dataArray.length;i=i+1){
		//時差を整える
		tmonth = dataArray[i].slice(0,2);
		tdate = dataArray[i].slice(3,5);
		thour = dataArray[i].slice(7,9);
		tminute = dataArray[i].slice(10,12);
		tval   = dataArray[i].slice(13);

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

		dataArray[i] = tmonth+"月"+tdate+"日="+thour+":"+tminute+tval;

		if(dataArray[i].substring(0,2) == key1){
			flag = i;
			break;
		}
		if(dataArray[i].substring(0,2) == key2){
			key = key2;
			pointa = pointa + 1;
			flag = i;
			break;
		}
		if(dataArray[i].substring(0,2) == key3){
			key = key3;
			pointa = pointa + 2;
			flag = i;
			break;
		}
		if(dataArray[i].substring(0,2) == key4){
			key = key4;
			pointa = pointa + 3;
			flag = i;
			break;
		}
		if(dataArray[i] == "="){
			flag = i;
			endflag = 1;
			break;
		}
	}


//該当するデータがあれば統計処理
if(endflag==0){
	for(var i=flag;i<dataArray.length;i=i+1){
		if(dataArray[i] == "="){
			flag = i;
			counta[pointa] = tmp;
			tmp = 1;
			break;
		}
		if(pointa==4){
			flag = i;
			break;
		}
		if(key == dataArray[i].substring(0,2)){

			tmp = tmp + 1;
		}else{
			key = Number(key)+1;
			if(key<10)
			key = "0" + key;
			counta[pointa] = tmp;
			tmp = 0;
			pointa = pointa + 1;
		}
	}


	//学んだ時間の末まで移動
	for(var i=flag;i<dataArray.length;i=i+1){
		if(dataArray[i] == "="){
			flag = i;
			break;
		}
	}
}

tmp = 0;
endflag = 0;
pointa = 4;
key = line1;
if(key<10) key = "0" + key;

//教えた時間の統計
	//該当個所まで時間を進める
	for(var i=flag+1;i<dataArray.length;i=i+1){
		if(dataArray[i].substring(0,2) == key1){
			flag = i;
			break;
		}
		if(dataArray[i].substring(0,2) == key2){
			key = key2
			pointa = pointa + 1;
			flag = i;
			break;
		}
		if(dataArray[i].substring(0,2) == key3){
			key = key3
			pointa = pointa + 2;
			flag = i;
			break;
		}
		if(dataArray[i].substring(0,2) == key4){
			key = key4
			pointa = pointa + 3;
			flag = i;
			break;
		}
		if(dataArray[i] == "="){
			flag = i;
			endflag = 1;
			break;
		}
	}


//該当するデータがあれば統計処理
if(endflag==0){
	for(var i=flag+1;i<dataArray.length;i=i+1){
		if(pointa == 8 || dataArray[i]== "="){
			break;
		}
		if(key == dataArray[i].substring(0,2)){
			tmp = tmp + 1;
		}else{
			key = Number(key) + 1;
			if(key<10)
			key = "0" + key;
			counta[pointa] = tmp;
			tmp = 0;
			pointa = pointa + 1;

		}
	}

}

}

//for(var i=0;i<8;i=i+1)
//alert(counta[i]);
yline=[0,2,4,6,8,10]
for(var i=0;i<8;i=i+1){
	if(counta[i]>10)
	yline=[0,5,10,15,20,25,30];
}


	var learning = [ [ 1, counta[0]], [ 2, counta[1] ], [ 3, counta[2] ], [ 4, counta[3] ] ];
	var teaching = [ [ 1, counta[4] ], [ 2, counta[5] ], [ 3, counta[6] ], [ 4, counta[7] ] ];

jQuery( function() {
    jQuery . jqplot(
		'log',
        [
            learning,teaching,
        ],
        {
       	stackSeries: true,
		seriesDefaults: {
       		renderer: jQuery . jqplot . BarRenderer,
			makerOptions:{
				size:12,
			}
	         },
		title:{
			text: text,
			fontSize:'20pt',
			textAlign:'left',
			//textColor:
		},
		series: [
                	{
				label: 'Learning time',
              		color: '#ffeeaa',
                	},
                	{
				label: 'Helping time',
              		color: '#aaeeff',
                	},
            	],
		legend: {
              	show: true,
              	placement: 'outsideGrid',
              	location: 'ne', //方角で指定
			//xoffset:,
			//yoffset:10,
            	},
       	axes: {
        		xaxis: {
        			renderer: jQuery . jqplot . CategoryAxisRenderer,
				pad:2,
				label:label,
				labelOptions:{
					fontSize:'14pt',
				},
				ticks:xline,
				tickOptions:{
					markSize:7,
				},
                	},
			yaxis: {
				label:'Time',
				min:0,
				ticks:yline,
				tickInterval:1,
				labelOptions:{
					fontSize:'14pt',
				},
				pad:2,
				tickOptions:{
					markSize:7,
				},
			}
         	}
        }
    );
} );

return false;
}

//グラフの変更
function changeGraph(changetype){
var val;
	if(changetype == "week"){
		//週間チャート表示
		document.getElementById("month").disabled = "";
		document.getElementById("week").disabled = "disabled";
		type = "week";
		val = document.getElementById("log");
		val.innerHTML = "";
		currentMonth = eday.getMonth() + 1;
		currentYear = eday.getFullYear();
		getData("week");
	}else{
		//月間チャート表示
		document.getElementById("week").disabled = "";
		document.getElementById("month").disabled = "disabled";
		type = "month";
		val = document.getElementById("log");
		val.innerHTML = "";
		currentMonth = eday.getMonth() + 1;
		currentYear = eday.getFullYear();

		getData("month");
	}
}

//ページの切り替え
function changepage(control){
	currentMonth = currentMonth + control;
	if(currentMonth ==0){
		currentYear = currentYear -1;
		currentMonth = 12;
	}
	if(currentMonth == 13){
		currentYear = currentYear + 1;
		currentMonth = 1;
	}

	//年を跨ぐ時のエラーを防ぐ
	if(currentMonth==1 && type=="month"){
		currentMonth=4;
	}
	if(currentMonth==3 && type=="month"){
		currentMonth=12;
		currentYear=currentYear-1;
	}



	val = document.getElementById("log");
	val.innerHTML = "";
	getData();
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
			//ログを取得する
			getData();

			//ポップを確認
			checkPop();


		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('loading...');
		}
	});

	return timedifference;
}
