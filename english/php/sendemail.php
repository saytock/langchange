<?php
header("Content-type:text/plain;charset=UTF-8");

///メール送信
if(isset($_POST["sendMail"])){
$to = "lc_contact@langchange.org";
$title = "意見・要望";
$content = $_POST["contact"];
$from = "From: Langchangeにお越しのお客様";
mb_language("Japanese");
mb_internal_encoding("UTF-8");
mb_send_mail($to, $title, $content, $from);

echo "Thank you! Your message is submitted.";
}

///コンタクトを取る
if(isset($_POST["content"])){
$to = "lc_contact@langchange.org";
$title = "問い合わせ";
$content = "名前：".$_POST["name"]."\nメールアドレス：".$_POST["mail"]."\n件名：".$_POST["header"]."\n\n内容：".$_POST["content"];
$from = "From: Langchangeにお越しのお客様";
mb_language("Japanese");
mb_internal_encoding("UTF-8");
mb_send_mail($to, $title, $content, $from);

echo "Thank you! Your message is submitted.";
}
?>
