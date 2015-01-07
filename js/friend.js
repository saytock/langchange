onload = init;

var moreFriend = ""; //もっと見る用変数
var moreHist = ""; //もっと見る用変数
var timedifference=0;

///初期化
function init(){
	//セッションを確認
	checkSession();
	//友達リスト初期化
	//friends();
	//時差の取得
	getTimeDifference();
	
	//プロフィール部分の非表示
	document.getElementById("profile").style.display="none";

	//自動更新
	//setInterval("checkAttend()",1000*10);
/*
	var iw, ih;
        var cw = 180;    
        var ch = 180;    
        iw = ($(".triming-image").width() - cw) / 2;
        ih = ($(".triming-image").height() - ch) / 2;
        $(".triming-image").css("top", "-"+ih+"px");
        $(".triming-image").css("left", "-"+iw+"px");

*/
}


///友達リストを取得
function friends(){
	var data ={
			getFriend : "getFriend"
	};
	
	$.ajax({
		type:"POST",	
		url:"php/friend.php",
		data:data,		
		success:function(data,dataType){
			var friendArray =data.split(",");
			var friendlist="<ul id='friendSlider'>";
			var brtriger = 9;				
			for(var i=0;i<friendArray.length-1;i=i+3){
			//何人表示するかの話
				if(i<18){
					friendlist = friendlist+"<li><div style='margin-top:15px' class='日本語トーク' id='"+friendArray[i+1]+"'  onClick='getProfile(this)'><span class='triming'><img src='english/prof/"+friendArray[i]+"'/></span><br/>"+friendArray[i+2]+"</div></li>";

				}
				//もっと見るのための処理
				if(i<108){
				moreFriend = moreFriend + "<div style='display:inline-block;padding:8px 4px;cursor:pointer' id='"+friendArray[i+1]+"' class='日本語トーク' onClick='getProfile(this)'><span class='triming-prof'><img src='english/prof/"+friendArray[i]+"'/></span><br/>"+friendArray[i+2]+"</div>";
				if(i==brtriger){
					moreFriend = moreFriend + "<br/>";
					brtriger = brtriger + 12;
				}
				}

			}
			friendlist = friendlist + "</ul>"
			if(data!=""){			
				document.getElementById("friend").innerHTML = friendlist;
				slider("friend");
			}

		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				
		}
	});

	return false;
}


//履歴の表示
function history(){
	$.ajax({
		type:"POST",	
		url:"php/history.php",		
		success:function(data,dataType){
			var histArray =data.split(",");
			var hist="<ul id='histSlider'>";
			var histDate;
			var typeTmp;
			var brtriger=15;

			var tmonth;
			var tdate;
			var thour;
			var tminute;
			var tval;

			for(var i=0;i<histArray.length-1;i=i+5){
				//時差を整える
				tmonth = histArray[i].slice(0,2);
				tdate = histArray[i].slice(3,5);
				thour = histArray[i].slice(7,9);
				tminute = histArray[i].slice(10,12);
				tval   = histArray[i].slice(13);

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
			
				histArray[i] = tmonth+"月"+tdate+"日="+thour+":"+tminute+tval;

				histDate = histArray[i].split("=");


				if(histArray[i+4]=="teaching"){
					typeTmp = "日本語トーク";
					//何人表示するかの話
				if(i<30){
					hist = hist+"<li><div style='cursor:pointer'id='"+histArray[i+2]+"' class='"+typeTmp+"' onClick='getProfile(this)'><span class='triming'><img src='english/prof/"+histArray[i+1]+"'/></span><br/>"+histArray[i+3]+" さん<br/>"+histDate[0]+" "+histDate[1]+"<br/>"+typeTmp+"</div></li>";
				}
				//もっと見るのための処理
				if(i<180){
				moreHist = moreHist + "<div style='display:inline-block;padding:8px 4px;cursor:pointer' id='"+histArray[i+2]+"' class='"+typeTmp+"' onClick='getProfile(this)'><span class='triming-prof'><img src='english/prof/"+histArray[i+1]+"'/></span><br/>"+histArray[i+3]+" さん<br/>"+histDate[0]+" "+histDate[1]+"<br/>"+typeTmp+"</div>";
				if(i==brtriger){
					moreHist = moreHist + "<br/>";
					brtriger = brtriger + 20;
				}
				}


				}else{

					typeTmp = "英語トーク";
					//何人表示するかの話
				if(i<30){
					hist = hist+"<li><div style='cursor:pointer' id='"+histArray[i+2]+"' class='"+typeTmp+"' onClick='getProfile(this)'><span class='triming'><img src='english/prof/"+histArray[i+1]+"'/></span><br/>"+histArray[i+3]+" さん<br/>"+histDate[0]+" "+histDate[1]+"<br/>"+typeTmp+"</div></li>";
				}
				//もっと見るのための処理
				if(i<180){
				moreHist = moreHist + "<div style='display:inline-block;padding:8px 4px;cursor:pointer' id='"+histArray[i+2]+"' class='"+typeTmp+"' onClick='getProfile(this)'><span class='triming-prof'><img src='english/prof/"+histArray[i+1]+"'/></span><br/>"+histArray[i+3]+" さん<br/>"+histDate[0]+" "+histDate[1]+"<br/>"+typeTmp+"</div>";
				if(i==brtriger){
					moreHist = moreHist + "<br/>";
					brtriger = brtriger + 20;
				}

				}
				
				}
				
			}
			
			hist = hist + "</ul>";
			if(data!=""){
				document.getElementById("histslide").innerHTML = hist;				
				slider("history"); //スライダーの準備
			}
				
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				
		}
	});

	return false;
}

///スライダー処理
function slider(type){

//友達スライダーの準備
if(type=="friend"){
	$('#friendSlider').bxSlider({
		infiniteLoop: false,
		hideControlOnEnd: true,
       	pager: true,
        	slideWidth: 200, //slideWidth * maxSlides <= #histSlideのwidth
    		minSlides: 2,
    		maxSlides: 3,
    		moveSlides: 1,
    		slideMargin: 20,
		hideControlOnEnd:true
	});
}

//履歴スライダーの準備
if(type=="history"){
	$('#histSlider').bxSlider({
		infiniteLoop: false,
		hideControlOnEnd: true,
       	pager: true,
        	slideWidth: 230, //slideWidth * maxSlides <= #histSlideのwidth
    		minSlides: 2,
    		maxSlides: 3,
    		moveSlides: 1,
    		slideMargin: 20,
	});
}

}

//もっと見る
function moreList(name){
	
	if(name=='友達一覧')
	document.getElementById("moreList").innerHTML = moreFriend;
	else
	document.getElementById("moreList").innerHTML = moreHist;
	

	$('#moreList').dialog({
		title: name,
		modal: true,
		height:'auto',
		width:'auto',
    		create: function( event, ui ) {
        		jQuery(this).css("maxWidth", "650");
    		},
		buttons: {
			"OK": function(){
				$(this).dialog('close');
			}
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
			//トークの履歴初期化
			history();
			//スケジュール作成 (プロフィールのための）
			document.getElementById("schejule").innerHTML = createCallender("friend");	
	
			//ポップを確認
			checkPop();
	
						
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				
		}
	});

	return timedifference;
}
