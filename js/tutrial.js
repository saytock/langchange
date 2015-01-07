onload = initialize
///チュートリアル準備
function initialize(){
	var key = window.location.pathname;
	//チュートリアル3用
	if(key.indexOf('tutrial3_2') != -1)
	nextStep3_0();
	else if(key.indexOf('tutrial4') != -1)
	nextStep4_0();
	else if(key.indexOf('tutrial5_2') != -1)
	nextStep5_0();
	else{

	introJs().setOptions({ 'skipLabel': '終了', 'nextLabel': '次へ','prevLabel':'前へ' ,'exitOnOverlayClick':false})
	.onbeforechange(function(targetElement) {
		///チュートリアル1
  		if(targetElement.id=="step1_3")
		nextStep1_0();
		if(targetElement.id=="step1_4")
		nextStep1_2();
		if(targetElement.id=="step1_5")
		nextStep1_4();
		if(targetElement.id=="step1_7")
		nextStep1_5();
		if(targetElement.id=="step1_8")
		videoFocus();
		if(targetElement.id=="step1_9")
		nextStep1_6();

		//チュートリアル3
		if(targetElement.id == "step3_3")
		window.location = "tutrial3_2.html";

		//チュートリアル5
		if(targetElement.id == "step5_3")
		window.location = "tutrial5_2.html";

	})
	.onafterchange(function(targetElement) {

	})
	.onexit(function() {
  		window.location = "tutorial.html";
	})
	.start();
	}



}


/////チュートリアル1//////
function nextStep1_0(){
	document.getElementById("today-attend").innerHTML = "";
	document.getElementById("today-attend").innerHTML = "<div style='font-size:14pt'>19:30 Tutrial Woman さん （英語トーク）</div><br/>スタンバイを押して相手を待とう！<br/>おたがいにスタンバイ中になるとビデオチャットが表示されます。<div style='font-size:14pt;display:inline-block'>19:55</div>までトークしよう。<br/>※開始10分後までにボタンを押さないと出席扱いとならず、ペナルティが発生するので注意しましょう！<br/><div id='self-attend' style='display:inline-block'><center><button  style='width:200px' class='buttons' id='attend' value='' onClick='nextStep1_1()'><img style='position:relative;bottom:-17px' class='stanby' src='images/stanby.png' width='200px' /></button></center></div> <div id='friendAttend' style='display:inline-block'> </div>";
}

function nextStep1_1(){
	introJs().exit();
	introJs().goToStep(4)
	.setOptions({ 'skipLabel': '終了', 'nextLabel': '次へ','prevLabel':'前へ','exitOnOverlayClick':false })
	.onbeforechange(function(targetElement) {
		if(targetElement.id=="step1_4")
		nextStep1_2();
		if(targetElement.id=="step1_5")
		nextStep1_4();
		if(targetElement.id=="step1_7")
		nextStep1_5();
		if(targetElement.id=="step1_8")
		videoFocus();
		if(targetElement.id=="step1_9")
		nextStep1_6();

	})
	.start();

}

function nextStep1_2(){

	document.getElementById("today-attend").innerHTML = "";
	document.getElementById("today-attend").innerHTML = "<img style='float:right;' src='images/newtab.png' width='250px' /><br>※ビデオ中はこのページを閉じたり移動したりしないで下さい。他のページ、サイトを見る場合は、<span style='color:#f00;'>別タブ</span>か<span style='color:#f00;'>別ウィンドウ</span>で見てください！<br/> <img style='position:relative;bottom:-17px' class='stanby' src='images/stanby-c.png' width='200px' />    <div id='friendAttend' style='display:inline-block'> </div>";

}

function nextStep1_3(){
	introJs().goToStep(5)
	.setOptions({ 'skipLabel': '終了', 'nextLabel': '次へ','prevLabel':'前へ','overlayOpacity':0 })
	.start();
}

function nextStep1_4(){
	document.getElementById("today-attend").innerHTML = "";
	document.getElementById("today-attend").innerHTML = "<img style='float:right;' src='images/allowpopups.png' width='250px' />おたがいのスタンバイ確認がとれました。トークの時間は<div style='font-size:14pt;display:inline-block'>19:55</div>までです。<br/><br/>※ビデオチャットの起動に失敗した場合は、このページを再読み込みしてください<br>ビデオウィンドウが立ち上がる際に、<span style='color:#f00;'>ポップアップブロックを解除</span>してください！";
}

