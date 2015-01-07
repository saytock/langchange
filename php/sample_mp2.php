<?php

$to = "alice_sys.14711@docomo.ne.jp";
$title = "意見・要望";
$content = $_POST["contact"];
$from = "From: Langchangeにお越しのお客様";
mb_language("Japanese");
mb_internal_encoding("UTF-8");
mb_send_mail($to, $title, $content, $from);

?>
