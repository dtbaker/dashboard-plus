/*
 * Copyright (c) 2014 
 * ==================================
 * powered by revaxarts.com (http://revaxarts.com)
 * original filename: salesrefresher.js
 * filesize: 905 Bytes
 * last modified: Sun, 26 Jan 2014 02:00:17 +0100
 *
 */
(function () {
	
	var useraccountnav = $('.header-logo-account__user-nav-item');
	var user_balance = $('.header-logo-account__balance').attr('title', 'Click to reload');
	
	user_balance.on('click', function(){
		update();
		event.preventDefault();
		return false;
	});
	
	if(window.dashboardplus.get('salesrefresher', 'autoreload')){
		setInterval(function(){
			update();
		}, 300000);
	}
	
	function update(){
		var old = user_balance.html();
		var count = old.length;
		var temp = '$';
		var li = useraccountnav.find('li').eq(0);
		
		for(count; count > 4; count--){
			temp += '&ndash;';
		}
		temp += '.&ndash;&ndash;';
		li.css({width:li.width()});
		user_balance.html(temp);
	
		$.get(location.href, function(data){
			li.css({width:'auto'});
			var balance = data.match(/<strong class="header-logo-account__balance">(.*)<\/strong>/g)[0];
			user_balance.html($(balance).text());
		});
	}
		
})();
