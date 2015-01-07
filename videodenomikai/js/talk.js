onload = init;

var currentid = "tab-1";

function init(){
	document.getElementById("talk").innerHTML = document.getElementById("article-1").innerHTML;
	document.getElementById(currentid).disabled = "disable";
	document.getElementById("talk").style.height = "300px";
	document.getElementById(currentid).innerHTML = "<img src='images/talktab-1-b.png' />";
}

function change(idtab){
	id = idtab.id;

	//記事の入れ替え
	document.getElementById("talk").innerHTML = document.getElementById("article-"+id.slice(4,5)).innerHTML;

	//ボタンの設定
	document.getElementById(currentid).disabled = "";
	document.getElementById(id).disabled = "disabled";
	document.getElementById(currentid).innerHTML = "<img src='images/talk"+currentid+".png' />";
	currentid = id;

	//ボタンのアクティブ化
	document.getElementById(id).innerHTML = "<img src='images/talk"+id+"-b.png' />";

	//枠の大きさの変更
	switch (id){
		case "tab-1":
			document.getElementById("talk").style.height = "300px";
			break;
		case "tab-2":
			document.getElementById("talk").style.height = "320px";
			break;
		case "tab-3":
			document.getElementById("talk").style.height = "500px";
			break;
		case "tab-4":
			document.getElementById("talk").style.height = "360px";
			break;
		case "tab-5":
			document.getElementById("talk").style.height = "810px";
			break;
		case "tab-6":
			document.getElementById("talk").style.height = "320px";
			break;
	}
}
