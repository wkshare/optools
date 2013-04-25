var refresh = function(){
    var m = $("#billMonth").val();

    var s = m+"-1";

    var nextMonth = function(ym, skip){
        skip = skip || 1;
        ymArr = ym.split("-");
        var y = parseInt(ymArr[0]);
        var m = parseInt(ymArr[1]);
        m+=skip;
        while(m>12){
            m-=12;
            y++;
        }
        return [y,m].join("-");
    };

    var e = nextMonth(s)+"-1";

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
        dateObj.setMilliseconds(0);

        return dateObj.valueOf()*10000;
    };

    model.getBills(genTimeStamp(s),genTimeStamp(e),null, null,true);
};

$(function () {
    var init = function(){
        var t = getDayObj();
        $("#billMonth").val([t.y,( t.m<10 ? "0"+t.m : "" + t.m )].join("-"));

        refresh();
    };

    $("#billMonth").on("click", function(){
        WdatePicker({
            dateFmt: 'yyyy-MM',
            maxDate:'%y-%M-{%d}',
            onpicked: function(){
                refresh();
            }
        });
    });

    $("#print").on("click", function(){
        $(".printArea").printArea();
    });
    
    init();
});