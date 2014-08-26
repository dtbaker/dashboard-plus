/*
 * Copyright (c) 2014 
 * ==================================
 * powered by revaxarts.com (http://revaxarts.com)
 * original filename: reminder.js
 * filesize: 3052 Bytes
 * last modified: Thu, 12 Jun 2014 07:45:22 +0200
 *
 */
(function () {
	
	//"use strict"
	
	var d = new Date(),
		currentYear = d.getFullYear(),
		currentMonth = d.getMonth(),
		melborntimeoffset = d.getTimezoneOffset()/60+11,
		lastday = new Date(currentYear, currentMonth + 1, 0, 24-melborntimeoffset),
		banner = false,
		remindersat = window.dashboardplus.get('reminder','hours'),
		past = window.dashboardplus.getCookie('reminder'),
		timeleft = null;
	
	
	remindersat = remindersat ? remindersat.split(',') : [];
	past = past ? past.split('|') : [];
	
	if(!remindersat.length){
		alert('Please define at least one hour for the reminder!');
		return;
	}
	
	remindersat.sort(function(a,b){return a-b});
	past.sort(function(a,b){return b-a});
	
	var highest = past[0] ? parseInt(past[0], 10) : 0;
	
	check();
	
	function check(){
		timeleft = (lastday.getTime()-new Date().getTime())/3600000;
		
		if(highest && timeleft > highest){
			window.dashboardplus.setCookie('reminder', 1, -1);
		}
		
		var val;
		
		for(var i in remindersat){
			val = parseFloat(remindersat[i]);
			if(timeleft < val){
				addbanner(val);
			}
		}
	}
			
	function addbanner(id){
		if(banner || $.inArray(''+id, past) != -1){
			if($.inArray(''+id, past) == -1){
				past.push(id);
				window.dashboardplus.setCookie('reminder', past.join('|'), Math.ceil(timeleft/24));
			}
			return;
		}
		
		banner = $('<div style="background-color:#D74123;position:fixed;z-index:10000;top:0;right:0;left:0;height:40px;overflow:hidden;"><p style="font-size:14px;padding:10px 20px;color:#eee;">Hey '+$('#user_username').html()+'! Only <strong>'+totime(timeleft)+'</strong> left to withdraw your money! <span style="float:right;margin-top: -6px;"><a class="dbp-closebanner" data-id="'+id+'" href="/withdrawal" role="button">Widthdraw right now</a> or <a class="dbp-closebanner" data-id="'+id+'" href="" style="color:#eee;font-weight:700;">close</a></span></p></div>').hide().prependTo('body').slideDown();
		$('body').animate({'padding-top':40});
		
		banner.delegate('a.dbp-closebanner' ,'click', function(){
			past.push($(this).data('id'));
			window.dashboardplus.setCookie('reminder', past.join('|'), Math.ceil(timeleft/24));
			banner.slideUp();
			$('body').animate({'padding-top':0});
			if(!$(this).attr('href')) return false;
		});
		var timeelement = banner.find('strong');
		setInterval(function(){
			timeleft = (lastday.getTime()-new Date().getTime())/3600000;
			timeelement.html(totime(timeleft));
		}, 1000);
	}
	
	function totime(timeleft){
		sec_numb = Math.max(0, parseInt(timeleft * 3600, 10));
		var days = Math.floor(sec_numb / 86400);
		var hours = Math.floor(sec_numb / 3600 - days * 24);
		var minutes = Math.floor((sec_numb - (Math.floor(sec_numb / 3600)  * 3600)) / 60);
		var seconds = sec_numb - (Math.floor(sec_numb / 3600)  * 3600) - (minutes * 60);
		
		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var time    = (days ? days+(days == 1 ? ' day ' : ' days ') : '')+hours+':'+minutes+':'+seconds;
		return time;
	}
	
})();