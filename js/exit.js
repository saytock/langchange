//退会のための初期化（予約済みトークの削除のための）
var eday = new Date();
var year = eday.getFullYear();
var month = eday.getMonth() + 1; //何故か月は0‾11月に設定されてる
var date = eday.getDate();
var cHour = eday.getHours();
var cMinute = eday.getMinutes();


///ログインチェック
function logincheck(){
	var data ={
			logincheck:"logincheck",
		};

		$.ajax({
			type:"POST",
			url: "php/exit.php",
			data: data,
			success: function(data,dataType){
				if(data=="gotoLogin"){
					alert("まずはログインしてください");
					window.location = "login.html";
				}
				else
				userBreak();	
		},
			error: function(XMLHttpRequest,textStatus,errorThrown){
		
			}
		});
		

}

///退会処理
function userBreak(){

	if(window.confirm("本当に退会しますか？")){
	var data = { 
		break :"break",
		year : year,
		month: month,
		date : date,
		hour : cHour,
		minute:cMinute,
	};

	$.ajax({
		type:"POST",	
		url:"php/exit.php",
	      data: data,
	      success:function(data,dataType){
			alert(data);
			window.location = "index.html";
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				alert('ログインしてください');
		}
	    });

    		return false;
	}
}

