# timepicker


Use of timepicker	

	$(".timepicker.start").timepicker({
		'startTime' : '9:00 am',
		'endTime' : '9:00 pm',
		'duration' : '16',
		'maxTime' : '7:00 pm',
	})

Use of timepicker with start time and end time

	$timeStart = $(".timepicker.start").timepicker({
		'startTime' : '9:00 am',
		'endTime' : '9:00 pm',
		'duration' : '16',
		'maxTime' : '7:00 pm',
	}).on('change ',function(e) {
		$timeEnd.setMinTime($(this).val());
	});
	
	$timeEnd = $(".timepicker.end").timepicker({
		'minTime' : $timeStart.val(),
		'startTime' : '9:00 am',
		'endTime' : '9:00 pm',
		'duration' : '16',
	}).on('change ',function(e) {
		$timeStart.setMaxTime($(this).val());
	});

set option in time picker.

	$timepicker = $(".timepicker.start").timepicker({
		'startTime' : '9:00 am',
		'endTime' : '9:00 pm',
		'duration' : '16',
		'maxTime' : '7:00 pm',
	})

	// time format :  9:00 am
	$timepicker.setStartTime(time);

	$timepicker.setEndTime(time);

	$timepicker.setMinTime(time);

	$timepicker.setMaxTime(time);

	// duration in mins
	$timepicker.setDuration(duration);
