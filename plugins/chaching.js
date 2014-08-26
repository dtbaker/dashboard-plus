/*
 * Copyright (c) 2014 
 * ==================================
 * powered by revaxarts.com (http://revaxarts.com)
 * original filename: chaching.js
 * filesize: 2095 Bytes
 * last modified: Thu, 12 Jun 2014 09:09:28 +0200
 *
 */
(function () {

	//"use strict"
	
	var username = $('#user_username').html();
	if (!username) return false;
	
	var interval = 5,
		now = new Date().getTime(),
		lastcheck = window.dashboardplus.getCookie('cha-ching_lastcheck'),
		lastsales = window.dashboardplus.getCookie('cha-ching_lastsales'),
		mp3 = 'http://dl.dropbox.com/u/9916342/cha-ching/cha-ching.mp3',
		ogg = 'http://dl.dropbox.com/u/9916342/cha-ching/cha-ching.ogg',
		$userbalance = $('.header-logo-account__balance');

	setTimeout(start, Math.max(0, interval * 60000 - (now - lastcheck)));
	

	function chachingIT() {
		if(!window.dashboardplus.get('chaching', 'playsound')) return false;
		if ($('#dbp-cha-ching').length) $('#cha-ching').remove();
		$('<audio id="dbp-cha-ching" autoplay><source src="' + ogg + '" type="audio/ogg"></source><source src="' + mp3 + '" type="audio/mpeg"></source></audio>').appendTo('body');
	}

	function start() {
		checkForSales();
		setInterval(function () {
			checkForSales();
		}, interval * 60000);
	}

	function checkForSales() {
		$.get('/user/' + username, function (data) {
		
			//get current sales
			var sales = data.match(/<meta itemprop="interactionCount" content="AuthorSales:([^<]+)"/);
			//could fetch sales
			
			if (!sales || !sales[1]) return;
			//sales are different then the last ones
			//if (lastsales != sales[1]) {
				//save new sales
				window.dashboardplus.setCookie('cha-ching_lastsales', sales[1], 365);
				//get current deposit
				var balance = data.match(/<strong class="header-logo-account__balance">([^<]+)<\/strong>/);
				//if we have last sales and lastcheck is set or the balance isn't equal the current balance
				if (lastsales && !lastcheck || $userbalance.html() != balance[1]) {
					$userbalance.html('New Sale! ' + balance[1]);
					chachingIT();
				}
				//our new lastsales
				lastsales = sales[1];
			//}
			
			
			//lastcheck was now
			lastcheck = new Date().getTime();
			//save lastcheck but remove it if browser is closed (force check on restart)
			window.dashboardplus.setCookie('cha-ching_lastcheck', lastcheck);
		});
	}

})();
