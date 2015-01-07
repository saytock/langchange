<?php
header("Content-type:text/plain;charset=UTF-8");

date_default_timezone_set('UTC');

//時刻を取得
$timedifference=0;
$currentDay = date('d');
$currentHour = date('H');

//時差計算
if($_POST["currentDay"]-intVal($currentDay)==-1)
$timedifference = $_POST["currentHour"] - (intVal($currentHour)+24);
else if($_POST["currentDay"]-intVal($currentDay)==1)
$timedifference = ($_POST["currentHour"]+24) - intVal($currentHour);
else
$timedifference = $_POST["currentHour"] - intVal($currentHour);


//echo $timedifference;

//テスト用
echo 0;
?>

