var eday = new Date();
var year = eday.getFullYear();


///誕生日スピンボックスを作成
function setBirthdaySpinbox(){
	var tmp = "<select id='year' name='year'>";

	var preyear = 1940;
	for(var i=preyear;i<=year;i=i+1){
		if(i==1994)
		tmp = tmp + "<option value='"+String(i)+"' selected>"+String(i)+"</option>";
		else
		tmp = tmp + "<option value='"+String(i)+"'>"+String(i)+"</option>";
	}

	tmp = tmp + "</select> 年 <select id='month' name='month'>";
	
	for(var i=1;i<=12;i=i+1){
		if(i<10){
			tmp = tmp + "<option value='0"+String(i)+"'>"+String(i)+"</option>";
		}else{		
			tmp = tmp + "<option value='"+String(i)+"'>"+String(i)+"</option>";
		}			
	}

	tmp = tmp + "</select> 月 <select id='day' name='day'>";

	for(var i=1;i<=31;i=i+1){
		if(i<10){
			tmp = tmp + "<option value='0"+String(i)+"'>"+String(i)+"</option>";
		}else{		
			tmp = tmp + "<option value='"+String(i)+"'>"+String(i)+"</option>";
		}	}

	tmp = tmp + "</select> 日";


	var val = document.getElementById("birthday");
	val.innerHTML = tmp;
}