var video;
function nextStep1_5(){
	video = window.open("https://appear.in/sample","video chat","width=600px,height=400px,location=1");
}

function videoFocus(){
	video.window.focus();
}

function nextStep1_6(){
	video.window.close();
	introJs().exit();
	var key = window.location.pathname;
	//チュートリアル1用
	openDialog("以上でチュートリアルが終了となります。おつかれさまでした。");
	openPopup("時間になるとビデオは自動で切れます。自然にトークを終了するために、自動で切れる前にトークを締め、手動で消すといいでしょう");



}

/////チュートリアル3/////
var timedifference=0;

function createTutrialCallender(){

	document.getElementById("resist").innerHTML = createCallender("learning");

}

function nextStep3_0(){
	createTutrialCallender();

	var eday = new Date();
	var targetDay = new Date(eday.getFullYear(),eday.getMonth(),eday.getDate()+2,eday.getHours(),eday.getMinutes(),0); //月は-1で記述
	var targetMonth= targetDay.getMonth()+1;
	var targetDate = targetDay.getDate();
	if(targetMonth<10)
	targetMonth= "0" + targetMonth;
	if(targetDate<10)
	targetDate = "0" + targetDate;

	document.getElementById(targetMonth+"月"+targetDate+"日=01:30").innerHTML = "<button class='buttons' id='resistbutton'  onClick=\"alert('「次へ」を押してください')\" ><img src='images/resistbutton.png'/></button>";
	document.getElementById(targetMonth+"月"+targetDate+"日=02:00").innerHTML ="<button class='buttons' id='step3_3' data-intro=\"空いている時間のボタンをクリックして予約しましょう<br/><br/>※チュートリアルのため、実際には予約されません\" data-step=\"3\" data-position=\"left\" onClick=\"nextStep3_2(this)\" ><img src='images/resistbutton.png'/></button>";
	document.getElementById("step3_3").style.display = "none";


	//チュートリアル初期化
	introJs()
	.setOptions({ 'skipLabel': '終了', 'nextLabel': '次へ','prevLabel':'前へ','exitOnOverlayClick':false,'doneLabel':'終了' })
	.onbeforechange(function(targetElement) {
		if(targetElement.id=="step3_5")
		nextStep3_1();

	})
	.onafterchange(function(targetElement){

	})
	.onexit(function() {
  		window.location = "tutorial.html";
	})
	.start();

}


function nextStep3_1(){
	document.getElementById("step3_3").style.display = "block";
	document.getElementById("resistbutton").style.display = "none";

}

function nextStep3_2(target){
	if(confirm('LCコインを1枚使用し、予約を行います。OKを押すと予約完了となり、メールが届きます。\n\n※もう一度クリックでキャンセルできますが、LCコインは戻りません')){
		document.getElementById(target.id).innerHTML = "<img src='images/resistbutton-c.png'/>";

		introJs().exit();
		openDialog("以上でチュートリアルが終了となります。おつかれさまでした。");
		openPopup("急な予定ができてキャンセルしないといけなくなったら、このページで「予約済」の赤いボタンをもう一回クリックすることでキャンセルできます。\n\n※予約に使ったコインは返ってきません");

		openPopup("ボタンが赤になったら予約完了です！\n時間5分前になったら確実にスタンバイしましょう\n\n※チュートリアルのためスタンバイの必要はありません");

	}

}


