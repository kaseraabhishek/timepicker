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
		
		if(mins < 10) {
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

	Timepicker = {
		settings : {},
		init: function(options, elem) {
		    var defaultOption = {
				startTime : '8:00 am',
				endTime : '8:00 pm',
				duration : 30,
			}
			this.settings = $.extend({},defaultOption,options);
			this.element  = elem;
			this.$element = $(elem);
			this.setListeners();
	        this.minTime = this.settings.minTime;
	        this.maxTime = this.settings.maxTime;
			var self = this;
			var date = new Date();
			var startHrMin = getHrMin(this.settings.startTime);
			var startDate = new Date();

			startDate.setHours(startHrMin[0], startHrMin[1], 0, 0);
			var endHrMin = getHrMin(this.settings.endTime);
			var endDate = new Date();
			endDate.setHours(endHrMin[0], endHrMin[1], 0, 0);

			var diffMs = (endDate - startDate);
			var diffMins = diffMs / 60000; // minutes
			this.settings.slotCount = diffMins / this.settings.duration;
			return this;
		}, 
        generateHtml : function() {
        	var $div = $("<div></div>");
			var $span = $("<span></span>");
			var $iTag = $("<iTag></iTag>");
			var $timeList = $div.clone();
			$('body').find('.time-list').remove();
			$('body').find('.time-list').hide();
			$timeList = $div.clone().addClass('time-list').css({'display':'none','position':'fixed'});
			var minDate = this.minTime ? getDatefromTimeString(this.minTime) : null;
			var maxDate = this.maxTime ? getDatefromTimeString(this.maxTime) : null;
			var slotCount = this.settings.slotCount;
			var startHrMin = getHrMin(this.settings.startTime);
			var startDate = new Date();
			startDate.setHours(startHrMin[0], startHrMin[1], 0, 0);
			for(i=0;i<slotCount; i++) {
				var minutes = i * this.settings.duration;
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
		},

		setListeners:function (){
			var self=this;
			this.$element.on('click',function (){
				var $currentEle = $(this);
				var $timeList = self.generateHtml($currentEle);
				$timeList.show();
				self.setPosition($(this), $timeList);

				$timeList.find('div').click(function() {
					$timeItem = $(this);
					if($timeItem.hasClass('disable')) {
						return false;
					}
					var time = $timeItem.text()
					$currentEle.val(time);
					$timeList.remove();
					$currentEle.change();
					return false;
				})
			});
		},

		setMinTime : function(minTime) {
			this.settings.minTime = minTime;
		},
    };

    /*Timepicker.prototype = {
        constructor: Timepicker,   
    }*/

	$.fn.timepicker = function(options) {
		this.setMinTime = function(time) {
			options.minTime = time;
			var timepicker = Object.create(Timepicker);
			timepicker.init(options, this);
		}

		this.setMaxTime = function(time) {
			options.maxTime = time;
			var timepicker = Object.create(Timepicker);
			timepicker.init(options, this);
		}

		this.setStartTime = function(time) {
			options.startTime = time;
			var timepicker = Object.create(Timepicker);
			timepicker.init(options, this);
		}

		this.setEndTime = function(time) {
			options.endTime = time;
			var timepicker = Object.create(Timepicker);
			timepicker.init(options, this);
		}

		this.setDuration = function(duration) {
			options.duration = duration;
			var timepicker = Object.create(Timepicker);
			timepicker.init(options, this);
		}


		$(document).on('click',function(e) {
			$target = $(e.target);
			if(!$target.hasClass('timepicker') && $target.parents('.time-list').length == 0) {
				$('.time-list').remove();
			}
		})
		if ( this.length ) {
			return this.each(function(){
				var timepicker = Object.create(Timepicker);
				timepicker.init(options, this);
			});
	    }
		
	};

});
