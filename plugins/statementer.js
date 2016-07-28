(function () {

	//"use strict"

			if (/page=/.test(location.search)) {
				$('<div id="statementer" style="padding-bottom:20px"><span style="font-style:italic;">Statementer is disbaled if you use pagination. <a href="' + location.href.replace(/page=(\d+)/, '') + '">go back</span></div>').insertBefore('.statement-search');
				return;
			}

			var version = '2.4.1',
				exchangeinterval = 3600,
				rates = {},
				currentcurrency = 'USD',
				currencies = {"AUD": "Australian Dollar","AED": "United Arab Emirates Dirham","AFN": "Afghan Afghani","ALL": "Albanian Lek","AMD": "Armenian Dram","ANG": "Netherlands Antillean Guilder","AOA": "Angolan Kwanza","ARS": "Argentine Peso","AWG": "Aruban Florin","AZN": "Azerbaijani Manat","BAM": "Bosnia-Herzegovina Convertible Mark","BBD": "Barbadian Dollar","BDT": "Bangladeshi Taka","BGN": "Bulgarian Lev","BHD": "Bahraini Dinar","BIF": "Burundian Franc","BMD": "Bermudan Dollar","BND": "Brunei Dollar","BOB": "Bolivian Boliviano","BRL": "Brazilian Real","BSD": "Bahamian Dollar","BTN": "Bhutanese Ngultrum","BWP": "Botswanan Pula","BYR": "Belarusian Ruble","BZD": "Belize Dollar","CAD": "Canadian Dollar","CDF": "Congolese Franc","CHF": "Swiss Franc","CLF": "Chilean Unit of Account (UF)","CLP": "Chilean Peso","CNY": "Chinese Yuan","COP": "Colombian Peso","CRC": "Costa Rican Colon","CUP": "Cuban Peso","CVE": "Cape Verdean Escudo","CZK": "Czech Republic Koruna","DJF": "Djiboutian Franc","DKK": "Danish Krone","DOP": "Dominican Peso","DZD": "Algerian Dinar","EGP": "Egyptian Pound","EUR": "Euro","ETB": "Ethiopian Birr","FJD": "Fijian Dollar","FKP": "Falkland Islands Pound","GBP": "British Pound Sterling","GEL": "Georgian Lari","GHS": "Ghanaian Cedi","GIP": "Gibraltar Pound","GMD": "Gambian Dalasi","GNF": "Guinean Franc","GTQ": "Guatemalan Quetzal","GYD": "Guyanaese Dollar","HKD": "Hong Kong Dollar","HNL": "Honduran Lempira","HRK": "Croatian Kuna","HTG": "Haitian Gourde","HUF": "Hungarian Forint","IDR": "Indonesian Rupiah","IEP": "Irish Pound","ILS": "Israeli New Sheqel","INR": "Indian Rupee","IQD": "Iraqi Dinar","IRR": "Iranian Rial","ISK": "Icelandic Krona","JMD": "Jamaican Dollar","JOD": "Jordanian Dinar","JPY": "Japanese Yen","KES": "Kenyan Shilling","KGS": "Kyrgystani Som","KHR": "Cambodian Riel","KMF": "Comorian Franc","KPW": "North Korean Won","KRW": "South Korean Won","KWD": "Kuwaiti Dinar","KZT": "Kazakhstani Tenge","LAK": "Laotian Kip","LBP": "Lebanese Pound","LKR": "Sri Lankan Rupee","LRD": "Liberian Dollar","LSL": "Lesotho Loti","LTL": "Lithuanian Litas","LVL": "Latvian Lats","LYD": "Libyan Dinar","MAD": "Moroccan Dirham","MDL": "Moldovan Leu","MGA": "Malagasy Ariary","MKD": "Macedonian Denar","MMK": "Myanma Kyat","MNT": "Mongolian Tugrik","MOP": "Macanese Pataca","MRO": "Mauritanian Ouguiya","MUR": "Mauritian Rupee","MVR": "Maldivian Rufiyaa","MWK": "Malawian Kwacha","MXN": "Mexican Peso","MYR": "Malaysian Ringgit","MZN": "Mozambican Metical","NAD": "Namibian Dollar","NGN": "Nigerian Naira","NIO": "Nicaraguan Cordoba","NOK": "Norwegian Krone","NPR": "Nepalese Rupee","NZD": "New Zealand Dollar","OMR": "Omani Rial","PAB": "Panamanian Balboa","PEN": "Peruvian Nuevo Sol","PGK": "Papua New Guinean Kina","PHP": "Philippine Peso","PKR": "Pakistani Rupee","PLN": "Polish Zloty","PYG": "Paraguayan Guarani","QAR": "Qatari Rial","RON": "Romanian Leu","RSD": "Serbian Dinar","RUB": "Russian Ruble","RWF": "Rwandan Franc","SAR": "Saudi Riyal","SBD": "Solomon Islands Dollar","SCR": "Seychellois Rupee","SDG": "Sudanese Pound","SEK": "Swedish Krona","SGD": "Singapore Dollar","SHP": "Saint Helena Pound","SLL": "Sierra Leonean Leone","SOS": "Somali Shilling","SRD": "Surinamese Dollar","STD": "Sao Tome and Principe Dobra","SVC": "Salvadoran Colon","SYP": "Syrian Pound","SZL": "Swazi Lilangeni","THB": "Thai Baht","TJS": "Tajikistani Somoni","TMT": "Turkmenistani Manat","TND": "Tunisian Dinar","TOP": "Tongan Pa'anga","TRY": "Turkish Lira","TTD": "Trinidad and Tobago Dollar","TWD": "New Taiwan Dollar","TZS": "Tanzanian Shilling","UAH": "Ukrainian Hryvnia","UGX": "Ugandan Shilling","USD": "United States Dollar","UYU": "Uruguayan Peso","UZS": "Uzbekistan Som","VEF": "Venezuelan Bolivar","VND": "Vietnamese Dong","VUV": "Vanuatu Vatu","WST": "Samoan Tala","XAF": "CFA Franc BEAC","XCD": "East Caribbean Dollar","XDR": "Special Drawing Rights","XOF": "CFA Franc BCEAO","XPF": "CFP Franc","YER": "Yemeni Rial","ZAR": "South African Rand","ZMK": "Zambian Kwacha","ZWD": "Zimbabwean Dollar (1980-2008)","ZWL": "Zimbabwean Dollar"
				};

			var $content = $('<div id="statementer"></div>', {
				id: 'statementer'
			}).insertAfter('.statement-search');
			var raw, sales = {},
				reversals = [],
				referrals = [],
				purchases = [],
				deposits = [],
				withdrawal = [],
				items = [],
				lastdate, firstdate,

				allitems = 'all items',

				sortby = 'name', sortdir = 'DESC',

				currenttab = 0,
				currentitem = 0,
				tabcount = 0,

				from, to;

			var total_sales = 0,
				total_sales_volume = 0,
				total_referrals = 0,
				total_referrals_money = 0,
				total_deposits = 0,
				total_deposits_money = 0,
				total_purchases = 0,
				total_purchases_money = 0,
				total_withdrawal = 0,
				total_withdrawal_money = 0,
                total_us_tax_count = 0,
                total_us_tax_money = 0,
				total_earning = 0,
				total_reversals_money = 0,
				total_reversals = 0,
				total_extended_support_money = 0,
                total_extended_support = 0;

    var extended_support_sales = [];

    var sales_per_country = {};

			var lastbalance = 0,
				currentbalance = 0;

			var now = new Date(), timestamp = now.getTime(), envatotimeoffsetinhours = 12+now.getTimezoneOffset()/60;
				now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + (now.getTimezoneOffset()+ 60*parseInt(envatotimeoffsetinhours,10)), now.getSeconds());

			var current = location.pathname.match(/(\d\d\d\d)-(\d\d)/),
				monthnames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				currentmonth = current ? parseInt(current[2],10)-1 : now.getMonth(),
				currentyear = current ? parseInt(current[1],10) : now.getFullYear(),
				csvfile = '/statement/'+currentyear+'-'+(currentmonth < 9 ? '0'+(currentmonth+1) : (currentmonth+1))+'.csv?v=v1';

			var color = '0084B4';


			var prepareUI = function () {
					lastbalance = window.dashboardplus.getCookie('statementer_lastbalance');
					currentcurrency = window.dashboardplus.getCookie('statementer_currentcurrency') || 'USD';
					currentbalance = parseInt($('.header-logo-account__balance').html().substr(1).replace(',', '').replace('.', ''), 16);

					$content.html('<span style="font-style:italic">loading Statement... <a href="javascript:window.dashboardplus.set(\'statementer\', {});window.dashboardplus.setCookie(\'statementer_lastbalance\', \'\', -1);location.reload();">Click here if it stucks...</a></span>');
                    $('head').append('<link type="text/css" rel="stylesheet" href="'+window.dashboardplus.base + 'css/statementer.css" />');

					//$('.statement-search__presets_links').css('float','right').insertBefore('.statement-search').find('a').eq(0).remove();
					//$('.statement-search__advanced-form').insertBefore('.statement-search');
					//$('.statement-search__timezone-disclaimer').css({'float':'right', 'margin-right':10}).insertBefore('.statement-search');


					loadStatementer();

				},
				makeUI = function () {

					$('table.general_table').find('td').eq(0).attr('width', 90);

					var html = '';

					html += '<div id="statementer_daterange"><span id="statementer_date_from"></span> - <span id="statementer_date_to"></span></div>';
					html += '<div id="statementer_dateslider"></div>';
					html += '<div id="statementer_content">';
					html += '</div>';

					$content.hide().html(html).show();


					$('#statementer_content').delegate('.statementer_itemlink', 'click', function () {
						window.location = this.href;
						return false;
					});

					html = '<div class="statementer_menu feature-list">';
					var _first = new Date(currentyear, currentmonth, 1, 0, 0, 0),
						_last = new Date(currentyear, currentmonth + 1, 0, 23, 59, 59),
						_firstmonday = (_first.getTime() + ((8 - _first.getDay()) * 864e5));
						//fix if 1st day is sunday
						if(!_first.getDay()) _firstmonday -= 864e5*7;
					html += '<a class="btn btn--set" data-from="' + (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime()) + '" data-to="' + (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime()) + '">Today</a></li>';
					html += '<a class="btn btn--set" data-from="' + (new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0).getTime()) + '" data-to="' + (new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59).getTime()) + '">Yesterday</a></li>';
					html += '</div';
					html += '<div class="statementer_menu feature-list">';
					html += '<a class="btn btn--set" data-offset-from="' + (-1 * 864e5) + '" data-dimension="' + (1 * 864e5 - 1000) + '">- one Day</a></li>';
					html += '<a class="btn btn--set" data-offset-from="' + (1 * 864e5) + '" data-dimension="' + (1 * 864e5 - 1000) + '">+ one Day</a></li>';
					html += '<a class="btn btn--set" data-offset-from="' + (-7 * 864e5) + '" data-dimension="' + (7 * 864e5 - 1000) + '">- one Week</a></li>';
					html += '<a class="btn btn--set" data-offset-from="' + (7 * 864e5) + '" data-dimension="' + (7 * 864e5 - 1000) + '">+ one Week</a></li>';
					html += '</div';
					html += '<div class="statementer_menu feature-list">';
					html += '<a class="btn btn--set" data-from="' + _first.getTime() + '" data-to="' + _last.getTime() + '">Month</a></li>';
					html += '<a class="btn btn--set" data-from="' + _first.getTime() + '" data-to="' + (_firstmonday - 1000) + '">1st week</a></li>';
					if((_firstmonday + (6048e5) - 1000) < _last.getTime()) html += '<a class="btn btn--set" data-from="' + _firstmonday + '" data-to="' + (_firstmonday + (6048e5) - 1000) + '">2nd week</a></li>';
					if((_firstmonday + (6048e5)) < _last.getTime()) html += '<a class="btn btn--set" data-from="' + (_firstmonday + (6048e5)) + '" data-to="' + (_firstmonday + (6048e5 * 2) - 1000) + '">3rd week</a></li>';
					if((_firstmonday + (6048e5 * 2)) < _last.getTime()) html += '<a class="btn btn--set" data-from="' + (_firstmonday + (6048e5 * 2)) + '" data-to="' + (_firstmonday + (6048e5 * 3) - 1000) + '">4th week</a></li>';
					if((_firstmonday + (6048e5 * 3)) < _last.getTime()) html += '<a class="btn btn--set" data-from="' + (_firstmonday + (6048e5 * 3)) + '" data-to="' + (_firstmonday + (6048e5 * 4) - 1000) + '">5th week</a></li>';
					if((_firstmonday + (6048e5 * 4)) < _last.getTime()) html += '<a class="btn btn--set" data-from="' + (_firstmonday + (6048e5 * 4)) + '" data-to="' + (_firstmonday + (6048e5 * 5) - 1000) + '">6th week</a></li>';
					html += '</div';

					$(html).insertAfter('.statement-search');
					$('.statementer_menu').delegate('a', 'click', function () {
						var _this = $(this),
							_from, _to;
						if (_this.attr('data-from')) {
							_from = _this.attr('data-from');
							_to = _this.attr('data-to');
							if(_from > now.getTime()) return false;
						} else {
							var _values = $('#statementer_dateslider').slider('option', 'values');
							_from = _values[0] + parseInt(_this.attr('data-offset-from'), 10);
							_to = _from + parseInt(_this.attr('data-dimension'), 10);
						}
						window.location.hash = '#from=' + _from + '&to=' + _to + '';
						calculate();
					});

					$('#statementer')
					.delegate('area', 'click', function (event) {
						var data = $(this).data();
						if (event.shiftKey) {
							from = Math.min(from, data.from) || data.from;
							to = Math.max(to, data.to) || data.to;
						} else {
							from = data.from;
							to = data.to;
						}
						location.hash = '#from=' + from + '&to=' + to;
						calculate();
						return false;
					})
					.delegate('.percentage', 'click', function(){
						$(this).select();
					})
					.delegate('.percentage', 'change', function(){

						var val = $(this).val(),
							id = $(this).data('id'),
							p = get('percentages');

						if(!id) return;
						if(isNaN(val)) val = 100;
						if(!p) p = {};

						val = Math.max(0, Math.min(100, val));
						$(this).val(val);

						p[id] = val/100;


						save('percentages', p);
						to = null;
						calculate();
						return;
					});


				},
				currency = function () {
					return false;
					var lastcurrencyupdate = window.dashboardplus.getCookie('statementer_lastcurrencyupdate');
						rates = get('statementer_rates');


					if(timestamp - lastcurrencyupdate > exchangeinterval*1000 || !rates){
						$.ajax({
							url: 'https://openexchangerates.org/latest.json',
							dataType: 'jsonp',
							success: function(data){
							rates = data.rates;
							save('statementer_rates', JSON.stringify(rates));
							window.dashboardplus.setCookie('statementer_lastcurrencyupdate', timestamp);
							currencyDropdown(rates);
							},
							error: function(){
								$('#statementer_currency').html('couldn\'t load currencies :(');
							}
						});
					}else{
						currencyDropdown(rates);
					}
				},
				currencyDropdown = function () {
					var html = '<select style="width:180px;">';
					$.each(currencies, function(id, name){
						var selected = (id == currentcurrency) ? 'selected' : '';
						html += '<option value="'+id+'" '+selected+'>'+id+' - '+name+'</option>';
					});
					html += '</select>';
					html += '<span style="font-size:9px;">last update: '+Math.ceil(((timestamp-parseInt(window.dashboardplus.getCookie('statementer_lastcurrencyupdate')))/1000)/60)+' min ago</span>';
					if(rates) html += '<br><span id="statementer_ratio">1 : '+rates[currentcurrency]+'</span>';
					html += '<br><span style="font-size:9px;">source: <a href="http://openexchangerates.org">openexchangerates.org</a></span>';
					$('#statementer_currency').html(html);
				},
				makeContent = function () {

					var lastdateday = new Date(lastdate).getDate()-1;

					var daysrange = ((to || lastdate) - (from || firstdate))/864e5;

					if (
                        raw == '"Date","Order ID","Type","Detail","Item ID","Price","Amount"' ||
                        raw == '"Date","Order ID","Type","Detail","Item ID","Document","Price","EU VAT","US RWT","US BWT","Amount","Site","Other Party Country","Other Party Region","Other Party City","Other Party Zipcode"'
                    ) {
						$('#statementer_content').html('<h2>Sorry, no action this month!</h2>');
						return false;
					}
					var html = '', story = '';
					html += '<div id="statementer_summary">';
					html += '<ul>';
					html += '<li>you\'ve sold<h4>' + number_format(total_sales) + '</h4>' + _n('item', 'items', total_sales) + ' and earned<h4>' + _d(total_earning) + '</h4></li>';
					html += '<li>you\'ve purchased<h4>' + number_format(total_purchases) + '</h4>' + _n('item', 'items', total_purchases) + ' and spent<h4>' + _d(total_purchases_money) + '</h4></li>';
					html += '<li>you\'ve referred<h4>' + number_format(total_referrals) + '</h4>' + _n('user', 'users', total_referrals) + ' and earned<h4>' + _d(total_referrals_money) + '</h4></li>';
					html += '<li>you\'ve withdrawn<h4>' + number_format(total_withdrawal) + '</h4>' + _n('time', 'times', total_withdrawal) + ' with an amount of<h4>' + _d(total_withdrawal_money) + '</h4></li>';
					html += '<li>you\'ve been taxed on<h4>' + number_format(total_us_tax_count) + '</h4>' + _n('sale', 'sales', total_us_tax_count) + ' with an amount of<h4>' + _d(total_us_tax_money) + '</h4></li>';
					html += '</ul>';
					html += '</div>';

					tabcount = 0;


					if (total_sales) {


						html += '<h2 style="padding-bottom:0;">Sales: <span class="sortby">Sort by: <a data-sort="name">Name</a> | <a data-sort="totalsales">Sales</a> | <a data-sort="totalearnings">Earnings</a> | <a data-sort="maxearnings_day">max. Earnings/day</a> | <a data-sort="maxsales_day">max. Sales/day</a> | <a data-sort="id">release date</a></span></h2>';
						html += 'You have sold <strong>' + total_sales + '</strong> ' + _n('item', 'items', total_sales) + ' within <strong>'+Math.ceil(daysrange)+'</strong>  ' + _n('day', 'days', Math.ceil(daysrange)) + '  with a total value of <strong>'+_d(total_earning) +'</strong>. That\'s <strong>'+(total_sales/daysrange).toFixed(2)+'</strong> items and <strong>' + _d(total_earning/daysrange) + '</strong> per day.';
						html += '<div id="accordion">';

						$.each(items, function (i, name) {

							if(sales[name].totalsales <= 0) return;

							var linktext = (name != allitems) ? '<a href="/item/goto/' + sales[name].id + '" title="visit item page" class="statementer_itemlink" onclick="return false;">&rarr;</a> ' : '';
							var icon = (name != allitems) ? '<span class="marketplace-icon marketplace-icon--' + sales[name].site+ '">&nbsp;</span> ' : '';

							html += '<div id="tabh_' + sales[name].id + '" class="accordion-label"> ' + icon + name.replace('_'+sales[name].id, '') + ' ' + linktext + '<span class="right">' + sales[name].totalsales + ' total ' + _n('sale', 'sales', sales[name].totalsales) + ' &ndash; ' + _d(sales[name].totalearnings) + ' ' +(sales[name].percentage < 1 ? ' <span title="you get ' + (sales[name].percentage*100) + '% of this items profit">('+(sales[name].percentage*100)+'%)</span>' : '') + '</span></div>';
							html += '<div style="height:417px;" data-name="' + name + '"></div>';


						});
						html += '</div>';

                        html += '<div id="sales_world_map_holder">';
                        html += '<h2 style="padding-bottom:0;">Sales Map:</h2>';
                        html += '<div id="sales_world_map"></div>';
                        html += '</div>';

					}

					if (total_reversals && reversals.length) {

						var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						var year = "" + reversals[0].date.getFullYear();
						month = month[reversals[0].date.getMonth()];

						year = year.substr(2);

						html += '<h3 style="padding-bottom:0;">Sale Reversals:</h3>';
						html += 'You have <strong>' + total_reversals + '</strong> ' + _n('reversal', 'reversals', total_reversals) + ' within <strong>'+Math.ceil(daysrange)+'</strong> ' + _n('day', 'days', Math.ceil(daysrange)) + ' with a total value of <strong>'+_d(total_reversals_money) +'</strong>. That\'s <strong>'+(total_reversals/daysrange).toFixed(2)+'</strong> items and <strong>'+_d(total_reversals_money/daysrange)+'</strong> per day.';
						html += '<table class="table-general -striped -highlight-row" cellspacing="0" cellpadding="0">';
						html += '<thead><tr>';
						html += '<td width="70">Date</td><td>Detail</td><td width="50">Amount</td><td width="60">Price</td>';
						html += '</tr></thead>';

						$.each(reversals, function (i, data) {
							var url = data.type == 'other_adjustments_earnings' ? '' : '/item/' + urlify(data.name) + '/' + data.id;
							html += '<tr>';
							html += '<td title="' + data.date.toString().substr(0, 21) + '">' + data.date.getDate() + ' ' + month + ' ' + year + '</td><td>';
							html += url ? '<a href=" ' + url + '">' + data.name + '</a>' : data.name;
							html += '</td><td class="number">1</td><td class="number">- ' + _d(data.earnings) + '</td>';
							html += '</tr>';
						});

						html += '<tr>';
						html += '<td colspan="2" class="number strong">Summary:</td><td class="number strong">' + total_reversals + '</td><td class="number strong">- ' + _d(total_reversals_money) + '</th>';
						html += '</tr>';
						html += '</table>';

					}

					if (total_purchases) {

						var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						var year = "" + purchases[0].date.getFullYear();
						month = month[purchases[0].date.getMonth()];

						year = year.substr(2);

						html += '<h3 style="padding-bottom:0;">Purchases:</h3>';
						html += 'You have purchased <strong>' + total_purchases + '</strong> ' + _n('item', 'items', total_purchases) + ' within <strong>'+Math.ceil(daysrange)+'</strong> ' + _n('day', 'days', Math.ceil(daysrange)) + ' with a total value of <strong>'+_d(total_purchases_money) +'</strong>. That\'s <strong>'+(total_purchases/daysrange).toFixed(2)+'</strong> items and <strong>'+_d(total_purchases_money/daysrange)+'</strong> per day.';
						html += '<table class="table-general -striped -highlight-row" cellspacing="0" cellpadding="0">';
						html += '<thead><tr>';
						html += '<td width="70">Date</td><td>Detail</td><td width="50">Amount</td><td width="60">Price</td>';
						html += '</tr></thead>';

						$.each(purchases, function (i, data) {
							html += '<tr>';
							html += '<td title="' + data.date.toString().substr(0, 21) + '">' + data.date.getDate() + ' ' + month + ' ' + year + '</td><td><a href="/item/' + urlify(data.name) + '/' + data.id + '">' + data.name + '</a></td><td class="number">1</td><td class="number">' + _d(data.price) + '</td>';
							html += '</tr>';
						});

						html += '<tr>';
						html += '<td colspan="2" class="number strong">Summary:</td><td class="number strong">' + total_purchases + '</td><td class="number strong">' + _d(total_purchases_money) + '</th>';
						html += '</tr>';
						html += '</table>';

					}

					if (total_extended_support) {

						var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						var year = "" + extended_support_sales[0].date.getFullYear();
						month = month[extended_support_sales[0].date.getMonth()];

						year = year.substr(2);

						html += '<h3 style="padding-bottom:0;">Extended &amp; Renewed Support:</h3>';
						html += 'You have made <strong>' + total_extended_support + '</strong> extended support ' + _n('sale', 'sales', total_extended_support) + ' within <strong>'+Math.ceil(daysrange)+'</strong> ' + _n('day', 'days', Math.ceil(daysrange)) + ' with a total value of <strong>'+_d(total_extended_support_money) +'</strong>. That\'s <strong>'+(total_extended_support/daysrange).toFixed(2)+'</strong> items and <strong>'+_d(total_extended_support_money/daysrange)+'</strong> per day.';
						html += '<table class="table-general -striped -highlight-row" cellspacing="0" cellpadding="0">';
						html += '<thead><tr>';
						html += '<td width="70">Date</td><td>Detail</td><td width="50">Amount</td><td width="60">Price</td>';
						html += '</tr></thead>';

						$.each(extended_support_sales, function (i, data) {
							html += '<tr>';
							html += '<td title="' + data.date.toString().substr(0, 21) + '">' + data.date.getDate() + ' ' + month + ' ' + year + '</td><td><a href="/item/' + urlify(data.name) + '/' + data.id + '">' + data.name + '</a></td><td class="number">1</td><td class="number">' + _d(data.earnings) + '</td>';
							html += '</tr>';
						});

						html += '<tr>';
						html += '<td colspan="2" class="number strong">Summary:</td><td class="number strong">' + total_extended_support + '</td><td class="number strong">' + _d(total_extended_support_money) + '</th>';
						html += '</tr>';
						html += '</table>';

					}

					if (total_referrals) {

						var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						var year = "" + referrals[0].date.getFullYear();
						month = month[referrals[0].date.getMonth()];

						year = year.substr(2);

						html += '<h3 style="padding-bottom:0;">Referrals:</h3>';
						html += 'You have referred <strong>' + total_referrals + '</strong>  ' + _n('user', 'users', total_referrals) + '  within <strong>'+Math.ceil(daysrange)+'</strong> ' + _n('day', 'days', Math.ceil(daysrange)) + ' and earned <strong>'+_d(total_referrals_money) +'</strong>. That\'s <strong>'+(total_referrals/daysrange).toFixed(2)+'</strong> users and <strong>'+_d(total_referrals_money/daysrange)+'</strong> per day.';
						html += '<table class="table-general -striped -highlight-row" cellspacing="0" cellpadding="0">';
						html += '<thead><tr>';
						html += '<td width="70">Date</td><td>Detail</td><td width="50">Amount</td><td width="60">Price</td>';
						html += '</tr></thead>';

						$.each(referrals, function (i, data) {
							html += '<tr>';
							html += '<td title="' + data.date.toString().substr(0, 21) + '">' + data.date.getDate() + ' ' + month + ' ' + year + '</td><td>' + data.name.replace(data.username, '<a href="/user/' + data.username + '">' + data.username + '</a>') + ((data.purchased) ? '&nbsp;&nbsp;<span style="font-size:10px;">purchased ' + data.purchased[2] + '</span>' : '') + '</td><td class="number">1</td><td class="number">' + _d(data.earnings) + '</td>';
							html += '</tr>';
						});

						html += '<tr>';
						html += '<td colspan="2" class="number strong">Summary:</td><td class="number strong">' + total_referrals + '</td><td class="number strong">' + _d(total_referrals_money) + '</th>';
						html += '</tr>';
						html += '</table>';
					}


					if (total_deposits) {

						var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						var year = "" + deposits[0].date.getFullYear();
						month = month[deposits[0].date.getMonth()];

						year = year.substr(2);

						html += '<h3 style="padding-bottom:0;">Deposits:</h3>';
						html += 'You have deposited <strong>' + total_deposits + '</strong> times within <strong>'+Math.ceil(daysrange)+'</strong> ' + _n('day', 'days', Math.ceil(daysrange)) + ' and spent <strong>'+_d(total_deposits_money) +'</strong>. That\'s <strong>'+(total_deposits/daysrange).toFixed(2)+'</strong> deposits and <strong>'+_d(total_deposits_money/daysrange)+'</strong> per day.';
						html += '<table class="table-general -striped -highlight-row" cellspacing="0" cellpadding="0">';
						html += '<thead><tr>';
						html += '<td width="70">Date</td><td>Detail</td><td width="50">Amount</td><td width="60">Price</td>';
						html += '</tr></thead>';

						$.each(deposits, function (i, data) {
							html += '<tr>';
							html += '<td title="' + data.date.toString().substr(0, 21) + '">' + data.date.getDate() + ' ' + month + ' ' + year + '</td><td>' + data.name + '</td><td class="number">1</td><td class="number">' + _d(data.price) + '</td>';
							html += '</tr>';
						});

						html += '<tr>';
						html += '<td colspan="2" class="number strong">Summary:</td><td class="number strong">' + total_deposits + '</td><td class="number strong">$' + total_deposits_money + '</th>';
						html += '</tr>';
						html += '</table>';
					}


					html += '<div id="statementer_copyright">Version '+version+' &copy; <a href="/user/revaxarts">revaxarts</a>.com. Licensed under the MIT license</div><hr>';

					$('#statementer_content').html(html);

                    if (total_sales) {

                        var chart_data = [
                            ['Country','Sales']
                        ];
                        for (var country in sales_per_country) {
                            if (sales_per_country.hasOwnProperty(country)) {
                                chart_data.push([country, sales_per_country[country]]);
                            }
                        }

                        if(chart_data.length > 1) {
                            var jsapi_modules = '{"modules":[{"name":"visualization","callback":"alert(\'test\')","version":"1","packages":["geochart"]}]}';
                            // load the world map
                            $.ajax({
                                url: '//www.google.com/jsapi?callback=console.log',
                                dataType: "script",
                                cache: true,
                                success: function () {
                                    google.load("visualization", "1", {
                                        callback: function () {

                                            $('#sales_world_map_holder').show();

                                            var data = google.visualization.arrayToDataTable(chart_data);

                                            var options = {};

                                            var chart = new google.visualization.GeoChart(document.getElementById('sales_world_map'));

                                            chart.draw(data, options);
                                        }, packages: ["geochart"]
                                    });

                                }
                            });
                        }
                    }

					if (!currentitem || !$(currentitem).length) currentitem = 0;
					if($('#accordion').data('accordion')) $('#accordion').accordion('destroy');
					$('#accordion').accordion({
						active: currentitem,
						autoHeight: false,
						changestart: function (event, ui) {
							currentitem = (ui.newHeader[0].id) ? '#' + ui.newHeader[0].id : 0;
							loadCharts(ui.newContent);
						}
					});

					$('span.sortby').delegate('a', 'click', function(){
						to = null;
						if(sortby == $(this).data('sort')){
							sortdir = (sortdir == 'DESC') ? 'ASC' : 'DESC';
						}else{
							sortdir = 'DESC';
						}
						sortby = $(this).data('sort');
						calculate();
						return false;
					}).find('[data-sort='+sortby+']').addClass('active');

					//
					if($('#accordion').data('accordion')) loadCharts($('#accordion').data('accordion').active.next());

					var firstofmonth = new Date(new Date(firstdate).getFullYear(), new Date(firstdate).getMonth(), 1).getTime();
					var lastofmonth = new Date(new Date(lastdate).getFullYear(), new Date(lastdate).getMonth() + 1, 0, 23, 59, 59).getTime();
					if($('#statementer_dateslider').data('slider')) $('#statementer_dateslider').slider('destroy');
					$('#statementer_dateslider').slider({
						range: true,
						min: firstofmonth,
						max: lastofmonth,
						step: 36e5,
						values: [from || firstofmonth, to || lastofmonth],
						slide: function (event, ui) {
							from = ui.values[0];
							to = ui.values[1];
							$('#statementer_date_from').html(new Date(from).toString().substr(0, 21));
							$('#statementer_date_to').html(new Date(to).toString().substr(0, 21));
						},
						change: function (event, ui) {
							from = ui.values[0];
							to = ui.values[1];
							window.location.hash = '#from=' + from + '&to=' + to + '';
							calculate();
						}
					}).find('a').css('background-color', '#' + color).end().find('.ui-slider-range').css('background-color', '#' + color);
					$('#statementer_date_from').html(new Date(from || firstofmonth).toString().substr(0, 21));
					$('#statementer_date_to').html(new Date(to || lastofmonth).toString().substr(0, 21));
					//";


				},

				loadCharts = function (element) {
					if (element.data('loaded')) return false;

					var name = element.data('name');

					var lastday = new Date(currentyear, currentmonth + 1, 0, 23, 59, 59).getDate();
					var day_values = [];
					var earnings_values = [];
					var date_values = [];
					var hour_values = [];
					var hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
					var steps = Math.ceil(sales[name].maxsales_hour / 30);
					var esteps = Math.ceil(sales[name].maxearnings_day / 10);


					$.each(sales[name].days, function (day, value) {
						if (lastday >= parseInt(day, 10)) {
							day_values.push(value);
							date_values.push(day);
						}
					});
					$.each(sales[name].hours, function (day, value) {
						hour_values.push(value);
					});
					$.each(sales[name].earningsperday, function (day, value) {
						if (lastday >= parseInt(day, 10)) {
							earnings_values.push(parseInt(value, 10));
						}
					});


					var html = '' + '<div class="tabs"><ul><li><a href="#tabs' + tabcount + '1">Sales per day</a></li><li><a href="#tabs' + tabcount + '2">Sales per hour</a></li><li><a href="#tabs' + tabcount + '3">Earnings per day ($)</a></li></ul>' + ( (typeof sales[name].percentage == 'number') ? '<span class="percentage" title="you get ' + (sales[name].percentage*100) + '% of this items profit"><input type="text" value="' + (sales[name].percentage*100) + '" class="percentage" maxlength="3" data-id="' + sales[name].id + '">%</span>' : '') + '<div class="tab" id="tabs' + tabcount + '1">' + '	<img src="' + getGoogleChart(day_values, date_values, sales[name].maxsales_day, steps, sales[name].percentage) + '" width="937" height="320" usemap="#graph' + tabcount + '1"></div><div class="tab" id="tabs' + tabcount + '2"><img src="' + getGoogleChart(hour_values, hours, sales[name].maxsales_hour, steps, sales[name].percentage) + '" width="937" height="320"></div><div class="tab" id="tabs' + tabcount + '3">' + '<img src="' + getGoogleChart(earnings_values, date_values, sales[name].maxearnings_day, esteps, sales[name].percentage) + '" width="937" height="320" usemap="#graph' + tabcount + '2"></div></div>';


					var map1 = '<map name="graph' + tabcount + '1">';
					var map2 = '<map name="graph' + tabcount + '2">';
					var x, d, h, w = 903 / lastday;

					for (var i = 0; i < lastday; i++) {
						x = (i * w + 18);
						d = new Date(currentyear, currentmonth, i + 1).getTime();
						h = '<area shape="rect" coords="' + x + ',0,' + (x + w) + ',300" href="#" title="show day ' + (i + 1) + ' (' + sales[name].days[(i + 1)] + ' sales, $' + sales[name].earningsperday[(i + 1)].toFixed(2) + ')" data-from=' + d + ' data-to="' + (d + 864e5 - 1) + '" >';
						map1 += h;
						map2 += h;
					}
					map1 += '</map>';
					map2 += '</map>';
					html += map1 + map2;
					element.html(html).tabs({
						selected: currenttab,
						select: function (event, ui) {
							currenttab = ui.index;
						}
					});
tabcount++;
					element.data('loaded', true);
				},

				getGoogleChart = function (values, dates, maxvalue, steps, percentage) {
					var url = '//chart.googleapis.com/chart?cht=bvg',
						yaxis = (function () {
							var ret = '';
							for (var i = 0; i <= maxvalue; i += steps) {
								ret += '|' + i;
							}
							return ret + '|' + (i);
						})(),
						chart = {
							chs: "937x320",
							chxr: "0,0," + (dates.length) + "|1,0," + (maxvalue + steps) + "|2,0," + (maxvalue + steps),
							chxt: "x,y,r",
							chxl: "0:|" + dates.join('|') + "|1:" + yaxis + "|2:" + yaxis,
							chbh: "a,2,2",
							chds: "0," + (maxvalue + steps) + "," + (maxvalue + steps) + "",
							chco: "" + color + "",
							chf: "bg,s,F5F5F5",
							chd: "t:" + values.join(','),
							chg: "" + (100 / (dates.length)) + "," + (100 / (maxvalue + steps) * steps) + ""
						};
					$.each(chart, function (key, value) {
						url += '&' + key + '=' + value;
					});
					return url;
				},

				urlify = function (name) {
					var slug = name.replace(/ /g, '-').replace(/(-){2,}/g, '-').replace(/[^A-Za-z0-9-]/, '').toLowerCase();
					return slug;
				},

				number_format = function (nStr) {
					nStr += '';
					x = nStr.split('.');
					x1 = x[0];
					x2 = x.length > 1 ? '.' + x[1] : '';
					var rgx = /(\d+)(\d{3})/;
					while (rgx.test(x1)) {
						x1 = x1.replace(rgx, '$1' + ',' + '$2');
					}
					return x1 + x2;
				},

				_n = function (single, plural, number) {
					return (number == 1) ? single : plural;
				},

				_d = function (value, decimal, raw) {
					if(!rates) return (raw) ? value : _e(currentcurrency)+''+(value*1).toFixed(2);
					return (raw) ? number_format(value*(rates[currentcurrency] || 1)) : _e(currentcurrency)+''+number_format((value*(rates[currentcurrency] || 1)).toFixed(2));
				},

				_e = function (currency) {
					currency = currency || 'USD';
					var pres = {
						'AUD': '$',
						'BBD': '$',
						'BMD': '$',
						'BND': '$',
						'BSD': '$',
						'BZD': '$',
						'CAD': '$',
						'FJD': '$',
						'GYD': '$',
						'HKD': '$',
						'JMD': '$',
						'LRD': '$',
						'MZD': '$',
						'SBD': '$',
						'SGD': '$',
						'SRD': '$',
						'TTD': '$',
						'USD': '$',
						'ARS': '$',
						'CUP': '&#8369;',
						'DOP': '&#8369;',
						'PHP': '&#8369;',
						'UYU': '&#8369;',
						'THB': '&#3647;',
						'PYG': '&#8370;',
						'LAK': '&#8365;',
						'NGN': '&#8358;',
						'MNT': '&#8366;',
						'KPW': '&#8361;',
						'KRW': '&#8361;',
						'UAH': '&#8372;',
						'INR': '&#8360;',
						'LKR': '&#8360;',
						'MUR': '&#8360;',
						'NPR': '&#8360;',
						'PKR': '&#8360;',
						'SCR': '&#8360;',
						'IRR': '&#65020;',
						'CNY': '&#13136;',
						'EUR': '&euro;',
						'GBP' : '&pound;',
						'IEP' : '&pound;',
						'JPY' : '&yen;'
					};
					return pres[currency] || '<span class="statementer_currency">'+currency+'</span> ';
				},

				calculate = function () {

					if (location.hash) {
						var parts = location.hash.substr(1).split('&');
						from = parseInt(parts[0].split('=')[1], 10);
						to = parseInt(parts[1].split('=')[1], 10);
						var d = new Date(from);
						if (d.getMonth() != currentmonth) {
							location.href = 'statement?month=' + (d.getMonth() + 1) + '&year=' + (d.getFullYear()) + '' + location.hash;
							return false;
						}
					}
					if (raw == '"Date","Order ID","Type","Detail","Item ID","Document","Price","EU VAT","US RWT","US BWT","Amount","Site","Other Party Country","Other Party Region","Other Party City","Other Party Zipcode"') {
						$content.html('<span>No action here :(</span>');
						return false;
					}

					var percentages = get('percentages');

					var statementcount = raw.length;

					sales = {}, referrals = [], deposits = [], withdrawal = [], reversals = [], items = [], extended_support_sales = [];

					total_sales = total_sales_volume = total_referrals = total_referrals_money = total_deposits = total_deposits_money = total_purchases = total_purchases_money = total_withdrawal = total_withdrawal_money = total_reversals = total_reversals_money = total_earning = total_extended_support = total_extended_support_money = total_us_tax_count = total_us_tax_money = 0;

					sales[allitems] = {
						id: 'all',
						totalsales: 0,
						totalearnings: 0,
						maxsales_day: 0,
						maxsales_hour: 0,
						maxearnings_day: 0,
						hours: {
							0: 0,1: 0,2: 0,3: 0,4: 0,5: 0,6: 0,7: 0,8: 0,9: 0,10: 0,11: 0,12: 0,13: 0,14: 0,15: 0,16: 0,17: 0,18: 0,19: 0,20: 0,21: 0,22: 0,23: 0
						},
						days: {
							1: 0,2: 0,3: 0,4: 0,5: 0,6: 0,7: 0,8: 0,9: 0,10: 0,11: 0,12: 0,13: 0,14: 0,15: 0,16: 0,17: 0,18: 0,19: 0,20: 0,21: 0,22: 0,23: 0,24: 0,25: 0,26: 0,27: 0,28: 0,29: 0,30: 0,31: 0
						},
						earningsperday: {
							1: 0,2: 0,3: 0,4: 0,5: 0,6: 0,7: 0,8: 0,9: 0,10: 0,11: 0,12: 0,13: 0,14: 0,15: 0,16: 0,17: 0,18: 0,19: 0,20: 0,21: 0,22: 0,23: 0,24: 0,25: 0,26: 0,27: 0,28: 0,29: 0,30: 0,31: 0
						}
					};

					var order_id, dateparts, line, data, lastdata, nextline, by_order_id = {}, random_order_id = 1;

                    // first we go through the statement grouping everything by order id
                    // then we go through the order ids calculating the sales etc..

                    for (var i = statementcount - 1; i >= 0; i--) {

                        line = raw[i].split('","');
                        order_id = parseFloat(line[1]) || random_order_id++;
                        order_id = order_id + "_" + (parseInt(line[4], 10) || "");
                        if(typeof by_order_id[order_id] == 'undefined'){
                            by_order_id[order_id] = [];
                        }
                        // todo: the order_id will fail if the buyer purchases the same item twice or more in a single cart transaction. the sale numbers wont match up

                        line[0] = line[0].substr(1);

                        dateparts = line[0].replace(/(-|:)/g, ' ').split(' ');

                        data = {
                            date: new Date(dateparts[0], dateparts[1]-1, dateparts[2], dateparts[3], dateparts[4], dateparts[5] ),
                            type: line[2],
                            name: line[3],
                            id: parseInt(line[4], 10) || null,
                            document: parseInt(line[5], 10) || null,
                            earnings: parseFloat(line[10]),
                            rate: null,
                            price: parseFloat(line[6]),
                            us_rwt: parseFloat(line[8]), // from 0 to 30%
                            us_bwt: parseFloat(line[9]), // if haven't submited W-8 form.
                            site: line[11].replace('"', ''),
                            country: line[12],
                            purchased: false,
                            order_id: order_id
                        };
                        if(isNaN(data.us_bwt))data.us_bwt = 0;
                        if(isNaN(data.us_rwt))data.us_rwt = 0;

                        by_order_id[order_id].push(data);
                    }
                    // now we merge all the orders together into single entries so we can better process them in a loop

                    var single_orders = [], o, x, s;
                    for(o in by_order_id){
                        if(by_order_id.hasOwnProperty(o)){
                            var newdata = {};
                            for(x=0; x<by_order_id[o].length; x++){
                                // merge data into newdata
                                for(s in by_order_id[o][x]){
                                    if(by_order_id[o][x].hasOwnProperty(s)){
                                        // merge this one into newdata
                                        if(typeof newdata[s] == 'undefined' || !newdata[s] || newdata[s] == ''){
                                            newdata[s] = by_order_id[o][x][s];
                                        }else{
                                            // data already exists in this key.
                                            if(
                                                s == 'earnings' ||
                                                s == 'us_rwt' ||
                                                s == 'us_bwt'
                                            ){
                                                // combine earnings per order_id
                                                newdata[s] += by_order_id[o][x][s];
                                            }
                                        }
                                    }
                                }
                                if(/\d+ months (renewed|extended) support/.test(by_order_id[o][x].name)){


                                    if (from <= by_order_id[o][x].date.getTime() && by_order_id[o][x].date.getTime() <= to || !to) {
                                        total_extended_support++;
                                        // find the author fee for this particular extended sale.
                                        for (var other = 0; other < by_order_id[o].length; other++) {
                                            if (by_order_id[o][other].type == 'Author Fee' && by_order_id[o][other].name.indexOf('for extended') > 1) {
                                                by_order_id[o][x].earnings += by_order_id[o][other].earnings;
                                            }
                                        }
                                        total_extended_support_money += by_order_id[o][x].earnings;
                                        extended_support_sales.push(by_order_id[o][x]);
                                    }
                                }
                                if('Sale Reversal' == by_order_id[o][x].type){
                                    newdata = by_order_id[o][x];
                                }
                            }
                            single_orders.push(newdata);
                        }
                    }

					for (var i = single_orders.length - 1; i >= 0; i--) {


						/*data = {
							date: new Date(dateparts[0], dateparts[1]-1, dateparts[2], dateparts[3], dateparts[4], dateparts[5] ),
							type: line[2],
							name: item_name,
							id: parseInt(line[4], 10) || null,
							document: parseInt(line[5], 10) || null,
							earnings: parseFloat(line[8]),
							rate: null,
							price: parseFloat(line[6]),
							site: line[9].replace('"', ''),
                            country: line[10]
						};*/
                        data = single_orders[i];

						if (from <= data.date.getTime() && data.date.getTime() <= to || !to) {
							switch (data.type) {
							case 'Referral Cut':
								data.username = data.name.substr(19);
								referrals.push(data);
								total_referrals++;
								total_referrals_money += data.earnings;
								if(single_orders[i - 1]){
									nextline = single_orders[i - 1];
									(parseInt(nextline.earnings)*.3 == data.earnings && nextline.date.getTime()-data.date.getTime() <= 1000) ? data.purchased = nextline : data.purchased = false;
								}else{
									data.purchased = false;
								}
								//total_earning += data.earnings;
								break;

							case 'Deposit':
								data.price = data.earnings;
								deposits.push(data);
								total_deposits++;
								total_deposits_money += data.earnings;
								break;

							case 'Purchase':
								data.price = -data.earnings;
								purchases.push(data);
								//if(!(/^Buyer fee for /.test(data.name))) total_purchases++;
								total_purchases++;
								total_purchases_money -= data.earnings;
								//total_earning += data.earnings;
								break;

							case 'Other Adjustments Earnings':
							case 'Manual Adjustment':
							case 'Sale Reversal':
								reversals.push(data);
								data.earnings *= -1;
								total_reversals++;
								total_reversals_money += data.earnings;
							case 'Sale':

								var add = (data.type == 'Sale' ? 1 : -1),
								name = data.name+'_'+data.id;

                                if(data.country){
                                    sales_per_country[data.country] = (typeof sales_per_country[data.country] == 'undefined') ? 1 : (sales_per_country[data.country] + 1);
                                }

								/*if(raw[i - 1]){
									nextline = raw[i - 1].substr(1).split('","');
									if ( nextline[2] == 'Author Fee' ) {
										data.earnings += parseFloat(nextline[8]);
										data.price += parseFloat(nextline[6]);
									}
								}*/

								if ($.inArray(name, items) == -1) {

									items.push(name);
									sales[name] = {
										id: data.id,
										site: data.site.toLowerCase(),
										percentage: percentages[data.id] ? percentages[data.id] : 1,
										totalsales: 0,
										totalearnings: 0,
										maxsales_day: 0,
										maxsales_hour: 0,
										maxearnings_day: 0,
										hours: {
											0: 0,1: 0,2: 0,3: 0,4: 0,5: 0,6: 0,7: 0,8: 0,9: 0,10: 0,11: 0,12: 0,13: 0,14: 0,15: 0,16: 0,17: 0,18: 0,19: 0,20: 0,21: 0,22: 0,23: 0
										},
										days: {
											1: 0,2: 0,3: 0,4: 0,5: 0,6: 0,7: 0,8: 0,9: 0,10: 0,11: 0,12: 0,13: 0,14: 0,15: 0,16: 0,17: 0,18: 0,19: 0,20: 0,21: 0,22: 0,23: 0,24: 0,25: 0,26: 0,27: 0,28: 0,29: 0,30: 0,31: 0
										},
										earningsperday: {
											1: 0,2: 0,3: 0,4: 0,5: 0,6: 0,7: 0,8: 0,9: 0,10: 0,11: 0,12: 0,13: 0,14: 0,15: 0,16: 0,17: 0,18: 0,19: 0,20: 0,21: 0,22: 0,23: 0,24: 0,25: 0,26: 0,27: 0,28: 0,29: 0,30: 0,31: 0
										}
									};
								}



								sales[name].totalsales += add;

								sales[name].totalearnings += (data.earnings*sales[name].percentage)*add;
								sales[name].hours[data.date.getHours()] += add;
								sales[name].days[data.date.getDate()] += add;
								sales[name].earningsperday[data.date.getDate()] += parseInt(data.earnings*sales[name].percentage, 10);

								sales[name].maxsales_hour = Math.max(sales[name].hours[data.date.getHours()], sales[name].maxsales_hour);
								sales[name].maxsales_day = Math.max(sales[name].days[data.date.getDate()], sales[name].maxsales_day);
								sales[name].maxearnings_day = Math.max(sales[name].earningsperday[data.date.getDate()], sales[name].maxearnings_day);

								sales[allitems].totalsales += add;
								sales[allitems].totalearnings += (data.earnings*sales[name].percentage)*add;
								sales[allitems].hours[data.date.getHours()] += add;
								sales[allitems].days[data.date.getDate()] += add;
								sales[allitems].earningsperday[data.date.getDate()] += parseInt(data.earnings*sales[name].percentage, 10);

								sales[allitems].maxsales_hour = Math.max(sales[allitems].hours[data.date.getHours()], sales[allitems].maxsales_hour);
								sales[allitems].maxsales_day = Math.max(sales[allitems].days[data.date.getDate()], sales[allitems].maxsales_day);
								sales[allitems].maxearnings_day = Math.max(sales[allitems].earningsperday[data.date.getDate()], sales[allitems].maxearnings_day);

								total_sales += add;
								total_sales_volume += (data.earnings)*add;
                                if(data.us_rwt > 0 || data.us_bwt > 0) {
                                    total_us_tax_count += add;
                                    total_us_tax_money += (data.us_rwt + data.us_bwt) * add;
                                }
								total_earning += (data.earnings*sales[name].percentage)*add;
								break;

							case 'Withdrawal Request':
							case 'Withdrawal Cancellation':
								withdrawal.push(data);
								(data.earnings < 0) ? total_withdrawal++ : total_withdrawal--;
								total_withdrawal_money -= data.earnings;
								break;

							}

							firstdate = (firstdate > data.date.getTime() || !firstdate) ? data.date.getTime() : firstdate;
							lastdate = (lastdate < data.date.getTime() || !lastdate) ? data.date.getTime() : lastdate;

						}

						lastdata = data;

					}
					to = to || ((now.getMonth() == currentmonth && now.getFullYear() == currentyear) ? now : null);
					var sortfunc = (sortdir == 'DESC') ? function(a,b){return b-a;} : function(a,b){return a-b;};
					if(sortby == 'name'){
						items.sort();
					}else{
						items = sortitby(sales, sortby, sortfunc);
					}
					items.unshift(allitems);

					makeContent();

				},

				sortitby = function (sales, sortby, sortfunc) {
					var sortarray = [];
					var returnitem = [];
					var used = [];
					$.each(sales, function(name, itemdata){
						sortarray.push(itemdata[sortby]);
					});
					sortarray.sort(sortfunc);
					$.each(sales, function(name, itemdata){
						if(name != allitems){
							var pos = parseInt($.inArray(itemdata[sortby], sortarray))*10;
							returnitem[next(pos, returnitem)] = name;

						}
					});

					function next(pos, arr){
						return (!arr[pos]) ? pos : next(++pos, arr);
					}

					return $.map(returnitem, function(name){if(name) return name;});
				},


				loadStatementer = function () {
					$.ajax({
						url: '//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js',
						dataType: "script",
						cache: true,
						success: function () {

                            // check we have updated version.
                            var last_version = get('last_version');
                            if(last_version != version || !last_version){
                                clear();
                                save('last_version',version);
                            }

						//current month
						if (now.getMonth() == currentmonth && now.getFullYear() == currentyear) {
							raw = get('' + currentyear + '_' + currentmonth);
						if (lastbalance != currentbalance || !raw) {
								$content.html('<span style="font-style:italic">fetching data...</span>');
								$.get(csvfile, function (data) {
									//raw = $.trim(data.replace(/"Date","Order ID","Type","Detail","Item ID","Price","Amount"\n/g, ''));
									raw = $.trim(data.replace(/"Date","Order ID","Type","Detail","Item ID","Document","Price","EU VAT","US RWT","US BWT","Amount","Site","Other Party Country","Other Party Region","Other Party City","Other Party Zipcode"\n/g, ''));
									save('' + currentyear + '_' + currentmonth, raw);
									window.dashboardplus.setCookie('statementer_lastbalance', currentbalance, 30);
									initCalc();
								});
							} else {
								initCalc();
							}
							//other month
						} else {
							clear();
							$content.html('<span style="font-style:italic">fetching data...</span>');
							$.get(csvfile, function (data) {
								raw = $.trim(data.replace(/"Date","Order ID","Type","Detail","Item ID","Document","Price","EU VAT","US RWT","US BWT","Amount","Site","Other Party Country","Other Party Region","Other Party City","Other Party Zipcode"\n/g, ''));
								initCalc();
							});
						}
					}

					});

				},

				save = function (name, value){
					var obj = localStorage['statementer'] ? $.parseJSON(localStorage['statementer']) : {};

					obj[name] = value;
					localStorage.setItem('statementer', JSON.stringify(obj));

				},

				get = function (name){
					var obj = localStorage['statementer'] || false;

					if(!obj) return false;

					obj = $.parseJSON(obj);

					return (obj[name]) ? obj[name] : false;
				},

				clear = function (){
					localStorage.removeItem('statementer');
				},

				initCalc = function () {
					raw = raw.split('\n');
					makeUI();
					calculate();
				};

			prepareUI();



})();
