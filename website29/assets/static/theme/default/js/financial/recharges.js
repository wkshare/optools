var refresh = function(){
    var s = $("#startDate").val();
    var e = $("#endDate").val();

    var genTimeStamp = function(date, includeTheDay){
        includeTheDay = includeTheDay || false; 

        var dateObj = new Date();
        var arr = date.split("-");
        dateObj.setFullYear(parseInt(arr[0]));
        dateObj.setMonth(parseInt(arr[1])-1);
        dateObj.setDate(parseInt(arr[2]));

        dateObj.setHours(includeTheDay ? 24 : 0);
        dateObj.setMinutes(0);
        dateObj.setSeconds(0);

        return dateObj.valueOf()*10000;
    }

    model.getBills(genTimeStamp(s),genTimeStamp(e, true),null, null,false);
};

$(function () {
	var init = function(){
        var t = getDayObj();
        $("#startDate").val(dateFormat(t.y,t.m,1,"-"));
        $("#endDate").val(dateFormat(t.y,t.m,t.d,"-"));

        refresh();
    };

    var prevVal;
    $(".inner-block-head").find("input").on("keyup", function(e){
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
    
    init();
});