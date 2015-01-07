//カレンダーのための初期化
var eday = new Date();
var cYear = eday.getFullYear();
var cMonth = eday.getMonth() + 1; //何故か月は0‾11月に設定されてる
var cDate = eday.getDate();
var cHour = eday.getHours();
var cMinute = eday.getMinutes();
var youbi = ["日","月","火","水","木","金","土"];
var l_day = new Date(cYear,eday.getMonth()+1,0).getDate();


function checkPop(){
	//カレンダーのための初期化
	eday = new Date();
	cYear = eday.getFullYear();
	cMonth = eday.getMonth() + 1; //何故か月は0‾11月に設定されてる
	cDate = eday.getDate();
	cHour = eday.getHours();
	cMinute = eday.getMinutes();
	youbi = ["日","月","火","水","木","金","土"];
	l_day = new Date(cYear,eday.getMonth()+1,0).getDate();

	
	//時間を整える
	cHour = cHour - timedifference;

	//時差がマイナスのときの処理
	if(25<cHour){
		cHour = cHour - 24;
		cDate = cDate + 1;
	}
	//日の最後にいったら次の月へ
	if(cDate>l_day){
		cDate = cDate - l_day;
		cMonth = cMonth + 1;
	}
			
	//時差がプラスのときの処理
	if(cHour<=0){
		cHour = cHour + 24;
		cDate = cDate -1;
	}		
	//日が0日だったら、先月の最終日へ			
	if(cDate==0){
		cDate= new cDate(cYear,eday.getMonth(),0).getDate();
		cMonth = cMonth -1;
		if(cMonth==0){
			cMonth=12;
			//cYear = cYear-1;
		}
	}

	//マッチング通知確認
	checkMatching();
	//マッチングされなかったトーク確認
	falseMatching();
	//キャンセルされたマッチング確認（learning）
	cancelMatching();
	//ペナルティチェック
	checkPenalty();
}

///マッチング状況を取得する
function checkMatching(){
	var data ={
			checkMatching:"checkMatching",
		};

		$.ajax({
			type:"POST",
			url: "php/main.php",
			data: data,
			success: function(data,dataType){
				var dataArray = data.split(",");
				if(data){
					for(var i=0;i<dataArray.length-1;i=i+1){
						openDialog(dataArray[i]);
					}
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				
			}
		});

}

///マッチングしなかったトークを取得する
function falseMatching(){
	var data ={
			falseMatching:"falseMatching",
			year : cYear,
			month: cMonth,
			date : cDate,
			hour : cHour,
			minute:cMinute,
		};

		$.ajax({
			type:"POST",
			url: "php/main.php",
			data: data,
			success: function(data,dataType){
				var dataArray = data.split(",");
				if(data){
					for(var i=0;i<dataArray.length-1;i=i+1){
						openDialog(dataArray[i]);
					}
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				
			}
		});

}

///キャンセルされたトークを取得する
function cancelMatching(){
	var data ={
			cancelMatching:"cancelMatching",
		};

		$.ajax({
			type:"POST",
			url: "php/main.php",
			data: data,
			success: function(data,dataType){
				var dataArray = data.split(",");
				if(data){
					for(var i=0;i<dataArray.length-1;i=i+1){
						openDialog(dataArray[i]);
					}
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				
			}
		});

}

///ペナルティをチェック
function checkPenalty(){
	var data ={
			checkPenalty:"checkPenalty",
			year : cYear,
			month: cMonth,
			date : cDate,
			hour : cHour,
			minute:cMinute,
		};

		$.ajax({
			type:"POST",
			url: "php/main.php",
			data: data,
			success: function(data,dataType){
				var dataArray = data.split(",");
				if(data){
					for(var i=0;i<dataArray.length-1;i=i+1){
						openDialog(dataArray[i]);				
					}
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				
			}
		});

}

