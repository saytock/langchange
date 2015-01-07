<?php

include("connectDB.php");

if(isset($_POST["initialize"])){
	
	$query = <<< EOM
	

	SET NAMES utf8;
	DROP TABLE temp,block,friend,history,comment,learning,teaching,users;

	CREATE TABLE users(
		id varchar(50) primary key,
		name varchar(50),
		image varchar(50),
		sex varchar(2),
		birthday varchar(10),
		college varchar(50),
		skype varchar(50),
		mail varchar(50),
		support varchar(10),
		password varchar(50),
		ticket int,
		penalty varchar(2),
		country varchar(10)
	);

	CREATE TABLE teaching(
		id int primary key auto_increment,
		userid varchar(50),
		teachingyear varchar(4),
		teaching varchar(15),
		checks char(2),
		comment char(2),
		friendid varchar(50),
		foreign key (userid) references users(id)
	);
	
	CREATE TABLE learning(
		id int primary key auto_increment,
		userid varchar(50),
		learningyear varchar(4),
		learning varchar(15),
		comment char(2),
		friendid varchar(50),
		foreign key (userid) references users(id)
	);

	CREATE TABLE comment(
		id int primary key auto_increment,
		userid varchar(50),
		date varchar(15),
		friend varchar(50),
		type varchar(10),
		checks varchar(15),
		content varchar(500),
		foreign key (userid) references users(id)
	);

	CREATE TABLE history(
		id int primary key auto_increment,
		userid varchar(50),
		friendid varchar(50),
		year varchar(4),
		date varchar(15),
		type varchar(10),
		checks varchar(2),
		foreign key (userid) references users(id)
	);

	CREATE TABLE friend(
		id int primary key auto_increment,
		userid varchar(50),
		friendid varchar(50),
		checks varchar(2),
		foreign key (userid) references users(id)
	
	);

	CREATE TABLE block(
		id int primary key auto_increment,
		userid varchar(50),
		friendid varchar(50),
		foreign key (userid) references users(id)
	
	);

	CREATE TABLE temp(
		id int primary key auto_increment,
		code varchar(10),
		mail varchar(50)
	);

	INSERT INTO users(id,name,image,sex,birthday,college,skype,mail,support,password,country,ticket) VALUES('1000','あき','1.jpg','女','1990/09/27','東京工科大学','akitan','akitan@test.com','初級','1000','日本人',5);
	INSERT INTO users(id,name,image,sex,birthday,college,skype,mail,support,password,country,ticket) VALUES('2000','かすみ','2.jpg','女','1990/06/08','東北大学','kasumin','kasumin@test.com','中級','2000','日本人',5);
	INSERT INTO users(id,name,image,sex,birthday,college,skype,mail,support,password,country,ticket) VALUES('3000','ゆいか★','3.jpg','女','1995/03/09','横浜国立大学','yuipon','yuipon@test.com','上級','3000','外国人',5);

	INSERT INTO friend(userid,friendid) VALUES ('2000','1000');
	INSERT INTO friend(userid,friendid) VALUES ('2000','3000');
	


	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','3000','2014','8月12日=09:00','learning','c');	
	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','3000','2014','8月13日=09:00','learning','c');	
	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','3000','2014','8月14日=09:00','learning','c');	
	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','1000','2014','8月12日=09:00','learning','c');	
	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','1000','2014','8月13日=09:00','learning','c');	
	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','1000','2014','8月14日=09:00','learning','c');	
	
	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','3000','2014','8月12日=10:00','teaching','c');	
	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','3000','2014','8月13日=10:00','teaching','c');	
	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','3000','2014','8月14日=10:00','teaching','c');	
	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','1000','2014','8月12日=10:00','teaching','c');	
	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','1000','2014','8月13日=10:00','teaching','c');	
	INSERT INTO history(userid,friendid,year,date,type,checks) VALUES('2000','1000','2014','8月14日=10:00','teaching','c');	


	INSERT INTO temp (code,mail) value('apple','1000');

EOM;
	if($pdo->query($query)){
		$msg = "be initialized!";
	}else{
		$msg = "error";
	}

}
?>
<html>
<head>
	<title>initializeDB</title>
</head>
<body>
	<center>
		<h1>DB initialize</h1>
		<?php
			if(isset($msg)){
				print($msg);
			}
		?>
		<form action="initializeDB.php" method="post">
		<input type="submit" name="initialize" value="initialize"/>
		</form>
	</center>
</body>
</html>
