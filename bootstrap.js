/*
 * Copyright (c) 2014 
 * ==================================
 * powered by revaxarts.com (http://revaxarts.com)
 * original filename: bootstrap.js
 * filesize: 12643 Bytes
 * last modified: Thu, 12 Jun 2014 09:12:30 +0200
 *
 */
(function () {

	//"use strict"

	var version = '1.3.5',
		cookiePrefix = 'dbp_';
	
	if( typeof jQuery != 'undefined' ){
		go();
		return;
	}
	
	yepnope({
		load: [
			"http://0.envato-static.com/assets/application/vendor-2b538c3f97134712a085fc58f4c396f5.js" 
		],
		complete: go
	});
		
	function go(){
	
		var username = $('#user_username').html();
		var loadit = [];
		var storage;
		if(!username) return false;
        //console.log(window.dashboardplus);
		window.dashboardplus = window.dashboardplus || {};
		window.dashboardplus['base'] = window.dashboardplus['base'] || '//dtbaker.github.io/dashboard-plus/';
		window.dashboardplus['user'] = username;
		
		try{
			window.dashboardplus['storage'] = $.parseJSON(localStorage.getItem('dashboardplus'));
			
			if(!window.dashboardplus['storage']) {
				window.dashboardplus['storage'] = {};
				
				save('firstvisit', true);
				if(confirm('Welcome to Dashboard Plus!\nYou have to enable plugins at the settings page!\n\nGo there?')){
					location.href = '/user/'+username+'/edit#dashboard_plus';
				}
			}
			
		}catch (e) {
			window.dashboardplus['storage'] = {};
		}
		
		window.dashboardplus.set = function(extension, name, value){
			var obj = localStorage[extension] ? $.parseJSON(localStorage[extension]) : {};
			
			obj[name] = value;
			localStorage.setItem(extension, JSON.stringify(obj));
			
		};
		
		window.dashboardplus.get = function(extension, name){
			var obj = localStorage[extension] || false;
			
			if(!obj) return '';
			
			obj = $.parseJSON(obj);
			
			return (obj[name]) ? obj[name] : '';
		};
		
		window.dashboardplus.delete = function(extension, name){
			if(!name){
				localStorage.removeItem(extension);
			}else{
				var obj = localStorage[extension] ? $.parseJSON(localStorage[extension]) : {};
				if(obj[name]){
					delete(obj[name]);
					localStorage.setItem(extension, JSON.stringify(obj));
				}
			}
			
		};
		
		window.dashboardplus.setCookie = function(cookieName, value, daysToExpire, path, domain, secure) {
			var expiryDate;
			
			cookieName = cookiePrefix + cookieName;
		
			if (daysToExpire) {
				expiryDate = new Date();
				expiryDate.setTime(expiryDate.getTime() + (daysToExpire * 8.64e7));
			}
		
			document.cookie = cookieName + '=' + (value.toString()) +
			(daysToExpire ? ';expires=' + expiryDate.toGMTString() : '') +
			';path=' + (path ? path : '/') +
			(domain ? ';domain=' + domain : '') +
			(secure ? ';secure' : '');
			return window.dashboardplus.getCookie(cookieName);
		};
	
		window.dashboardplus.getCookie = function(cookieName) {

			cookieName = cookiePrefix + cookieName;

			var cookiePattern = new RegExp('(^|;)[ ]*' + cookieName + '=([^;]*)'),
				cookieMatch = cookiePattern.exec(document.cookie);
				if(cookieMatch){
					return cookieMatch[2];
				}
				return 0;
		};
		
		window.dashboardplus.deleteCookie = function(cookieName) {
			return window.dashboardplus.setCookie(cookieName, 0, -1);
		};
		
		var fontawesome = $('<link id="dashboard-plus-font" media="all" type="text/css" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css" rel="stylesheet">');
		
		var active_plugins = get('active', {});
	
		var $content = $('#content');
		
		var plugins = {
			'statementer': {
				'name': 'Statementer',
				'desc': 'Advanced Statement Section'
			},
			'notification': {
				'name': 'Notifications',
				'desc': 'Display count of unread item comments'
			},
			'reminder': {
				'name': 'Withdrawal reminder',
				'desc': 'never forget to withdraw your earned money!',
				'settings':[
					{
						'id': 'hours',
						'label': 'define the hours you would like to get reminded before deadline',
						'placeholder': '1, 3, 24, 48, 72' 
					}	
				]
			},
			'editinline': {
				'name': 'Edit Inline (currenlty disabled)',
				'desc': 'Edit your items directly on the item description page'
			},
			'envatitor': {
				'name': 'Envatitor Embedded',
				'desc': 'Advanced editor for the forums',
				'font': true
			},
			'verify': {
				'name': 'Purchase Verification',
				'desc': 'verify purchasecodes right on your dashboards sidebar'
			},
			'progressbar': {
				'name': 'Upload Progressbar',
				'desc': 'Show the progressbar on uploads'
			},
			'quickcollection': {
				'name': 'Quickcollection',
				'desc': 'Add items to your bookmarks from the item thumbnail'
			},
			'gotolivepreview': {
				'name': 'GoToLivepreview',
				'desc': 'open livepreview right from the item thumbnail (only CC, TF, AD)'
			},
			'chaching': {
				'name': 'Cha-Ching for Envato Authors',
				'desc': 'Sales Notification with sound!',
				'settings':[
					{
						'id': 'playsound',
						'type': 'checkbox',
						'label': 'play sound'
					}	
				]
			},
			'salesrefresher': {
				'name': 'Sales Refresher',
				'desc': 'Refresh your salescount without reloading the site (click on your balance to reload)',
				'settings':[
					{
						'id': 'autoreload',
						'type': 'checkbox',
						'label': 'autoreload every 5 minutes'
					}	
				]
			},
			'replypantry': {
				'name': 'Reply Pantry',
				'desc': 'Store canned text for use in forums and item comments'
			},
			'compare_earnings': {
				'name': 'Compare Earnings',
				'desc': 'allows you to compare your earnings with a previous month/year'
			},
			'_localdevelopment': {
				'beta': true,
				'name': 'Local Development',
				'desc': 'development only'
			}
		};
	
			//Dashboard Page
		if (location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/author_dashboard/)) {
	
			enque('envatitor');
			enque('verify');
			enque('progressbar');
			enque('replypantry');

			//Earnings Page
		}else if (location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/user\/(\w+)\/earnings\/(referrals|sales)\/(.*)/)) {
		
			enque('compare_earnings');
			
			//Settings Page
		}else if (location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/user\/([\w-]+)\/(\w+)\/edit/)) {
		
			settingspage();
			
			//Statement Page
		}else if (location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/statement/) || location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/user\/(.*)\/statement/)) {
		
			enque('statementer');
			
			//Forums Page
		}else if (location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/forums\//)) {
	
			enque('envatitor');
			enque('replypantry');
			//Upload Page
		}else if (location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/upload\//)) {
	
			enque('envatitor');
			
			//item edit page
		}else if (location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/item\/([a-z0-9-]+)\/edit/)) {
	
			enque('envatitor');
			
			//item discussion page
		}else if (location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/item\/([a-z0-9-]+)\/discussion/)) {
	
			enque('envatitor');
			enque('replypantry');
			
			//item discussion page
		}else if (location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/item\/([a-z0-9-]+)\/([0-9]+)\/comments/)) {
	
			enque('envatitor');
			enque('replypantry');
			
			//item faq page
		}else if (location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/item\/([a-z0-9-]+)\/([0-9]+)\/faqs/)) {
	
			enque('envatitor');
			
			//item discussion page
		}
		
		if (location.href.match(/^http:\/\/(themeforest|codecanyon|activeden)\.net/)) {
	
			enque('gotolivepreview');
			
		}
		
		if (location.href.match(/^http:\/\/([\.a-z3]+)\.(net)\/item\/([a-z0-9-]+)/)) {
	
			//enque('editinline');
			
		}
		//everywhere;
		enque('notification');
		enque('quickcollection');
		enque('chaching');
		enque('salesrefresher');
		enque('reminder');
		
		enque('_localdevelopment');
		
		
		load(function(){
			console.log('Thanks for using Dashboard Plus!');
		});
	
	
		function enque(plugin){
			
			if(!plugin || !active_plugins[plugin] || !plugins[plugin]) return false;
			
			loadit.push(plugin);
			if(plugins[plugin].font || plugin == '_localdevelopment'){
				fontawesome.appendTo('head');
			}
			
			delete active_plugins[plugin];
			
		}
		
		function load(callback){
		
			if(!loadit.length) return false;
			
			loadit.sort();
			var url = window.dashboardplus['base']+'plugins/';

            var script_count = 0;
			for(var item in loadit){
                script_count++;
				console.log(plugins[loadit[item]].name+' loaded!');
                var plugin_url = url + loadit[item] + '.js?v=' + version;

                console.log("Loading script: "+script_count + " url: " + plugin_url);
                $.ajax({
                    url: plugin_url,
                    dataType: "script",
                    success: function(){
                        script_count--;
                        console.log("Left to load: "+script_count);
                        if(script_count<=0){
                            // we've loaded all scripts completely... run our callback
                            callback();
                        }
                    },
                    cache: true
                });
			}

			
		}
		
		
		function settingspage(){
		
			var active = (location.hash == '#dashboard_plus') ? ' active' : '';
			
			$content.find('.side-tabs').append('<li><a id="dashboard_plus_link" href="#dashboard_plus" class="'+active+' glyph-plus">Dashboard Plus</a></li><style>.side-tabs a#dashboard_plus_link:before{background-position:-240px -168px;}.side-tabs a#dashboard_plus_link.active:before{background-position:13px -232px;}</style>');
			
			var boxhtml = '<div id="dashboard_plus_tab" class="tab-content'+active+'" style="display:block"><h2 class="underlined">Dashboard Plus</h2><p>Select all features you would like to activate. Please check out the <a href="/forums/thread/introducing-dashboard-plus/71870">forum thread</a> if you have questions</p><p></p><h3 class="underlined">Available Plugins</h3><form id="dashboardplus_form" class="horizontal-form"><fieldset>';
	
			$.each(plugins, function(id, data){
			
			if(!(typeof data.beta != 'undefined' && !(username == 'revaxarts'))){
				
				boxhtml += '<div class="input-group"><label for="dbp_'+id+'">'+data.name+'</label><div class="inputs"><label for="dbp_'+id+'">  <input id="dbp_'+id+'" name="active[]" class="dbp_plugins" type="checkbox" value="'+id+'" '+(active_plugins[id] ? ' checked' : '')+'> '+data.desc+'</label>';
				
				if(data.settings){
					$.each(data.settings, function (i, setting){
						if(!setting.type) setting.type = 'textfield';
						if(!setting.placeholder) setting.placeholder = '';
						
						boxhtml += '<div style="padding-left:20px">';
							switch(setting.type){
								case 'checkbox':
									boxhtml += '<label><input class="dbp_setting" type="checkbox" '+(window.dashboardplus.get(id, setting.id) ? ' checked' : '')+' data-id="'+id+'" data-name="'+setting.id+'"> '+setting.label+'</label>';
									break;
								case 'textfield':
								default:
									boxhtml += ''+setting.label+' <input class="dbp_setting" placeholder="'+(setting.placeholder)+'" type="text" value="'+(window.dashboardplus.get(id, setting.id))+'" style="width:100%" data-id="'+id+'" data-name="'+setting.id+'">';
									break;
									
							}
						boxhtml += '</div>';
						
					});
				}
				
				boxhtml += '</div> </div>';
			}
	 
			});
			
			boxhtml += '</fieldset><div class="form-submit"><a id="dbp_reset_button" href="#dashboard_plus">Reset all settings</a> or <button id="dbp_submit_button" class="btn-icon save" type="submit">Save</button></div></form><a style="font-size:10px" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&amp;business=U4V8TKF6WNYZ2&amp;lc=AT&amp;item_name=revaxarts%20Statementer&amp;currency_code=USD&amp;bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted" title="for those who are too enthusiastic about">buy me a beer</a></div>';
			
					
			$('#dashboard_plus_link').click(function(){
			
				$content.find('.content-s').html(boxhtml);
				
				$content.find('.sidebar-l').find('a').removeClass('active');
				
				$(this).addClass('active');
	
				$('#dashboardplus_form').on('submit', function(){
					
					var data = {};
					var setting = {};
					$.each($('.dbp_plugins'), function(){
						
						if($(this).is(':checked')) data[$(this).val()] = true;
						
					});
					$.each($('.dbp_setting'), function(){
						var id = $(this).data('id');
						if(!setting[id]) setting[id] = {};
						
						setting[id][$(this).data('name')] = ($(this).is(':checkbox') ? $(this).is(':checked') : $(this).val());
						
					});
					
					$.each(setting, function(extension, data){
						savesettings(extension, data);
					});
					
					if(save('active', data)) location.reload();
					
					return false;
					
				});
				
				$('#dbp_reset_button').on('click', function(){
					if(confirm('Do you really like ti reset all Dashboard Plus settings?\n\n This is only for the current marketplace!')){
						var storage = ['apikey', 'chaching', 'dashboardplus', 'quickcollection', 'ratings__', 'reminder', 'salesrefresher', 'statementer'];
						var cookies = ['envatitor_badges', 'envatitor_thumb', 'notification_count', 'notification_lastcheck', 'quickcollection_lastcheck', 'statementer_lastbalance'];
						
						$.each(storage, function(i,e){
							console.log(e, i);
							localStorage.removeItem(e);
						});
						$.each(cookies, function(i,e){
							console.log(e, i);
							window.dashboardplus.deleteCookie(e);
						});
						
						location.reload();
						
					}
					return false;
				});
				
				
			});
			
			if(active == ' active') $('#dashboard_plus_link').trigger('click');
			
			
		}
		
		function savesettings(extension, data){
			$.each(data, function(name, value){
				window.dashboardplus.set(extension, name, value);
			});
		}
		
		
		function save(setting, value){
			var settings = window.dashboardplus.storage || {};
			
			settings[setting] = value;
			
			localStorage.setItem('dashboardplus', JSON.stringify(settings));
			
			window.dashboardplus.storage = settings;
			
			return window.dashboardplus.storage[setting] == value;
			
		}
		
		function get(setting, fallback){
			return window.dashboardplus.storage[setting] ? window.dashboardplus.storage[setting] : fallback;
		}
		
	}

})();
