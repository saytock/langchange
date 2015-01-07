///検索可能回数を増やす
function addSerching(){
openConfirm("Use 1 LC coin to get 2 more refine search points?",function(cancel){
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
