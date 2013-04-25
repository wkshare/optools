model.todo.Register("bucketFormDatatransferReady", function(data){
	if(data.data.length === 0){return false;}
	var Data = [];
    for (var i = 0; i < data.data.length; i++) {
        Data[i] = [data.time[i] * 1000, data.data[i]];
    }

	chart = new Highcharts.StockChart({
        credits: {
            enabled: false
        },
        navigation: {
            buttonOptions: {
                enabled: false
            }
        },
        rangeSelector: {
            enabled: false
        },
        chart: {
            renderTo: 'transfer-chart'
        },
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
            enabled: false
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
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, 'rgba(2,0,0,0)']
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 5
                        }
                    }
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                }
            }
        },
        series: [{
            name: '已使用空间',
            data: Data
        }]
    });
});

var refreshChart = function(){
    var bucket = $("#bucket-select").val();

    var start = $("#startDate").val().replace(/\-/g, "");
    var end = $("#endDate").val().replace(/\-/g, "");

    model.getBucketFormData(bucket, "transfer", start, end);
};

$(function () {
});