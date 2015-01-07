<?php
	session_start();

//セッション情報がなければログインページへ
if(isset($_POST["check"])){
	if(empty($_SESSION["id"]))
	echo "gotoLogin";
	else if($_SESSION["country"]=="外国人")
	echo "gotoEnglish";
}

//セッション情報があればそのままメインページへ
if(isset($_POST["checkSession"])){
	if(isset($_SESSION["id"])){
		if($_SESSION["country"]=="日本人")
		echo "japanese";
		else
		echo "english";		
	}else{
		echo "";
	}
}	
?>
