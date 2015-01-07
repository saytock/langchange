onload = init

var video;
var videoApp;

function init(){
	videoApp = setTimeout('startVideo()',3000); 
	setTimeout('stopVideo()',30000*10000);

}

function startVideo(){
	video = window.open("https://appear.in/masanori","video chat","width=600px,height=400px,location=1");
	clearTimeout(videoApp);

	
}

function stopVideo(){
	video.window.close();
}
