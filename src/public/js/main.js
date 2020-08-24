jQuery(document).ready(function ($) {
	let slideCount = $("#slider ul li").length;
	let slideWidth = $("#slider ul li").width();
	let slideHeight = $("#slider ul li").height();
	let sliderUlWidth = slideCount * slideWidth;

	$("#slider").css({ width: slideWidth, height: slideHeight });

	if (slideWidth !== sliderUlWidth) {
		setInterval(function () {
			moveRight();
		}, 4000);
		$("#slider ul").css({ width: sliderUlWidth, marginLeft: -slideWidth });
	}

	$("#slider ul li:last-child").prependTo("#slider ul");

	function moveLeft () {
		$("#slider ul").animate({
			left: +slideWidth,
		}, 200, function () {
			$("#slider ul li:last-child").prependTo("#slider ul");
			$("#slider ul").css("left", "");
		});
	}

	function moveRight () {
		$("#slider ul").animate({
			left: -slideWidth,
		}, 200, function () {
			$("#slider ul li:first-child").appendTo("#slider ul");
			$("#slider ul").css("left", "");
		});
	}

	$(".control_prev").click(function () {
		moveLeft();
	});

	$(".control_next").click(function () {
		moveRight();
	});
});