/////チュートリアル4/////
function nextStep4_0(){
	createTutrialCallender();

	var eday = new Date();
	var targetDay = new Date(eday.getFullYear(),eday.getMonth(),eday.getDate()+2,eday.getHours(),eday.getMinutes(),0); //月は-1で記述
	var targetMonth= targetDay.getMonth()+1;
	var targetDate = targetDay.getDate();
	if(targetMonth<10)
	targetMonth= "0" + targetMonth;
	if(targetDate<10)
	targetDate = "0" + targetDate;

	document.getElementById(targetMonth+"月"+targetDate+"日=02:00").innerHTML ="<button class='buttons' id='step3_3' data-intro=\"あなたの好みにあったパートナーがいました！早速予約してみましょう<br/><br/>※チュートリアルのため、実際には予約されません\" data-step=\"15\" data-position=\"left\" onClick=\"nextStep4_3(this)\" ><img src='images/resistbutton.png'/></button>";



	//スマフォ版とPC版の表示切り替えのための処理
	if($("#for_sp").css("display")=="none"){
	document.getElementById("for_sp").innerHTML = "";
	}else{
	document.getElementById("for_pc").innerHTML = "";
	}

	//チュートリアル初期化
	introJs()
	.setOptions({ 'skipLabel': '終了', 'nextLabel': '次へ','prevLabel':'前へ','exitOnOverlayClick':false,'doneLabel':'終了' })
	.onbeforechange(function(targetElement) {
		if(targetElement.id=="start")
		nextStep4_1();


	})
	.onafterchange(function(targetElement){

	})
	.onexit(function() {
  		window.location = "tutorial.html";
	})
	.start();
}

var dataStep=0;
function nextStep4_1(){
	dataStep=1;
}

function nextStep4_2(){
	if(dataStep==0)
	alert("このボタンを押すことで検索が利用できるようになります。");
	else{
		if(confirm("検索可能回数を1消費し検索を開始しますか？\n\n※絞り込み予約が完了するまで効果が続きます")){
		document.getElementById("start").disabled = "disabled";
		openPopup("検索が開始されるとボタンが押せなくなれます\n\n「次へ」を押してください");
		}
	}
}

function nextStep4_3(target){
	if(confirm('LCコインを1枚使用し、予約を行います。OKを押すと予約完了となり、メールが届きます。\n\n※もう一度クリックでキャンセルできますが、LCコインは戻りません')){
		document.getElementById(target.id).innerHTML = "<img src='images/resistbutton-c.png'/>";
		
		introJs().exit()
		openDialog("以上でチュートリアルが終了となります。おつかれさまでした。");
		openPopup("年代を同じにしたり、共通の趣味を選ぶことでトークがしやすくなります。自分の話しやすいパートナーを探しましょう！");

		//window.location = "tutrial.html";
	}
}
///レベルの変更
function changeLevel(level){}
///性別の変更
function changeSex(sex){}
///誕生日の変更
function changeBirthday(birthday){}
///出身国の変更
function changeNation(nation){}
///趣味
var hobbyTags = ['all'];
var hobbyArray =['']; //タグajax用
var hobbyCount = 1;
function changeHobby(hobby){
	if(hobby.value!="all"){
	 var hobbyFlag="off";
	 for(var i=0;i<hobbyArray.length;i=i+1){
	 	if(hobbyArray[i]==hobby.value)
	 	hobbyFlag = "on";
	 }

	hobbyArray.push(hobby.value); //趣味追加（検索用）
	hobbyTags.push("<button id='"+hobbyCount+"' onClick='delHobby("+hobbyCount+")'>"+hobby.value+" ×</button> "); //テーブルに趣味タグ追加
	hobbyCount = hobbyCount + 1; //趣味の数をカウント

	var hobbyTag = document.getElementById("hobbys");
	hobbyTag.innerHTML = "";
	for(var i=1;i<hobbyTags.length;i=i+1)
	hobbyTag.innerHTML = hobbyTag.innerHTML + hobbyTags[i];
	}
}

///趣味タグを削除
function delHobby(count){
	hobbyTags[count] = "";
	hobbyArray[count] = "";


	var hobbyTag = document.getElementById("hobbys");
	hobbyTag.innerHTML = "";
	for(var i=1;i<hobbyTags.length;i=i+1)
	hobbyTag.innerHTML = hobbyTag.innerHTML + hobbyTags[i];

}
///名前
function changeName(){}



