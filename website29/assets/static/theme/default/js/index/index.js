model.todo.Register("bucketsNameReady", function(){
	model.getBuckets();
});

model.todo.Register("bucketInfoReady", function(bucket){
	var t = getDayObj();
	var start = dateFormat(t.y,t.m,1);
	var end = dateFormat(t.y,t.m,t.d);

	model.getBucketFormData(bucket, "transfer", start, end, "day", function(result){
	    var Data = [];
	    for (var i = 0; i < result.data.length; i++) {
	        Data[i] = [result.time[i] * 1000, result.data[i]];
	    }
	  
		var chart = new Highcharts.Chart({
	        credits: {
	            enabled: false
	        },
	        chart: {
	        	backgroundColor: 'rgba(255, 255, 255, 0)',
	            renderTo: bucket.name()+'-chart'
	        },
	        colors: [
	        	//'#aaa'
	        ],
	        title: {
	            text: ''
	        },
	        xAxis: {
	            type: 'datetime',
	            title: {
	                text: null
	            }
	        },
	        yAxis: {
	            title: {
	                text: null
	            },
	            startOnTick: false,
	            showFirstLabel: false
	        },
	        legend: {
	        	enabled: false,
	            layout: 'vertical',
	            align: 'right',
	            floating: true,
	            verticalAlign: 'top',
	            borderWidth: 0
	        },
	        tooltip: {
	            shared: true,
	            formatter: function() {
	                var s = '<b>' + Highcharts.dateFormat('%Y-%m-%d %H:%M',this.x) + '</b>';
	                $.each(this.points, function(i, point) {
	                	var fm = format(point.y,storageHex,storageUnits,2);
	                    s += '<br/>' + point.series.name + ': ' + fm.base + fm.unit;
	                });
	                return s;
	            }
	        },
	        series: [ {
	            name: '流量',
	            data: Data
	        }]
		});
	});
});

model.todo.Register("bucketInfoReady", function(buckets){
	$(".bucket-name-span").each(function(i, span){
		var t;
		$(span).on("mouseenter", function(){
			t = $(this).autoScrollX();
			t && t.startScroll(4);
		}).on("mouseleave", function(){
			t && t.stopScroll();
		});
	});
});

$(function() {
	Highcharts.setOptions({
	    global: {
	        useUTC: false
	    }
	});

    $(".close-notice").on("click", function () {
    	$(this).parent().hide();
    });

    $(window).on("scroll", function () {
		if(testBottom()){
			model.getBuckets(4);
		}
	});

	//---------------- load more --------------------

    model.getBalance();
    model.getAccountInfo();
});