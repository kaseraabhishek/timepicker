$(function() {
	function getHrMin(time) {
		var hr,min;
		time = time.split(" ");
		if(time[1]==='am'){
			time = time[0].split(":");
			hr= parseInt(time[0]);
			var min= parseInt(time[1]);
		}
		else{
			time = time[0].split(":");
			hr= parseInt(time[0]) + 12;
			min= parseInt(time[1]);
		}
		return [hr, min];
	}

	function getTimeString(date, minutes) {
		var hr,min;
		var newDate = new Date(date.getTime() + minutes*60000);
		var hrs = newDate.getHours();
		var mins = newDate.getMinutes();
		var ampm = 'am';
		if(hrs>12){
			hrs = hrs - 12;
			ampm = 'pm';
		}
		if(mins == 0) {
			mins = "0" + mins;
		}
		return hrs + ":" + mins + " " + ampm;
	}

	function getDatefromTimeString(timeString) {
		var d = new Date();
		var hrMin = getHrMin(timeString);
		d.setHours(hrMin[0], hrMin[1], 0, 0);
		return d;
	}

	$.fn.timepicker = function(options) {
		var defaultOption = {
			startTime : '8:00 am',
			endTime : '8:00 pm',
			duration : 30,
		}
		var self = this;
		var date = new Date();
		var settings = $.extend(defaultOption, options);
		var startHrMin = getHrMin(settings.startTime);
		var startDate = new Date();

		startDate.setHours(startHrMin[0], startHrMin[1], 0, 0);
		var endHrMin = getHrMin(settings.endTime);
		var endDate = new Date();
		endDate.setHours(endHrMin[0], endHrMin[1], 0, 0);

		var minTime = settings.minTime;
		var maxTime = settings.maxTime;

		var diffMs = (endDate - startDate);
		var diffMins = diffMs / 60000; // minutes
		var slotCount = diffMins / settings.duration;

		var $div = $("<div></div>");
		var $span = $("<span></span>");
		var $iTag = $("<iTag></iTag>");
		var $timeList = $div.clone();
		
		$(document).on('click',function(e) {
			$target = $(e.target);
			if(!$target.hasClass('timepicker') && $target.parents('.time-list').length == 0) {
				$('.time-list').remove();
			}
		})

		self.setMinTime = function(minTime) {
			settings.minTime = minTime;
		}
		
		self.each(function() {
			$this = $(this);

			Timepicker = {
                element: $this,
                minTime: settings.minTime,
                maxTime: settings.maxTime,
                // step 3
                setMinTime: function(){
                	console.log('mintime');
                }, 
                generateHtml : function() {
					$('body').find('.time-list').remove();
					$('body').find('.time-list').hide();
					$timeList = $div.clone().addClass('time-list').css({'display':'none','position':'fixed'});
					var minDate = minTime ? getDatefromTimeString(minTime) : null;
					var maxDate = maxTime ? getDatefromTimeString(maxTime) : null;
					for(i=0;i<slotCount; i++) {
						var minutes = i * settings.duration;
						var timeString = getTimeString(startDate, minutes);
						var $timeListItem = $div.clone().html(timeString);
						var date = getDatefromTimeString(timeString);
						if((minDate && date <= minDate) || (maxDate && date >= maxDate)) {
							$timeListItem.addClass('disable');
						}
						$timeList.append($timeListItem);
					}
					$('body').append($timeList);
					return $timeList;
				},
				setPosition : function(current, tList) {
					var $inputOffset = current.offset();
					var inputInnerHeight = current.innerHeight();
					var outerHeight = current.outerHeight();
					var width = current.outerWidth();
					var height = outerHeight > inputInnerHeight ? outerHeight : inputInnerHeight;
					var left = $inputOffset.left;
					var top = $inputOffset.top + height;
					tList.offset({left:left, top:top});
					tList.css({'min-width':width+'px'});
				}
            };
			$this.click(function() {
				var $currentEle = $(this);
				var $timeList = Timepicker.generateHtml($(this));
				$timeList.show();
				Timepicker.setPosition($(this), $timeList);

				$timeList.find('div').click(function() {
					$timeItem = $(this);
					if($timeItem.hasClass('disable')) {
						return false;
					}
					var time = $timeItem.text()
					$currentEle.val(time);
					$timeList.remove();
					return false;
				})
				return false;
			})
		});

		return self;
	};
})
