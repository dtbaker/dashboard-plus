/*
 * Copyright (c) 2014 
 * ==================================
 * powered by revaxarts.com (http://revaxarts.com)
 * original filename: notification.js
 * filesize: 5655 Bytes
 * last modified: Tue, 11 Feb 2014 10:04:16 +0100
 *
 */
(function () {
	
	//"use strict"
	
	var notifications,
		interval = 5, //check interval in minutes
		$badge;
		
/*
	var color = {};
		var marketplace = location.hostname.split('.').shift();
		color['activeden'] = 'e86223';
		color['audiojungle'] = '65992e';
		color['themeforest'] = '69472a';
		color['videohive'] = 'f4950c';
		color['graphicriver'] = '0568b3';
		color['3docean'] = '802836';
		color['codecanyon'] = 'db592b';
		color['photodune'] = '499ba1';
		
		color = color[marketplace] || '333333';
*/
		
	var color = '0084B4';
	
	var init = function(){
		
		var now = new Date().getTime(),
			lastcheck = window.dashboardplus.getCookie('notification_lastcheck');
			
			
		//get saved notifications
		notifications = window.dashboardplus.getCookie('notification_count');
		
		//print them if some exists
		if(notifications) printNotifications();

		//clear notifications if the mark all as unread button is pressed
		if(/author_dashboard/.test(location.pathname)){
			
			lastcheck = 0;
			
			var button = $('.content-s').find('.comments-search-controls__mark-all-read').find('button');
			
			if(button.length) {
				
				button.bind('click',function(){
					window.dashboardplus.setCookie('notification_count',0);
					window.dashboardplus.setCookie('notification_lastcheck',0);
					printNotifications();
				});
				
/*
				$.ajax({
					url: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js',
					dataType: "script",
					cache: true,
					success: function () {
						var plt = $('#page_load_time'),
							slider = $('<div>').appendTo($('.comments-controls').eq(0)),
							value = $('<div>use the slider to define the time you would like to mark comments as read</div>').appendTo($('.comments-controls').eq(0)),
							d = new Date(),
							time = parseInt(plt.val(), 10)*1000,
							mintime = time-(3.156e+10),
							output = time;
						
						d.setTime(time);
						
						slider.css({
							'border': '1px solid #ccc',
							'height': 5,
							'margin-top': 20,
							'margin-left': 8,
							'margin-right': 8
						}).slider({
							min: mintime,
							max: time,
							step: 3156,
							value: time,
							slide: function (event, ui) {
								var x = (time-ui.value)/(time-mintime);
								x = (Math.exp(2.77258872 * x) - 1) / 15;
								
								output = time-(time-mintime)*x;
								
								button.html((time != ui.value) ? 'Mark older than '+human_time_diff(time, output)+' as read' : 'Mark all as read');
								d.setTime(Math.round(output));
								value.html(d+'');
							},
							change: function (event, ui) {
								d.setTime(Math.round(output));
								plt.val(Math.round(output/1000));
								
							}
						}).find('a').css({
							'border': '1px solid black',
							'height': 12,
							'width': 12,
							'top': -5,
							'margin-left': -5,
							'background-color': '#'+color,
							'display': 'block',
							'position': 'relative'
						});
						value.css({
							'font-size': 12,
							'margin-top': 10,
							'color': '#aaa',
							'text-align': 'right'
						});
						
						
						function human_time_diff(from, to){
							var diff = ((from - to)/1000);
							var str = '';
							if(diff < 60){
								return (diff)+' sec.';
							}else if(diff < 3600){
								return (diff/60).toFixed(2)+' min.';
							}else if(diff < 86400){
								return (diff/3600).toFixed(2)+' hours';
							}else if(diff < 2.63e+6){
								return (diff/86400).toFixed(2)+' days';
							}
							return (diff/2.63e+6).toFixed(2)+' month';
						}
					}
				});
*/
				
			} //end if
			
			
		}

		setTimeout(start,Math.max(0,interval*60000-(now-lastcheck)));
		
	};

	var start = function() {
		checkForNotifications(1);
		setInterval(function(){
			checkForNotifications(1);
		}, interval*60000);
	};

	var checkForNotifications = function(page) {
	
		//get the Url
		$.get(getURL(page), function(response){
		
			//count unread posts on the dashboard
			var comment = response.match(/<p class="comments-search-controls__results-count">(\d+) comments? found/);
			notifications = comment ? parseInt(comment[1], 10) : 0;
			
			//we made a check, lets save it
			window.dashboardplus.setCookie('notification_lastcheck',new Date().getTime());
			
			//save notifications for later
			window.dashboardplus.setCookie('notification_count',notifications,365);
			
			//print
			printNotifications();
			
		});
	};

	var printNotifications = function() {
		
		//badge element must be made
		if(!$badge){
			$badge = $('<a>',{
				id: 'notification_badge'
			}).css({
				'display': 'block',
				'position': 'absolute',
				'left': '-9px',
				'top': '-2px',
				'font-size': '10px',
				'line-height': '10px',
				'font-weight': '700',
				'padding': '4px 4px 5px',
				'text-align': 'center',
				'min-width': '10px',
				'border': '0',
				'cursor': 'pointer',
				'border-radius': '4px',
				'background-color': ' #'+color,
				'color': '#fff',
				'z-index': '5000',
				'text-decoration': 'none'
			})
			.hide()
			.bind('click', function(){
				location.href="/author_dashboard";
				return false;
			})
			.prependTo('.header-logo-account__user-nav-item:first');
			
		}
		
		//remove any (XX) from the title
		document.title = document.title.replace(/^\(\d+\+?\)/,'');
		
		//we have notifications
		if(parseInt(notifications, 10)){
			$badge.html(notifications).show();
			//prepend it to the titel
			document.title = '('+notifications+') '+document.title;
		}else{
			//hide badge
			$badge.html(notifications).hide();
		}
		
	};
	
	var getURL = function(page) {
		return 'http://'+location.hostname+'/author_dashboard?page='+page;
	};

	init();
		
		
})();
