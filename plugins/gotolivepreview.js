/*
 * Copyright (c) 2014 
 * ==================================
 * powered by revaxarts.com (http://revaxarts.com)
 * original filename: gotolivepreview.js
 * filesize: 1710 Bytes
 * last modified: Thu, 16 May 2013 09:20:29 +0200
 *
 */
// ==UserScript==
// @name			GoToLivepreview for Envato's marketplaces
// @creator			userscripts@revaxarts.com
// @namespace		revaxarts.com
// @description		Envato Livepreviews for Thumbs
// @date			2011-11-10
// @version			0.5
// @include			http://activeden.net/*
// @include			http://themeforest.net/*
// @include			http://codecanyon.net/*
// ==/UserScript==
(function () {



	var marketplace = location.hostname.split('.').shift();

	$('img[data-preview-url]').each(function () {
		var _this = $(this),
			itemname = _this.data('itemName');
		wrapper = _this.parent().parent();
		if (!wrapper.is('.thumbnail')) return false;

		var href = wrapper.find('a').attr('href').split('?')[0],
			id = href.split('/').pop(),
			livepreview = href.replace(id, 'full_screen_preview/' + id);
		wrapper.hover(function () {
			$(this).find('a.gotolivepreview').fadeIn(100);
		}, function () {
			$(this).find('a.gotolivepreview').fadeOut(100);
		});

		$('<a>', {
			"class": "gotolivepreview",
			title: 'Livepreview of ' + itemname,
			href: livepreview
		}).css({
			"position": "absolute",
			"display": "block",
			"border": "0 !important",
			"padding": "2px 4px"
		}).html('<img src="http://0.envato-static.com/images/' + marketplace + '/buttons/sticky.png" width="11" height="11" title="Livepreview of ' + itemname + '" alt="" />').hide().prependTo(wrapper);

	});

	$('body').delegate('a.gotolivepreview', 'click', function (event) {
		event.stopPropagation();
		event.preventDefault();
		window.open(this.href);
	});
	
	

	if (location.href.match(/full_screen_preview/)) {
		if($.trim($('h1').html()) == 'Page Not Found'){
			location.href = location.href.replace('full_screen_preview/','');
		}
	}






})();