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
			document.getElementById("prof-hobby").innerHTML = dataArray[7].replace(/_/g,",").slice(0,dataArray[7].length-1);	
		//	document.getElementById("prof-code").innerHTML = dataArray[8];
			document.getElementById("prof-serching").innerHTML = dataArray[9]+"回 <button onClick='addSerching()'>増やす</button>";	
			
			//プロフィール表示 ※SP
			document.getElementById("prof-image-sp").innerHTML = dataArray[0];	
			document.getElementById("prof-name-sp").innerHTML = dataArray[1];	
			document.getElementById("prof-lccoin-sp").innerHTML = dataArray[2];	
			document.getElementById("prof-friends-sp").innerHTML = dataArray[3];	
			document.getElementById("prof-nation-sp").innerHTML = dataArray[4];	
			document.getElementById("prof-sex-sp").innerHTML = dataArray[5];	
			document.getElementById("prof-birthday-sp").innerHTML = dataArray[6];	
			document.getElementById("prof-hobby-sp").innerHTML = dataArray[7].replace(/_/g,",").slice(0,dataArray[7].length-1);	
		//	document.getElementById("prof-code-sp").innerHTML = dataArray[8];	
			document.getElementById("prof-serching-sp").innerHTML = dataArray[9]+"回 <button onClick='addSerching()'>増やす</button>";	


			//紹介LCコイン取得確認
			if(dataArray[10]!="")
			openDialog(dataArray[10]);

			//紹介コードリンク作成
			document.getElementById("invLink").href = "http://www.langchange.org/php/invitation.php?invitation="+dataArray[8];
			document.getElementById("invLink").innerHTML ="http://www.langchange.org/php/invitation.php?invitation="+dataArray[8];
			
			//シェアボタン表示
			document.getElementById("facebook-share").innerHTML = "<iframe src=\"//www.facebook.com/plugins/share_button.php?href=http://www.langchange.org/php/invitation.php?invitation="+dataArray[8]+";layout=button&amp;appId=1513109692251737\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden;\" allowTransparency=\"true\"></iframe>";
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				openDialog('データ更新中')
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
