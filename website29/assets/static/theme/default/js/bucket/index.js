model.todo.Register("bucketFormDataspaceReady", function(data){
	if(!data.data || data.data.length === 0){return false;}
	var Data = [];
    for (var i = 0; i < data.data.length; i++) {
        Data[i] = [data.time[i] * 1000, data.data[i]];
    }

	var chart = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            renderTo: 'space-chart'
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
            showFirstLabel: false/*,
            labels: {
		        formatter: function() {
	                var fm = format(this.value,storageHex,storageUnits,2);
	                return fm.base + fm.unit;
		        }
		    }*/
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

model.todo.Register("bucketFormDatatransferReady", function(data){
	if(data.data.length === 0){return false;}
	var Data = [];
    for (var i = 0; i < data.data.length; i++) {
        Data[i] = [data.time[i] * 1000, data.data[i]];
    }

	var chart = new Highcharts.Chart({
        credits: {
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
            name: '流量',
            data: Data
        }]
    });
});

model.todo.Register("bucketApiCallFormDataReady", function(getData, putData){
	if(getData.data.length === 0 || putData.data.length === 0){return false;}

	var GetData = [];
    for (var i = 0; i < getData.data.length; i++) {
        GetData[i] = [getData.time[i] * 1000, getData.data[i]];
    }

    var PutData = [];
    for (var i = 0; i < putData.data.length; i++) {
        PutData[i] = [putData.time[i] * 1000, putData.data[i]];
    }

	var chart = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            renderTo: 'apicall-chart'
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
      //       labels: {
		    //     formatter: function() {
	     //            var fm = format(this.value,storageHex,storageUnits,2);
	     //            return fm.base + fm.unit;
		    //     }
		    // }
        },
        legend: {
            enabled: true,
            layout: 'vertical',
            align: 'left',
            backgroundColor: '#fff',
            borderColor: 'black',
            borderWidth: 1,
            floating: true,
            x: 240,
            y: 0,
            verticalAlign: 'top'
        },
        tooltip: {
            shared: true,
            formatter: function() {
                var s = '<b>' + Highcharts.dateFormat('%Y-%m-%d %H:%M',this.x) + '</b>';
                $.each(this.points, function(i, point) {
                	var fm = format(point.y,numHex,numUnits,2);
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
            name: 'GET',
            data: GetData
        }, {
            name: 'PUT',
            data: PutData
        }]
    });
});

$(function() {
    $(".close-notice").on("click", function () {
    	$(this).parent().hide();
    });
});

model.todo.Register("certainBucketReady", function(bucket){
    var t = getDayObj();
    var t2 = getDayObj("-14 day");
	var start = dateFormat(t2.y,t2.m,t2.d);
	var end = dateFormat(t.y,t.m,t.d);

    model.getBucketFormData(bucket, "space", start, end);
    model.getBucketFormData(bucket, "transfer", start, end);
    model.getBucketApiCallFormData(bucket, start, end);
});