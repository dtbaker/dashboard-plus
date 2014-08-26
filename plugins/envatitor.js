/*
 * Copyright (c) 2014 
 * ==================================
 * powered by revaxarts.com (http://revaxarts.com)
 * original filename: envatitor.js
 * filesize: 14935 Bytes
 * last modified: Mon, 17 Feb 2014 09:54:26 +0100
 *
 */
(function () {

	var textarea,
		username = $('#user_username').text(),
		$preview, interval, livepreview = (window.dashboardplus.getCookie('envatitor_livepreview') == 'false') ? false : true,
		smileys = {
			'happy': ':)',
			'sad': ':(',
			'tongue': ':P',
			'wink': ';)',
			'angry': ':x',
			'expressionless': ':|',
			'laugh': ':D',
			'puzzled': ':S',
			'cool': '8-)',
			'surprised': ':O',
			'asleep': ':asleep:',
			'bashful': ':bashful:',
			'bashfulcute': ':bashfulcute:',
			'bigevilgrin': ':bigevilgrin:',
			'bigsmile': ':bigsmile:',
			'bigwink': ':bigwink:',
			'chuckle': ':chuckle:',
			'crying': ':crying:',
			'confused': ':confused:',
			'confusedsad': ':confusedsad:',
			'dead': ':dead:',
			'delicious': ':delicious:',
			'depressed': ':depressed:',
			'evil': ':evil:',
			'evilgrin': ':evilgrin:',
			'grin': ':grin:',
			'impatient': ':impatient:',
			'inlove': ':inlove:',
			'kiss': ':kiss:',
			'mad': ':mad:',
			'nerdy': ':nerdy:',
			'notfunny': ':notfunny:',
			'ohrly': ':ohrly:',
			'reallyevil': ':reallyevil:',
			'sarcasm': ':sarcasm:',
			'shocked': ':shocked:',
			'sick': ':sick:',
			'silly': ':silly:',
			'sing': ':sing:',
			'smitten': ':smitten:',
			'smug': ':smug:',
			'stress': ':stress:',
			'sunglasses': ':sunglasses:',
			'sunglasses2': ':sunglasses2:',
			'superbashfulcute': ':superbashfulcute:',
			'tired': ':tired:',
			'whistle': ':whistle:',
			'winktongue': ':winktongue:',
			'yawn': ':yawn:',
			'zipped': ':zipped:'
		},
		type;

	init();


	function init() {
		type = getType();
		
		var dofocus = false;
		
		var style = $('<style>.envatitor_embeded_bar a{font-size:90%;color:#444;display:inline-block;width:20px;height:20px;margin-right:3px;margin-bottom:2px;text-align:center;line-height:20px;border-radius:4px;padding:1px;}.envatitor_embeded_bar a:hover{text-decoration:none;color:#fff;background:#444;}ul.envatitor_embeded_dropdown{border:1px solid #BBBBBB;width:180px;display:none;overflow:hidden;position:absolute;left:230px;background-color:#fff;box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);list-style:none;padding-left:0;}ul.envatitor_embeded_uploadform{left:130px;padding:5px;width:300px}ul.envatitor_embeded_uploadform input[type=text]{width:100%!important;}#envatitor_upload_frame{display:none;}#envatitor_upload_loading{float:right;margin-right:10px;display:none;}</style>');
		style.appendTo('head');
		
		if (type) {
			switch (type) {
			case 'newThread':
				textarea = $('#thread_message_content');
				dofocus = true;
				break;
			case 'postReply':
				textarea = $('textarea[name=content]');
				dofocus = true;
				break;
			case 'comment':
				textarea = $('textarea#reply_text');
				dofocus = true;
				break;
			case 'item':
				textarea = $('textarea#description');
				break;
			case 'itemcomment':
				textarea = $('textarea#item_comment_content');
				break;
			case 'faq':
				textarea = $('textarea#item_faq_answer');
				break;
			default:
				return false;
			}

			//$(window).on('load', function(){
				UI();
				preview();
			//});
			
			$('body')
			.on('click', '.js-comment-new-reply-field', function(){
				textarea = $(this);
				UI();
				textarea.focus();
						
			})
			.on('focus', 'textarea.has-envatitor', function(){
				$('.envatitor_embeded_dropdown').slideUp(200);
				$(document).bind('keyup', updatePreview);
			})
			.on('blur', 'textarea.has-envatitor', function(){
				$(document).unbind('keyup', updatePreview);
			})
			.on('keydown', 'textarea.has-envatitor', function(e){
				if (e.which == 13 && e.shiftKey) {
					insert('', '<br />\n', []);
					return false;
				}
			})
			.on('click', '.envatitor_embeded_bar > a', function () {
				var button_id = $(this).data("id");
				var start = '<' + button_id + '>';
				var end = '</' + button_id + '>';
				var replaceArray = [];

				var param = "";
				if (button_id == 'a') {
					param = prompt("Enter URL", "http://");
					if (param) {
						start = '<a href="' + param + '">';
					} else {
						return false;
					}
				} else if (button_id == 'smiley') {
					$('.envatitor_embeded_smileys').show();
					$('.envatitor_embeded_uploadform').hide();
					return false;
				} else if (button_id == 'img') {
					$('.envatitor_embeded_uploadform').show();
					$('.envatitor_embeded_smileys').hide();
					$('#envatitor_image_url').focus();
					return false;
				}
				insert(start, end, replaceArray);
				return false;
			})
			.on('click', '.envatitor_embeded_smileys img', function () {
				var code = $(this).attr('alt');
				insert(code, '', []);
				$('.envatitor_embeded_dropdown').hide();
				updatePreview();
			})
			.on('click', '#envatitor_embeded_livepreview', function () {
				livepreview = !livepreview;
				$(this).html('livepreview is ' + (livepreview ? 'ON' : 'OFF'));
				window.dashboardplus.setCookie('envatitor_livepreview', livepreview);
				updatePreview();
				return false;
			});
			

			if(textarea){
				if(dofocus) textarea.focus(); 
			}

			if (type == 'newThread') {
				$('#thread_subject').on('keyup', function () {
					var val = $(this).val();
					if (val != '') {
						$('h1').first().text($(this).val());
					} else {
						$('h1').first().text('Start new thread');
					}
				}).trigger('keyup');
			}

			updatePreview();

		}

	}

	function insert(start, end, replaceArray) {
		element = textarea[0];
		if (document.selection) {
			element.focus();
			sel = document.selection.createRange();
			newT = sel.text;
			if (start == '<ul>' || start == '<ol>') {
				newT = $.trim(newT);
				start = start + '\n<li>';
				newT = newT.replace(/\n|\c/g, '</li>\n<li>');
				end = '</li>\n' + end;
			}
			sel.text = start + newT + end;
		} else if (element.selectionStart || element.selectionStart == '0') {
			element.focus();
			var startPos = element.selectionStart;
			var endPos = element.selectionEnd;
			newT = element.value.substring(startPos, endPos);
			if (start == '<ul>' || start == '<ol>') {
				newT = $.trim(newT);
				start = start + '\n<li>';
				newT = newT.replace(/\r/g, '').replace(/\n|\c/g, '</li>\n<li>');
				end = '</li>\n' + end;
			}
			element.value = element.value.substring(0, startPos) + start + newT + end + element.value.substring(endPos, element.value.length);
		} else {
			element.value += start + end;
		}
		updatePreview();
	}

	function UI() {
		if(textarea.is('.has-envatitor')) return;
		
		window.dashboardplus.envatitor_upload_form_changed = function (){};
		
		var id = +new Date();
		
		var html = '<div class="envatitor_embeded_bar" style="position:relative">';
		html += '<a href="#" data-id="h2" title="Heading 2" class="">H2</a>';
		html += '<a href="#" data-id="h3" title="Heading 3" class="">H3</a>';
		html += '<a href="#" data-id="h4" title="Heading 4" class="">H4</a>';
		html += '<a href="#" data-id="h5" title="Heading 5" class="">H5</a>';
		html += '<a href="#" data-id="strong" title="Bold" class="fa fa-bold"></a>';
		html += '<a href="#" data-id="em" title="Italic" class="fa fa-italic"></a>';
		html += '<a href="#" data-id="del" title="Strike" class="fa fa-strikethrough"></a>';
		html += '<a href="#" data-id="ins" title="Underline" class="fa fa-underline"></a>';
		html += '<a href="#" data-id="code" title="Codeline (<code>)" class="fa fa-code"></a>';
		html += '<a href="#" data-id="pre" title="Codeblock (<pre>)" class="fa fa-list-alt"></a>';
		html += '<a href="#" data-id="ol" title="Ordered List" class="fa fa-list-ol"></a>';
		html += '<a href="#" data-id="ul" title="Unordered List" class="fa fa-list-ul"></a>';
		html += '<a href="#" data-id="a" title="Insert Link" class="fa fa-link"></a>';
		html += '<a href="#" data-id="blockquote" title="Quotation" class="fa fa-quote-right"></a>';
		html += '<a href="#" data-id="img" title="Insert Image" class="fa fa-picture-o"></a>';
		html += '<a href="#" data-id="smiley" title="Insert Smiley" class="fa fa-smile-o"></a>';
		html += '<ul class="envatitor_embeded_uploadform envatitor_embeded_dropdown">';
		html += '<li><div><label>Insert link<br><input type="text" id="envatitor_image_url" value="" width="100%"></label><button id="envatior_insert_link" class="btn-icon post-reply">insert</button><iframe id="envatitor_upload_frame" name="envatitor_upload_frame" onLoad="dashboardplus.envatitor_upload_form_changed();" src=""></iframe><br><form action="' + window.dashboardplus.base + '/upload/index.php" enctype="multipart/form-data" method="post" target="envatitor_upload_frame" id="envatitor_upload_form"><input type="hidden" name="id" value="'+ id +'"><label>or upload file:<br><input type="file" name="envatitor" id="envatitor_upload_file"></label><input class="submit btn-icon post-reply" type="submit" value="upload" style="min-width:80px"> <span id="envatitor_upload_loading">uploading file</span></form></div></li>';
		html += '</ul>';
		html += '<ul class="envatitor_embeded_smileys envatitor_embeded_dropdown">';
		$.each(smileys, function (i, k) {
			html += '<li style="float:left;padding:2px;cursor:pointer;list-style:none;"><img title="' + i + '" src="/images/smileys/' + i + '.png" alt="' + k + '" style="padding:0;"/></li>';
		});
		html += '</ul>';
		html += '</div>';
		textarea.addClass('has-envatitor').wrap('<div class="envatitor_embeded_bar_wrap"></div>');
		textarea.parent().prepend(html);
		
		$('#envatitor_upload_form').find('input.submit').on('click', function(){
			$('#envatitor_upload_loading').show();
			window.dashboardplus.envatitor_upload_form_changed = function (){
				$.getScript(window.dashboardplus.base +'/upload/get/' + id +'.js', function(){
					insert('!' + window.envatitor_upload_form_link + '! ', '', []);
					$('#envatitor_upload_loading').hide();
				});
			}
		});
		
		$('#envatior_insert_link').on('click', function(){
			insert('!' +$('#envatitor_image_url').val() + '! ', '', []);
			$(this).val('');
			return false;
		});

	}

	function preview() {
		var thumb = window.dashboardplus.getCookie('envatitor_thumb') || 'http://0.envato-static.com/images/common/icons-buttons/default-user.jpg';
		var badges = window.dashboardplus.getCookie('envatitor_badges');


		var html = '<div class="user-post"><div class="user-post__poster"><div class="post-avatar"><div class="post-avatar__image"><div class="avatar-wrapper tooltip--advanced" id="envatitor_embeded_thumb"><a href="/user/' + username + '" class="avatar" title="' + username + '"> <img alt="' + username + '" class="" height="80" src="' + thumb + '" width="80"></a><div class="tooltip--advanced__content"><div><strong>' + username + '</strong><a href="/forums/messages/recent_for_user/' + username + '">Recent Posts</a><br><a href="/forums/threads/recent_for_user/' + username + '">Threads Started</a><br></div></div></div></div><small class="post-avatar__count">posts</small><div class="post-avatar__badges"><ul class="badges" id="envatitor_embeded_badges">' + badgesHTML(badges) + '</ul></div></div></div><div class="user-post__post"><div class="user-post__edit-container"><div class="user-post-header"><a href="/user/' + username + '">' + username + '</a><strong class="user-post-indicator--moderator">livepreview</strong> <small>says</small></div>';
		var preview = '<div class="user-html" id="envatitor_embeded_preview"></div>';
		var ahtml = '<div class="user-post-footer"><a id="envatitor_embeded_livepreview" href="#">livepreview is ' + (livepreview ? 'ON' : 'OFF') + '</a> | <a href="http://userscripts.org/scripts/show/111044">The Envatitor Embedded</a></div><div class="insert-partial-container"></div></div></div></div>';

		switch (type) {
		case 'newThread':
			$('.content-l').eq(0).prepend(html + preview + ahtml);
			break;
		case 'postReply':
			if($('.post').length == 10) $('<span style="font-size:12px;color:red;padding-left:12px;"> This reply will appear on the following page</span>').appendTo('#post_reply > h2');
			$('.forums').eq(0).append(html + preview + ahtml);
			break;
		case 'comment':
			return false;
		case 'itemcomment':
			return false;
		case 'item':
			textarea.on('focus', function(){
				$(this).height(400);
			});
			return false;
		default:
			return false;
		}
		$preview = $('#envatitor_embeded_preview');
		if (!window.dashboardplus.getCookie('envatitor_thumb')) {
			$('#envatitor_embeded_thumb').load('/user/' + username + '/profile .avatar img:first', function (data) {
				thumb = $('#envatitor_embeded_thumb').find('img').attr('src');
				window.dashboardplus.setCookie('envatitor_thumb', thumb, 7);
				$('#envatitor_embeded_thumb').find('img').attr('src', thumb);
			});
		}

		if (!window.dashboardplus.getCookie('envatitor_badges')) {
			$('#envatitor_embeded_badges').load('/user/' + username + '/profile .badges:first', function (data) {
				badges = [];
				$('#envatitor_embeded_badges').find('li').each(function () {
					badges.push($(this).attr('class'));
				});
				window.dashboardplus.setCookie('envatitor_badges', badges.join('|'), 7);
			});
		}
	}

	function badgesHTML(badges) {
		if (!badges) return '';
		html = '';
		badges = badges.split('|');
		$.each(badges, function (i, e) {
			if(i >= 9) return;
			html += '<li class="' + e + '">' + e + '</li>';
		});
		html += '';
		return html;
	}

	function updatePreview() {
		clearInterval(interval);
		if (!livepreview || typeof $preview == 'undefined') return;
		interval = setTimeout(function () {
			var output = textarea.val();
			$.each(smileys, function (i, k) {
				var regex = new RegExp(k.replace('(', '\\(').replace(')', '\\)').replace('|', '\\|'), 'g');
				output = output.replace(regex, '<img src="/images/smileys/' + i + '.png">');
			});
			output = "\n" + output + "\n\n";
			output = output.replace(/([^\n])\n([^\n])/g, '$1&#10687;$2');
			output = output.replace(/\n\n/g, '\n\n\n');
			output = output.replace(/\n(.*)\n\n/g, '<p>$1</p>');
			output = output.replace(/<blockquote>\|\|\+([0-9]+)\|([a-zA-Z0-9_]+) said-\|\|/g, '<blockquote><a class="byline" href="/forums/message/go_to/$1">$2 said</a><br/>');
			output = output.replace(/(\W)?\*([^*]+)\*(\W)/g, '$1<strong>$2</strong>$3');
			output = output.replace(/(\W)?_([^_]+)_(\W)/g, '$1<em>$2</em>$3');
			output = output.replace(/(\W)?-([^-]+)-(\W)/g, '$1<del>$2</del>$3');
			output = output.replace(/(\W)?!http([^! ]+)!(\W)/g, '$1<img src="http$2" />$3');
			output = output.replace(/\n<\/pre>/g, '&#10687;&#10687;</pre>');
			output = output.replace(/&#10687;/g, '\n');
			$preview.html(output);
		}, 200);
	}

	function getType() {
		if ($('#thread_message_content').length) {
			return 'newThread';
		} else if ($('#thread_reply_content').length) {
			return 'postReply';
		} else if ($('textarea#reply_text').length) {
			return 'comment';
		} else if ($('textarea#item_comment_content').length) {
			return 'itemcomment';
		} else if ($('.js-comment-new-reply-field').length) {
			return 'itemcomment';
		} else if ($('textarea#item_faq_answer').length) {
			return 'faq';
		} else if ($('textarea#description').length) {
			return 'item';
		}
		return false;
	}
	


})();
