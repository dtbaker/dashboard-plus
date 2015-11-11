(function () {


	var options = Chart.instances['chart-0'].options;
	
	var path,type,year,month,day,dropdown,
		chart = Chart.instances['chart-0'].chart,
		nativedata,
		externalAjax = true;

	$( document ).ajaxSuccess(function(response) {
		if(externalAjax) init();
	});

	$( window ).on('hashchange', function() {
		update();
	});

	init();
	update();

	function init(){

		path = location.pathname.replace(/\/user\/(.*)\/earnings\//, '').split('/');
		type = path[0];
		year = path[1] ? parseInt(path[1], 10) : null;
		month = path[2] ? parseInt(path[2], 10) : null;
		day = path[3] ? parseInt(path[3], 10) : null;
		nativedata = $.parseJSON($('#graphdata').html());

		if(dropdown) dropdown.remove();
		dropdown = '<select><option value="-1">Compare with...</option>';
		compares = {};

		if(year) compares['last year'] = (year ? (year-1)+(month ? '/'+month+(day ? '/'+day : '') : '') : '');
		if(month) compares['last month'] = (year ? year+(month ? '/'+(month-1)+(day ? '/'+day : '') : '') : '');
		if(day) compares['last day'] = (year ? year+(month ? '/'+month+(day ? '/'+(day-1) : '') : '') : '');


		$.each(compares, function(name, value){
			dropdown += '<option value="'+value+'" '+(location.hash.substring(2) == value ? 'selected' : '')+'>'+name+' ('+value+')</option>';
		});

		dropdown += '</select>';
		dropdown = $(dropdown);

		$('.earning__breadcrumb').append(dropdown);

		dropdown.on('change', function(){
			location.hash = '/'+$(this).val();
		});


	}

	function update(){
		var _path = location.hash.substring(1).split('/');
		var _year = _path[1] && year ? parseInt(_path[1], 10) : null;
		var _month = _path[2] && month ? parseInt(_path[2], 10) : null;
		var _day = _path[3] && day ? parseInt(_path[3], 10) : null;
		
		if(!_year) return;

		externalAjax = false;
		get_data(_year, _month, _day, function(data){
			externalAjax = true;
			data.datasets[0].fillColor = "rgba(151,187,205,0.2)";
			data.datasets[0].strokeColor = "rgba(151,187,205,0.4)";
			data.datasets[0].pointColor = "rgba(151,187,205,0.4)";
			data.datasets[0].pointStrokeColor = "#fff";
			data.datasets[0].pointHighlightFill = "#fff";
			data.datasets[0].pointHighlightStroke = "rgba(151,187,205,0.5)";

			nativedata.datasets[1] = data.datasets[0];
			chart.Line(nativedata, options);

		});
	}

	function get_data(year, month, day, callback){
		var time = (year ? '/'+year+(month ? '/'+month+(day ? '/'+day : '') : '') : '');
		var url = location.pathname.replace(/\/earnings\/(.*)$/, '')+'/earnings/'+type+time+'?_pjax=.js-pjax-container';
		$.ajax({
			url: url,
			headers: { 'X-PJAX': true, 'X-PJAX-Container': '.js-pjax-container' },
			success: function(response){
				var data = $.parseJSON($('<div>').html(response).find('#graphdata').html());
				callback && callback(data);
			}

		});
	}



})();
