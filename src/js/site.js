$(document).ready(function() {
	// Top navigation drop down toggle
	$('header .drop').click(function(e) {
		e.stopPropagation();
		e.preventDefault();
		$(this).parent().toggleClass('dropped');
	});

	$('html').click(function() {
		$('header .drop').parent().removeClass('dropped');
	});

	// Smooth scrolling
	$(".scroll").click(function(event){
		event.preventDefault();
		var dest=0;
		if($(this.hash).offset().top > $(document).height()-$(window).height()){
			dest=$(document).height()-$(window).height();
		} else{
			dest=$(this.hash).offset().top;
		}
		$('html,body').animate({scrollTop:dest}, 200, 'swing');
	});
});