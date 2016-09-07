$(document).ready(function() {
	// Top navigation drop down menu toggle
	$('header .drop').on('click', function(event) {
		event.stopPropagation();
		event.preventDefault();
		$(this).parent().toggleClass('dropped');
	});

	$('html').on('click', function() {
		$('header .drop').parent().removeClass('dropped');
	});

    // Mobile menu toggle
    $('#menu-toggle').on('click', function() {
        $('header nav .menu').slideToggle(200);
    });

    $('header nav .menu a').on('click', function() {
        $('header nav .menu').slideUp(0);
    });
});