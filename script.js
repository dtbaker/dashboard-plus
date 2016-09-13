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
// @date			2015-09-04
// @version			1.4.6
// @include			http://activeden.net*
// @include			http://audiojungle.net*
// @include			http://themeforest.net*
// @include			http://videohive.net*
// @include			http://graphicriver.net*
// @include			http://3docean.net*
// @include			http://codecanyon.net*
// @include			http://photodune.net*
// @include			https://activeden.net*
// @include			https://audiojungle.net*
// @include			https://themeforest.net*
// @include			https://videohive.net*
// @include			https://graphicriver.net*
// @include			https://3docean.net*
// @include			https://codecanyon.net*
// @include			https://photodune.net*
// ==/UserScript==

(function () {

	/*
	insert the the bootstrap of dbp
	to get an uncompress version append compress=0 like http://dbp.revaxarts.com/js/bootstrap.js?compress=0
	*/

	var inject = document.createElement("script");
	inject.setAttribute("type", "text/javascript");

    // we can load dashboard plus code from various locations. uncomment based on your needs.

    // 1: from github pages dtbaker.github.io/dashboard-plus/bootstrap.js
    var dashboardplus_base_uri = '//dtbaker.github.io/dashboard-plus/';

    // 2: from local code contained in this plugin folder
    // var dashboardplus_base_uri = chrome.extension.getURL('');

    // 3: from a github development repo for testing eg: raw.githubusercontent.com/dtbaker/dashboard-plus/master/bootstrap.js
    //    you can use your own github fork here for testing
    //var dashboardplus_base_uri = '//raw.githubusercontent.com/dtbaker/dashboard-plus/master/';


    // this injects some code into the browser window along with the bootstrap.js extension file (from our desired loading location above)
    var actualCode = ['window.dashboardplus = window.dashboardplus || {};',"window.dashboardplus['base'] = '" +  dashboardplus_base_uri + "'; "].join('\n');
    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head||document.documentElement).appendChild(script);
    inject.setAttribute("src", dashboardplus_base_uri + 'bootstrap.js');
	(document.head || document.documentElement).appendChild(inject);

})();