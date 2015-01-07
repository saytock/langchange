var shareCode;

///サイドバー処理
function sidebar(){
	$.ajax({
		type:"POST",	
		url:"php/sidebar.php",		
		success:function(data,dataType){

			var dataArray = data.split(",");			
			//プロフィール表示 ※PC
			document.getElementById("prof-image").innerHTML = dataArray[0];	
			document.getElementById("prof-name").innerHTML = dataArray[1];	
			document.getElementById("prof-lccoin").innerHTML = dataArray[2];	
			document.getElementById("prof-friends").innerHTML = dataArray[3];	
			document.getElementById("prof-nation").innerHTML = dataArray[4];	
			document.getElementById("prof-sex").innerHTML = dataArray[5];	
			document.getElementById("prof-birthday").innerHTML = dataArray[6];
			var myhobby = dataArray[7].replace(/_/g,",").slice(0,dataArray[7].length-1);
			document.getElementById("prof-hobby").title = myhobby;
			if(myhobby.length>10){
			myhobby = myhobby.slice(0,10)+"...";
			$('#prof-hobby').balloon({ position: "bottom"});//吹出しの用意
			}else if(myhobby.length==0){
			myhobby = "-";
			}
			document.getElementById("prof-hobby").innerHTML = myhobby;
		//	document.getElementById("prof-code").innerHTML = dataArray[8];
			document.getElementById("prof-serching").innerHTML = dataArray[9]+"回  <button class='addsearch' onClick='addSerching()'>増やす</button>";	
			
			//プロフィール表示 ※SP
			document.getElementById("prof-image-sp").innerHTML = dataArray[0];	
			document.getElementById("prof-name-sp").innerHTML = dataArray[1];	
			document.getElementById("prof-lccoin-sp").innerHTML = dataArray[2];	
			document.getElementById("prof-friends-sp").innerHTML = dataArray[3];	
			document.getElementById("prof-nation-sp").innerHTML = dataArray[4];	
			document.getElementById("prof-sex-sp").innerHTML = dataArray[5];	
			document.getElementById("prof-birthday-sp").innerHTML = dataArray[6];	
			var myhobby = dataArray[7].replace(/_/g,",").slice(0,dataArray[7].length-1);	
			document.getElementById("prof-hobby-sp").title = myhobby;
			if(myhobby.length>10){
			myhobby = myhobby.slice(0,10)+"...";
			$('#prof-hobby-sp').balloon({ position: "bottom"});//吹出しの用意
			}else if(myhobby.length==0){
			myhobby = "-";
			}
			document.getElementById("prof-hobby-sp").innerHTML = myhobby;
		//	document.getElementById("prof-code-sp").innerHTML = dataArray[8];	
			document.getElementById("prof-serching-sp").innerHTML = dataArray[9]+"回 <button class='addsearch' onClick='addSerching()'>増やす</button>";	


			//紹介LCコイン取得確認
			if(dataArray[10]!="")
			openDialog(dataArray[10]);

			
			//シェアボタン表示
			shareCode = dataArray[8];
			
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				
		}
	});

	return false;

}


//チュートリアル
function showTutorial(){
		introJs().setOptions({
			'doneLabel':'Next page',
			'nextLabel':'つぎへ',
			'prevLabel':'もどる',
			'skipLabel':'スキップ',
			
			
		})
		.oncomplete(function() {
	           window.location.href = 'schedule-g1.html?multipage=true';
	 	  })
		.start();
		//introJs().setOptions();
	
}


///paypalへ移動
function toPayPal(){
	window.location = "purchase.html";
}

///紹介コードを開く
function openCode(){
	openDialog("<b>あなたの紹介コード</b><br/><br/>http://langchange.org/php/invitation.php?invitation="+shareCode);
}

///シェアボタン処理
function shareFacebook(){
	window.open('http://www.facebook.com/sharer.php?u=http://langchange.org/php/invitation.php?invitation='+shareCode,"facebook share","width=600px,height=400px,location=1");
}

///QRコードを開く
function openQR(){
	document.getElementById("qrcode").innerHTML = "";
	$('#qrcode').qrcode('http://langchange.org/php/invitation.php?invitation='+shareCode);
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

