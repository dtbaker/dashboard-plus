(function () {

    init();

    function init(){

        $('head').append('<link type="text/css" rel="stylesheet" href="'+window.dashboardplus.base + 'css/statement_merge.css" />');

        // thanks surjithctly :)

        var amount          = 0.0;
        var amount_string   = '';
        var price          = 0.0;
        var price_string   = '';
        var order_id        = '';
        var next_amount     = '';
        var current_order_id = 0;
        var current_row;
        var current_row_amount = 0;
        var current_row_price = 0;
        var current_row_count = 0;

        var unconverted, converted, current_object = [], conversion_rate;

        $("#stored_statement").find("tr.statement__line").each(function(i) {

            order_id        = $(this).find('.statement__order_id').text() + $(this).find('.statement__detail-item a').attr('href');
            if(!order_id.length)return;

            amount_string   = $(this).find('.statement__amount').text().replace(/\s+/g,'');
            amount          = parseFloat(amount_string.substring(1, amount_string.length)).toFixed(2);
            price_string   = $(this).find('.statement__price .statement__price').text().replace(/\s+/g,'');
            price          = parseFloat(price_string.substring(1, price_string.length)).toFixed(2);

            console.log(order_id + ": Adding price "+price_string+" value: "+price);
            console.log(order_id + ": Adding amount "+amount_string+" value: "+amount + ". Total is: " + current_row_amount);

            if(!current_order_id || order_id != current_order_id){
                current_row = $(this).clone();
                current_row.attr('class','statement__line_converted');
                current_row.find('.statement__amount').attr('class','statement__amount');
                current_row.insertBefore($(this));
                current_order_id = order_id;
                current_row_amount = 0.0;
                current_row_price = 0.0;
                current_row_count = 0;
            }
            current_row_count++;

            current_row_amount = parseFloat(current_row_amount) + parseFloat(amount);
            current_row_amount = current_row_amount.toFixed(2);
            current_row_price = parseFloat(current_row_price) + parseFloat(price);
            current_row_price = current_row_price.toFixed(2);

            $(this).find('td').each(function(){
                current_row.find('.' + $(this).attr('class').replace(' -value-negative','')).html($(this).html());
            });

            current_row.find('.statement__price').text('$' + current_row_price);
            current_row.find('.statement__amount').text('$' + current_row_amount);

            var current_row_contains = current_row.data('current_row_contains');
            if(!current_row_contains)current_row_contains = [];
            current_row_contains.push($(this));
            current_row.data('current_row_contains',current_row_contains);

            current_row.click(function(){
                var foo = $(this).data('current_row_contains');
                for(var i = 0; i < foo.length; i++){
                    foo[i].show();
                }
            });

            $(this).addClass('statement_row_hidden').hide();

        });

        if(current_row_count < 4){
            current_row.hide();
        }

    }

})();
