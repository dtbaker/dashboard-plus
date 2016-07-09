/*
 * Copyright (c) 2014 
 * ==================================
 * powered by revaxarts.com (http://revaxarts.com)
 * original filename: verify.js
 * filesize: 2438 Bytes
 * last modified: Mon, 10 Feb 2014 15:46:11 +0100
 *
 */
(function () {
	
	var apikey = localStorage.apikey || false;
	var username = $.trim($('#user_username').text());
	var domain = location.protocol+'//'+location.hostname;
		
	if(!apikey){
	
		var url = domain+'/user/'+username+'/api_keys/edit';
		
		$.get(url, function(response){
			var r = response.match(/>([a-z0-9]{32})</g);
			if(!r.length){
				alert('Please create an API Key on your settings page to enable Purchasecode verification!');
				return;
			}
			apikey = r[0].substr(1, r[0].lastIndexOf('<')-1);
			localStorage.setItem('apikey', apikey);
			init();
		});
		
	}else{
		init();
	}
	
	function init(){
	
		var html = '<div class="box--topbar"><h2>Verify Purchasecode</h2></div><div class="box--hard-top new-typography"><input type="text" id="dpb_verify_purchase" style="width:100%" placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" maxlength="37"><div style="font-size:11px;color:#aaa;">paste your buyers purchasecode to verify</div><p id="dpb_verify_purchase_result"></p></div>',
			target = $('.sidebar-right').find('.box--topbar').eq(3);
		
		$(html).insertBefore(target);
		
		$('#dpb_verify_purchase').on('paste change', function(){
			var _this = $(this);
			
			setTimeout(function(){
				verify(_this.val());
			}, 1);
		}).on('click', function(){
			$(this).focus().select();
		});
		
	}
	
	function verify(code){
		
		if(!code) return false;
		
		if(!/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/.test(code)){
			$('#dpb_verify_purchase_result').html('<strong>invalid purchasecode!</strong>'); 
			return false;
		}
		
		var url = 'https://marketplace.envato.com/api/edge/'+username+'/'+apikey+'/verify-purchase:'+code+'.json';
		
		$.get(url, function(response){
		
			var html = '';
			
			if(response['verify-purchase'].created_at){
				var p = response['verify-purchase'];
				var d = new Date(p.created_at); 
				html += '<a href="'+domain+'/user/'+p.buyer+'"><strong>'+p.buyer+'</strong></a> purchased a <strong>'+p.licence+'</strong> of <a href="'+domain+'/item/goto/'+p.item_id+'" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;width:90%;display:block;" title="'+p.item_name+'"><strong>'+p.item_name+'</strong></a>on <strong title="'+p.created_at+'">'+d.toLocaleString()+'</strong>';
				$('#dpb_verify_purchase_result').html(html);
				
			}else{
				$('#dpb_verify_purchase_result').html('<strong>invalid purchasecode!</strong>');
			}
			
		}, "JSON");
	}
	
			
})();