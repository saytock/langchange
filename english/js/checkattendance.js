var talktype;
var stanbyFlag="on";

///出席確認
function checkAttend(){
	var eday = new Date();
	var dateTmp=eday.getDate();
	var monthTmp=eday.getMonth() + 1;
	var hourTmp = eday.getHours();
	var minuteTmp = eday.getMinutes();
	var l_day = new Date(year,eday.getMonth()+1,0).getDate();

	if(55<=minuteTmp || (0<=minuteTmp && minuteTmp<25))
	minuteTmp = "00";
	else if(25<=minuteTmp && minuteTmp<55){
	minuteTmp = "30";
	hourTmp = hourTmp + 1;
		if(hourTmp == 24){
			hourTmp = 0;
			dateTmp = dateTmp + 1;
			if(dateTmp==l_day){
				dateTmp = 1;
				monthTmp = monthTmp + 1;
				if(monthTmp == 13){
					monthTmp = 1;
				}
			}
		}
	}

	if(hourTmp<10)
	hourTmp = "0" + hourTmp;

	var checktime = hourTmp +":"+ minuteTmp;


	//日付を整える
	if(dateTmp<10)
	dateTmp = "0"+dateTmp;

	//月を整える
	if(monthTmp<10)
	monthTmp = "0"+String(monthTmp);

//alert(monthTmp);
//alert(dateTmp);
//alert(checktime);

	//出席確認
	var data ={
			check	    : "check",
			year	    : eday.getFullYear(),
			month      : monthTmp,
			date	    : dateTmp,
			time 	    : checktime,
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
					openDialog("Your partner is now ready! Moving to Main Page.");
					window.location = "http://langchange.org/mainpage.html";

				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});

}

///相手のスタンバイ状況取得→時間内に来なかったら、ポップアップ表示
function checkStanby(){

if(stanbyFlag=="on"){

	var stanbyTime=0;
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
				openDialog('loading...');
			}
		});





}


