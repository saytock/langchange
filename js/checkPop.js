//カレンダーのための初期化
var eday;
var cYear;
var cMonth; //何故か月は0‾11月に設定されてる
var cDate;
var cHour;
var cMinute;
var youbi = ["日","月","火","水","木","金","土"];
var l_day;

var popCount=0;

function checkPop(){
	//カレンダーのための初期化
	eday = new Date();
	cYear = eday.getFullYear();
	cMonth = eday.getMonth() + 1; //何故か月は0‾11月に設定されてる
	cDate = eday.getDate();
	cHour = eday.getHours();
	cMinute = eday.getMinutes();
	l_day = new Date(cYear,eday.getMonth()+1,0).getDate();

	//時間を整える
	cHour = cHour - timedifference;

	//時差がマイナスのときの処理
	if(24<=cHour){
		cHour = cHour - 24;
		cDate = cDate + 1;
	}
	//日の最後にいったら次の月へ
	if(cDate>l_day){
		cDate = 1;
		cMonth = cMonth + 1;
		if(cMonth==13){
			cMonth=1;
			cYear = cYear +1;
		}
	}
			
	//時差がプラスのときの処理
	if(cHour<0){
		cHour = cHour + 24;
		cDate = cDate -1;
	}		
	//日が0日だったら、先月の最終日へ			
	if(cDate==0){
		cDate= new cDate(cYear,eday.getMonth(),0).getDate();
		cMonth = cMonth -1;
		if(cMonth==0){
			cMonth=12;
			cYear = cYear-1;
		}
	}


	//マッチング通知確認
	checkAll();
	
}

///ポップアップをチェックする
function checkAll(){
	var data ={
			checkpop:"checkpop",
			year : cYear,
			month: cMonth,
			date : cDate,
			hour : cHour,
			minute:cMinute,
		};

		$.ajax({
			type:"POST",
			url: "php/checkPop.php",
			data: data,
			success: function(data,dataType){
				var dataArray = data.split(",");
				var k=1;
				var val;
				dataLength=dataArray.length-1;
				if(dataLength>8)
				dataLength=8;
				if(data){
					for(var i=0;i<dataArray.length-1;i=i+1){
						document.getElementById("dialog"+k).display="none";
						val = prepareTime2(dataArray[i]);
						document.getElementById("dialog"+k).innerHTML = val;
						k=k+1;
						if(k==10){
							break;
						}
					}
					openCheckDialog();
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				
			}
		});

}

///ダイアログを開く
function openCheckDialog(){
	popCount=popCount+1;
	$('#dialog'+popCount).dialog({
		height:'auto',
		width:300,
    		 dialogClass: 'noTitleDialog',
		buttons: {
			"OK": function(){
				if(popCount<dataLength){
				$(this).dialog('close');
				openCheckDialog();
				}else{
				$(this).dialog('close');
				}			
			}
		}
	});	
}

///時差の計算
function prepareTime2(val){
	var tmp = val.slice(7,9);
	var cTime2;
	var cMonth2 = val.slice(0,2);
	var cDate2 = val.slice(3,5);
	var cTime2 = Number(tmp) + Number(timedifference);

	//時差がマイナスのときの処理
	if(24<=cTime2){
		cTime2 = cTime2 - 24;
		cDate2 = Number(cDate2) + 1;
	}

	//日の最後にいったら次の月へ
	if(Number(cDate2)>l_day){
		cDate2 = 1;
		cMonth2 = Number(cMonth2) + 1;
		if(cMonth2==13){
			cMonth2=1;
			//cYear=cYear+1;
		}
	}

	//時差がプラスのときの処理
	if(cTime2<0){
		cTime2 = cTime2 + 24;
		cDate2 = Number(cDate2) -1;
	}
	//日が0日だったら、先月の最終日へ
	if(cDate2==0){
		cDate2= new Date(cYear2,eday.getMonth(),0).getDate();
		cMonth2 = Number(cMonth2) -1;
		if(cMonth==0){
			cMonth=12;
			//cYear = cYear-1;
			//年が跨ぐ時の処理を考える
		}
	}

	if(cTime2<10)
	cTime2 = "0" + cTime2;

	 return cMonth2+"月"+cDate2+"日 " + cTime2 + ":" + val.slice(10);

}
