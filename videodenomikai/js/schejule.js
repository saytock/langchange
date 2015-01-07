//カレンダーのための初期化
var eday = new Date();
var year = eday.getFullYear();
var cTime = eday.getHours();
var cMinute = eday.getMinutes();
var youbi = ["日","月","火","水","木","金","土"];
var l_day = new Date(year,eday.getMonth()+1,0).getDate();

var table;


///カレンダーの作成
function createCallender(type){
	table = "<table border='1'><tr><th></th>";
	dayset(); //カレンダーの横軸を作成
	resistset(type); //カレンダーにインデックスをつける
	table = table + "</table>";
	
	return table;
}

///カレンダーの横軸を作成
function dayset(){
	var month = eday.getMonth() + 1; //何故か月は0‾11月に設定されてる
	var date = eday.getDate();
	var tmp;
	var week;
	var dateTmp;

///スマートフォンのための処理
var sp=0;


	week = new Date(year,month-1,date).getDay();

	for(var i=0;i<6;i=i+1){
		tmp = week + i;
		if((week+i)>=7){
			tmp = tmp - 7;
		}
		//ラストデイのとこあとで見直し
		if(date+i>l_day){
			month=month+1;
			dateTmp = date+i-l_day;
		}else{
			dateTmp = date+i;
		}
		if(month==13){
			month=1;
		}
		if(2<sp)
		table = table + "<th class='no-sp'>"+String(month)+"月"+String(dateTmp)+"日("+String(youbi[tmp])+")</th>";
		else	
		table = table + "<th>"+String(month)+"月"+String(date+i)+"日("+String(youbi[tmp])+")</th>";
	
		sp=sp+1;
	}

	table = table + "</tr>";
}

//カレンダーにインデックス（目印を作成）
function resistset(type){
var tmpTime = 0;
var resistdate;
var tmpDate;
var month = eday.getMonth() + 1; //何故か月は0‾11月に設定されてる
var date = eday.getDate();
var tmpMonth = month;
var rTime=0;
var unableTime=17 + Number(timedifference);
var unableTime2=22 + Number(timedifference);

//alert(unableTime);
//alert(unableTime2);

//スマートフォンのための処理
var sp=0;
var sptd= "<td>";


	for(var a = 0;a<24;a=a+1){
		table = table + "<tr><th>" + tmpTime + ":00</th>";
		sp=0;
		for(var b = 0;b<6;b=b+1){

			//時差の計算
			rTime = Number(tmpTime) - Number(timedifference);

			tmpDate = date + b;
			tmpMonth = month;
			//時差がマイナスのときの処理
			if(25<rTime){
				rTime = rTime - 24;
				tmpDate = tmpDate + 1;
			}
			//日の最後にいったら次の月へ
			if(tmpDate>l_day){
				tmpDate = tmpDate - l_day;
				tmpMonth = month + 1;
			}
			
			//時差がプラスのときの処理
			if(rTime<=0){
				rTime = rTime + 24;
				tmpDate = tmpDate -1;
			}		
			//日が0日だったら、先月の最終日へ			
			if(tmpDate==0){
				tmpDate= new Date(yearTmp,eday.getMonth(),0).getDate();
				monthTmp = monthTmp -1;
				if(monthTmp==0){
					monthTmp=12;
					//yearTmp = yearTmp-1;
					//年が跨ぐ時の処理を考える
				}
			}
				

		

			//日にちを整える
			if(tmpDate<10)
			tmpDate = "0"+String(tmpDate);
			
			//月を整える
			if(tmpMonth<10)
			tmpMonth = "0"+String(tmpMonth);
	
			//時間を整える
			if(rTime<10)
			rTime = "0" + String(rTime);
			
			if(b==0&&cTime>=tmpTime){ //どの時間までインデックスをつけるか
				table = table + "<td style='opacity:0.5;'></td>";
			}else if(unableTime <= rTime && rTime <= unableTime2){
				table = table + "<td style='opacity:0.5;'>×</td>";
			}else{
				
				resistdate = String(tmpMonth)+"月"+tmpDate+"日="+rTime+":00";

				//スマートフォンのための処理
				if(2<sp)
				sptd = "<td class='no-sp'>";
				else
				sptd = "<td>";


				if(type=="learning")
				table = table + sptd +"<div id='"+resistdate+"'></div></td>";
				else if(type=="teaching")
				table = table + sptd +"<div id='"+resistdate+"'><button class='buttons' id='resistbutton' value='"+resistdate+"' onClick='resist(this)' ><img src='images/resistbutton2.png' /></button></div></td>";
				else if(type=="friend")
				table = table + sptd + "<div id='f-"+resistdate+"'></div></td>";	

					
			}	
			sp = sp+1;			
		}
		table = table + "</tr>";

		sp=0;
		table = table + "<tr><th>" + tmpTime + ":30</th>";
		for(var b = 0;b<6;b=b+1){
			//時差の計算
			rTime = Number(tmpTime) - Number(timedifference);

			tmpDate = date + b;
			tmpMonth = month;
			//時差がマイナスのときの処理
			if(25<rTime){
				rTime = rTime - 24;
				tmpDate = tmpDate + 1;
			}
			//日の最後にいったら次の月へ
			if(tmpDate>l_day){
				tmpDate = tmpDate - l_day;
				tmpMonth = month + 1;
			}
			
			//時差がプラスのときの処理
			if(rTime<=0){
				rTime = rTime + 24;
				tmpDate = tmpDate -1;
			}		
			//日が0日だったら、先月の最終日へ			
			if(tmpDate==0){
				tmpDate= new Date(yearTmp,eday.getMonth(),0).getDate();
				monthTmp = monthTmp -1;
				if(monthTmp==0){
					monthTmp=12;
					//yearTmp = yearTmp-1;
				}
			}
			//日にちを整える
			if(tmpDate<10)
			tmpDate = "0"+String(tmpDate);
			
			//月を整える
			if(tmpMonth<10)
			tmpMonth = "0"+String(tmpMonth);
			
			//時間を整える
			if(rTime<10){
				rTime = "0" + String(rTime);
			}else{
				rTime = String(rTime);
			}
			if(b==0&&cTime>tmpTime){ //どの時間までインデックスをつけるか
				table = table + "<td style='opacity:0.5;'></td>";
			}else if(b==0&&cTime==tmpTime&&cMinute>30){
				table = table + "<td style='opacity:0.5;'></td>";
			}else if(unableTime <= rTime && rTime <= unableTime2){
				table = table + "<td style='opacity:0.5;'>×</td>";
			}else{
			
				
				resistdate = String(tmpMonth)+"月"+tmpDate+"日="+rTime+":30";

				//スマートフォンのための処理
				if(2<sp)
				sptd = "<td class='no-sp'>";
				else
				sptd = "<td>";


				if(type=="learning")
				table = table + sptd + "<div id='"+resistdate+"'></div></td>";
				else if(type=="teaching")
				table = table + sptd + "<div id='"+resistdate+"'><button class='buttons' id='resistbutton' value='"+resistdate+"' onClick='resist(this)' ><img src='images/resistbutton2.png' /></button></div></td>";
				else if(type=="friend")
				table = table + sptd + "<div id='f-"+resistdate+"'></div></td>";
				
						
			}	
			sp=sp+1;			
		}
		table = table + "</tr>";

		tmpTime = tmpTime+1;
	}
}