/////チュートリアル5/////
var resistflag="";
function nextStep5_0(){
	document.getElementById("resist").innerHTML = createCallender("teaching");

	var eday = new Date();
	var targetDay = new Date(eday.getFullYear(),eday.getMonth(),eday.getDate()+2,eday.getHours(),eday.getMinutes(),0); //月は-1で記述
	var targetMonth= targetDay.getMonth()+1;
	var targetDate = targetDay.getDate();
	if(targetMonth<10)
	targetMonth= "0" + targetMonth;
	if(targetDate<10)
	targetDate = "0" + targetDate;

	document.getElementById(targetMonth+"月"+targetDate+"日=02:00").innerHTML ="<button class='buttons' id='step5_4' data-intro=\"空いている時間のボタンをクリックしてトークを登録しましょう<br/><br/>※チュートリアルのため、実際には登録されません\" data-step=\"2\" data-position=\"left\" onClick=\"resist(this)\" ><img src='images/resistbutton2.png'/></button>";
	document.getElementById(targetMonth+"月"+targetDate+"日=02:30").innerHTML ="<button class='buttons' id='step5_5' data-intro=\"「待機中」であればクリックすることでキャンセルできます\" data-step=\"3\" data-position=\"left\" onClick=\"resist(this)\" ><img src='images/resistbutton-w.png'/></button>";
	document.getElementById(targetMonth+"月"+targetDate+"日=03:00").innerHTML ="<button class='buttons' id='step5_6' data-intro=\"マッチングが成立すると、このようなボタンに変化します。<b>時間5分前には必ずスタンバイ</b>してください<br/>また、キャンセルにはLCコインを1枚消費します\" data-step=\"4\" data-position=\"left\" onClick=\"resist(this)\" ><img src='images/resistbutton-c.png'/></button>";



	//チュートリアル初期化
	introJs()
	.setOptions({ 'skipLabel': '終了', 'nextLabel': '次へ','prevLabel':'前へ','exitOnOverlayClick':false,'doneLabel':'終了'  })
	.onbeforechange(function(targetElement) {
		if(targetElement.id=="step5_4")
		resistflag="step5_4";
		if(targetElement.id=="step5_5")
		resistflag="step5_5";
		if(targetElement.id=="step5_6")
		resistflag="step5_6";




	})
	.onafterchange(function(targetElement){

	})
	.onexit(function() {
  		window.location = "tutorial.html";
	})
	.start();


}


function resist(target){
	if(resistflag=="step5_4"){
	document.getElementById("step5_4").innerHTML = "<img src='images/resistbutton-w.png'/>";
	alert("「待機中」になりました。この時点ではまだトークは成立していません");
	}
	else if(resistflag=="step5_5"){
	document.getElementById("step5_5").innerHTML = "<img src='images/resistbutton2.png'/>";
	alert("登録を解除しました。この時間のトークがマッチングすることはありません");
	}
	else if(resistflag=="step5_6"){
	alert("LCコインを1枚消費することでトークをキャンセルすることができます。\n\n※「英語トーク」「日本語トーク」共に赤いボタンはトークが成立していることを意味します。確実にスタンバイしましょう。相手に迷惑をかけることになります");

	introJs().exit()
	openDialog("以上でチュートリアルが終了となります。おつかれさまでした。");
	}
	else
	alert("このボタンを押すことでトークを登録・キャンセルすることができます");
}


///ダイアログを開く
function openDialog(msg){
	document.getElementById("dialog1").innerHTML = msg;
	$('#dialog1').dialog({
		height:'auto',
		width:300,
    		 dialogClass: 'noTitleDialog',
		modal: true,
		buttons: {
			"もう一度見る": function(){
				window.location.reload();
			},
			"チュートリアルを終える": function(){
				window.location = "tutorial.html";
			}
		}
	});
}

///ポップアップを開く
function openPopup(msg){
	document.getElementById("dialog2").innerHTML = msg;
	$('#dialog2').dialog({
		height:'auto',
		width:300,
    		 dialogClass: 'noTitleDialog',
		modal: true,
		buttons: {
			"OK": function(){
				$(this).dialog('close');
			}
		}
	});
}

///確認ダイアログを開く
function openConfirm(msg,response){
	document.getElementById("dialog1").innerHTML = msg;
	$('#dialog1').dialog({
		height:'auto',
		width:300,
    		 dialogClass: 'noTitleDialog',
		modal:true,
		buttons: {
			"OK": function(){
				$(this).dialog('close');
				response(false);
			},
			"キャンセル": function(){
				$(this).dialog('close');
				response(true);
			}
		}
	});
}
