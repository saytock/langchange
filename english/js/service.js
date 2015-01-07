onload = init

function init(){
	$('#contSlider').bxSlider({
        	slideWidth: 640, //slideWidth * maxSlides <= #histSlide縺ｮwidth
    		minSlides: 2,
    		maxSlides: 1,
    		moveSlides: 1,
    		slideMargin: 20,
		hideControlOnEnd:true
	});


	return false;
}
