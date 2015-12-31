
$(document).ready(function() {

});

function goTo(path, elt) {
	target = $(path);
	var sub;
	if (window.innerWidth > 768) {
		sub = 80;
	} else {
		sub = 0;
	}
	target = target.offset().top - sub;
	$("html, body").animate({
    scrollTop: target
  }, 1000);
}