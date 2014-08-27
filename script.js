/*
 * Copyright (c) 2014 
 * ==================================
 * powered by revaxarts.com (http://revaxarts.com)
 * original filename: dashboardplus.user.js
 * filesize: 951 Bytes
 * last modified: Thu, 12 Jun 2014 07:46:24 +0200
 *
 */
// ==UserScript==
// @name			Dashboard Plus for Envato Marketplaces
// @creator			userscripts@revaxarts.com
// @namespace		revaxarts.com
// @description		Dashboard Plus for the Marketplaces.
// @date			2014-08-27
// @version			1.3.2
// @include			http://activeden.net*
// @include			http://audiojungle.net*
// @include			http://themeforest.net*
// @include			http://videohive.net*
// @include			http://graphicriver.net*
// @include			http://3docean.net*
// @include			http://codecanyon.net*
// @include			http://photodune.net*
// ==/UserScript==

(function () {

	/*
	insert the the bootstrap of dbp
	to get an uncompress version append compress=0 like http://dbp.revaxarts.com/js/bootstrap.js?compress=0
	*/
	
	var inject = document.createElement("script");
	inject.setAttribute("type", "text/javascript");
    if(true) { // change to false if developing locally..
        inject.setAttribute("src", '//dtbaker.github.io/dashboard-plus/bootstrap.js');
    }else {
        var actualCode = ['window.dashboardplus = window.dashboardplus || {};',
                            "window.dashboardplus['base'] = '" +  chrome.extension.getURL('') + "'; "].join('\n');
        var script = document.createElement('script');
        script.textContent = actualCode;
        (document.head||document.documentElement).appendChild(script);
        inject.setAttribute("src", chrome.extension.getURL('bootstrap.js'));
    }

	(document.head || document.documentElement).appendChild(inject);
	

})();