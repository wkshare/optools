var chart;

$(function() {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    var periodOps = [3,10,20,30,50,67,97];

    var timeTag = $(".time-tag");
    timeTag.each(function (i) {
        $(this).css("left",periodOps[i]+"%");
    });

    var getNearest = function (val, array) {
        var l = array.length;
        for (var i = 0; i < l; i++) {
            if(array[i]>=val){
                if(i==0) return 0;

                return array[i-1]+array[i] > val*2 ? i-1:i;
            }
        };
        return l-1;
    };

    var slider = $("#period-slider");
    slider.slider({
        min: 0,  
        max: 100, 
        value: 50,
        animate: "slow",
        change:function (event, ui) {
            $("input[name=period]").val(ui.value);  
        },
        stop: function(event, ui){
            var handle = slider.find(".ui-slider-handle");
            var val = ui.value;
            var i = getNearest(val, periodOps);
            var nearest = periodOps[i];

            if(nearest != val) {
                handle.animate({left:nearest+"%"},{
                    duration: "500",
                    easing: "swing",
                    complete: function () {
                        //slider.slider("value", nearest);
                    }
                });
            }
        }
    });

    var inputLine = $("#input-line");

    var init = function(){
        var t = getDayObj();
        $("#startDate").val(dateFormat(t.y,t.m,1,"-"));
        $("#endDate").val(dateFormat(t.y,t.m,t.d,"-"));
    };
    init();

    var refresh = function(){
        refreshChart();
    };
    inputLine.find("select").on("change", refresh);
    var prevVal;
    inputLine.find("input").on("keyup", function(e){
        if(e.keyCode == 13){//Enter
            prevVal && $(this).val(prevVal);
            refresh();
        }
        prevVal = $(this).val();
    }).on("focus", function(){
        prevVal = null;
    });
    $("#startDate").on("click", function(){
        WdatePicker({
            maxDate:'#F{$dp.$D(\'endDate\')||$dp.$DV(\'%y-%M-%d\',{d:-1}) }',
            onpicked: function(){
                refresh();
            }
        });
    });
    $("#endDate").on("click", function(){
        WdatePicker({
            minDate:'#F{$dp.$D(\'startDate\')}',
            maxDate:'%y-%M-{%d}',
            onpicked: function(){
                refresh();
            }
        });
    });

    $("#print").on("click", function(){
        chart.print();
    });

    refreshChart();

});