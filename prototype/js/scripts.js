$(document).ready(function() {
	// Top navigation drop down toggle
	$('header .drop').click(function(e) {
		e.stopPropagation();
		e.preventDefault();
		$(this).parent().toggleClass('dropped');
	});

	// 
	$('html').click(function() {
		$('header .drop').parent().removeClass('dropped');
	});
});