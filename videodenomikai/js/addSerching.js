///検索可能回数を増やす
function addSerching(){
if(window.confirm("LCコインを1枚消費し\n検索可能回数を2回増やしますか？")){
	
	$.ajax({
		type:"POST",	
		url:"php/addSerching.php",	
		success:function(data,dataType){
			alert(data);
			window.location.reload();	
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){
				alert('Error : ' + errorThrown);
		}
	});


}

}
