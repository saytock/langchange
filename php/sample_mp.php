<?php
//ヘッダー用変数
$subject = "HTMLメールテスト";
$mailto = "alice_sys.14711@docomo.ne.jp";
$mailfrom = "lc_info@langchange.org";
$mailfromname = "langchange";
$subject = mb_encode_mimeheader(mb_convert_encoding($subject, "JIS", "auto"), "JIS");
$boundary = "----".uniqid(rand(),1);
//sendmailへアクセス
$mp = popen("/usr/sbin/sendmail -f $mailfrom $mailto", "w");


//Header
fputs($mp, "MIME-Version: 1.0\n");
fputs($mp, "Content-Type: Multipart/alternative; boundary=\"$boundary\"\n");
fputs($mp, "From: " .mb_encode_mimeheader($mailfromname) ."<" .$mailfrom .">\n");
fputs($mp, "To: $mailto\n");
fputs($mp, "Subject: $subject\n");
//本文
fputs($mp, "--$boundary\n");
fputs($mp, "\n");
fputs($mp, "bbbbb\n");
fputs($mp, "\n");
fputs($mp, "--$boundary" . "--\n");
//sendmailへのプロセスを開放
pclose($mp);

/*
リマインダー
案1：データベースにリマインダー用変数（時間と種類（キャンセル、トーク開始など））を儲け、その時間になったらリマインダーを送る
reminder id,userid,year,month,day,hour,minute,type
reminder.useridとusers.idをつなげて、そのidのメールアドレスにタイプに応じたリマインダーを送る
cronを30分ごとに設定して、phpを起動。現在の時間とデータベースの時間を比較して、該当のリマインダーを送信
*/
?>
