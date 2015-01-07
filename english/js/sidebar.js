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
			document.getElementById("prof-serching").innerHTML = dataArray[9]+"times <button class='addsearch' onClick='addSerching()'>Get more</button>";

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
			document.getElementById("prof-serching-sp").innerHTML = dataArray[9]+"times <button class='addsearch' onClick='addSerching()'>Get more</button>";


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

///ログアウト
$(document).ready(function(){
	$('#logout').click(function(){
		var data ={
			logout : $('#logout').val(),
		};

		$.ajax({
			type:"POST",
			url: "php/login.php",
			data: data,
			success: function(data,dataType){
				if(data=="ok"){
					window.location="index.html";
				}else{
					alert(data);
				}
			},

			error: function(XMLHttpRequest,textStatus,errorThrown){

			}
		});

		return false;
	});
});


///paypalへ移動
function toPayPal(){
	window.location = "purchase.html";
}

///紹介コードを開く
function openCode(){
	openDialog("<b>Your invitation code</b><br/><br/>http://langchange.org/php/invitation.php?invitation="+shareCode);
}

///シェアボタン処理
function shareFacebook(){
	window.open('http://www.facebook.com/sharer.php?u=http://langchange.org/english/php/invitation.php?invitation='+shareCode,"facebook share","width=600px,height=400px,location=1");
}

///QRコードを開く
function openQR(){
	document.getElementById("qrcode").innerHTML = "";
	$('#qrcode').qrcode('http://langchange.org/php/invitation.php?invitation='+shareCode);
	$('#qrcode').dialog({
		title: 'QR code',
		modal: true,
		width:300,
		height:400,
		buttons: {
			"Close": function(){
				$(this).dialog('close');
			}
		}
	});


}

