///検索可能回数を増やす
function addSerching(){
openConfirm("LCコインを1枚つかって<br>検索可能回数を2回増やしますか？",function(cancel){
	if(cancel){
		return false;
	}else{

	$.ajax({
		type:"POST",
		url:"php/addSerching.php",
		success:function(data,dataType){
			openDialog(data);
			window.location.reload();
		},
		error:function(XMLHttpRequest,textStatus,errorThrown){

		}
	});

	}

});

}
