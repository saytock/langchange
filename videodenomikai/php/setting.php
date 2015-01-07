<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");

//セッションを始める
session_start();

//設定情報取得
if(isset($_POST["init"])){
	$info = "";
	$query = $pdo->query("SELECT * FROM users WHERE id = '".$_SESSION["id"]."'");
	$rows = $query->fetch(PDO::FETCH_ASSOC);
	$info .= $rows["name"].",".$rows["mlanguage"].",".$rows["sex"].",".$rows["birthday"].",".$rows["college"].",".$rows["nation"].",".$rows["hobby"].",".$rows["support"].",".$rows["mail"].",".$rows["password"].",";

	echo $info;
}


//登録処理
if(!empty($_POST["name"]) &&
!empty($_POST["mlanguage"]) &&
!empty($_POST["sex"]) &&
!empty($_POST["year"]) &&
!empty($_POST["month"]) &&
!empty($_POST["day"]) &&
!empty($_POST["nation"]) &&
!empty($_POST["hobby"]) &&
!empty($_POST["support"]) &&
!empty($_POST["mail"]) &&
!empty($_POST["password"]) &&
!empty($_POST["password2"])
){
	if($_POST["password"]==$_POST["password2"]){
		resistProfile($pdo);

	}else{
		echo "パスワードが一致しません";
	}
}else{
	echo "記入していない欄があります";
}


//プロフィール登録（更新）
function resistProfile($pdo){
$filename = null;
$query = "UPDATE users SET";
$queryRow = "";
$queryWhere = " WHERE id ='".$_SESSION["id"]."'";
$flag=null;

$queryTmp = $pdo->query("SELECT * FROM users WHERE id = '".$_SESSION["id"]."'");
$rows = $queryTmp->fetch(PDO::FETCH_ASSOC);

if($rows["name"]!=$_POST["name"]){
	$queryRow .= " name='".$_POST["name"]."',";
}
if($rows["mlanguage"]!=$_POST["mlanguage"]){
	$queryRow .= " mlanguage='".$_POST["mlanguage"]."',";
}
if(!empty($_FILES["image"]["name"])){
	$uptmp = uploadImage($pdo);
	$_SESSION["image"] = $uptmp;
	$queryRow .= " image='".$uptmp."',";
}
if($rows["sex"]!=$_POST["sex"]){
	$queryRow .= " sex='".$_POST["sex"]."',";
}
$birthday = $_POST["year"]."/".$_POST["month"]."/".$_POST["day"];
if($rows["birthday"]!=$birthday){
	$queryRow .= " birthday='".$birthday."',";
}
if($rows["college"]!=$_POST["college"]){
	$queryRow .= " college='".$_POST["college"]."',";
}
if($rows["nation"]!=$_POST["nation"]){
	$queryRow .= " nation='".$_POST["nation"]."',";
}

//if($rows["hobby"]!=$_POST["hobby"]){

if($_POST["hCount"]>0){
	$hobbyval=""; 
	for($hobbyCount=0;$hobbyCount<$_POST["hCount"];$hobbyCount++){
		$tmpHobby = "hobby".strval($hobbyCount);

		if($_POST[$tmpHobby]!=""){
			$hobbyval.=str_replace(" ×","",$_POST[$tmpHobby])."_";
		}
	}
	$queryRow .= " hobby='".$hobbyval."',";
}

if($rows["mail"]!=$_POST["mail"]){
	$queryId = $pdo->query("SELECT mail FROM users WHERE mail = '".$_POST["mail"]."'");
	$rowsTmp = $queryId->fetch(PDO::FETCH_ASSOC);
	if($rowsTmp["mail"] != $_POST["mail"]){
		$queryRow .= " mail='".$_POST["mail"]."',";
	}else{
		$flag = "このメールアドレスはすでに使われています";
		$queryRow = "error";
	}
}
if($rows["password"]!=$_POST["password"]){
	$queryRow .= " password='".$_POST["password"]."',";
}

if(!empty($queryRow)){
	if($flag){
		echo $flag;
	}else{
		$queryLength = strlen($queryRow);
		$pdo->query($query.substr($queryRow,0,$queryLength-1).$queryWhere);
		echo "プロフィールを変更しました";
	}
}else{
	echo "変更カ所はありません";
}


}



function uploadImage($pdo){
	$updir = "../prof/";
	$filename = md5(microtime()); //ランダムに名前を作成

	$tmp_name = $_FILES['image']['tmp_name'];
	$tmp_size = getimagesize($tmp_name);
	switch ($tmp_size[2]) { // 画像の種類を判別
	case 1 : // GIF
		$filename .= '.gif';
	break;
	case 2 : // JPEG
		$filename .= '.jpg';
	break;
	case 3 : // PNG
		$filename .= '.png';
	break;
	default : break;
	}

	move_uploaded_file($tmp_name, $updir.$filename);
	chmod($updir.$filename,0666);  
	
	return $filename;
	
}



?>
