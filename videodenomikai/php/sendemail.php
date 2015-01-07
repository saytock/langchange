<?php
header("Content-type:text/plain;charset=UTF-8");

///メール送信
$to = "lc_contact@langchange.org";
$title = "問い合わせ";
$content = $_POST["content"];
$from = "From: Langchangeにお越しのお客様";
mb_language("Japanese");
mb_internal_encoding("UTF-8");
mb_send_mail($to, $title, $content, $from);

echo "フォームを送信しました";
		

?>
