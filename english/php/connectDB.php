<?php
	//setting database
		$dbtype='mysql';
		$dbname='langchange_strage';
		$dbhost='mysql320.db.sakura.ne.jp';
		$dbuser='langchange';
		$dbpass='saytock927';

		try{
			$pdo = new PDO("{$dbtype}:dbname={$dbname};host={$dbhost}",$dbuser,$dbpass);
			$pdo->query("SET NAMES utf8");

		}catch(PDOException $e){
			exit("cannot connect database");
		}
?>
