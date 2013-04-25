function InviteInfo(info){
    info = info || {};
    this.id = info._id || "";
    this.code = info.code || "";
    this.deadline = info.deadline || 0;
    this.rule = info.rule || [];
    this.invitees = info.invitees || [];
    var reward = {};
    $.each(this.invitees, function(i, invitee){
        if(invitee.rewarded){
            $.each(invitee.rule, function(j, rule){
                var type = rule.type;
                var value = rule.value;
                if(reward[type]){
                    reward[type] += value;
                }else{
                    reward[type] = value;
                }
            });
        }
    });
    this.reward = reward;


    this.create_time = info.create_time || 0;
    this.update_time = info.update_time || 0;
}

model.inviteInfo = ko.observable(new InviteInfo());

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

model.getMoneyInfo = function(from, to, p){
	var self = model;
    self.status.setStatus("moneyInfo", false);

    var d = new Date();
    d.setFullYear(d.getFullYear()-1);

	postData({
		from: from || getDay(0,d),
		to: to || getDay(),
		p: p || "month"
	}, "/api/stats/select/money", function(res){

    	self.status.setStatus("moneyInfo", true, res);
	}, function(err){
		log("err: ", err);
	})
};

model.getInviteInfo = function(callback, fail){
    var self = this;
    self.status.setStatus("inviteInfo", false);
    getData("/api/biz/invitemgr/info", function(result){
        var inviteInfo = new InviteInfo(result);
        self.inviteInfo(inviteInfo);
        self.status.setStatus("inviteInfo", true);
        callback && callback(inviteInfo);
    }, function(err){
        log("Get invite info fail.");
        fail && fail(err);
    });
};

model.todo.Register("moneyInfoReady", function(data){

	if(data.data.length === 0){return false;}
	var Data = [];
    for (var i = 0; i < data.data.length; i++) {
        Data[i] = [data.time[i] * 1000, data.data[i]/10000];
    }

	var chart = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            type: 'spline',
            renderTo: 'money-info-chart'
        },
        title: {
            text: ''
        },
        xAxis: {
        	type: "datetime",
            title: {
                text: null
            },
            labels: {
            	step: -1,
		        formatter: function() {
                	var s = Highcharts.dateFormat('%Y-%m',this.value);
	                return s;
		        }
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
                var s = '<b>' + Highcharts.dateFormat('%Y-%m',this.x) + '</b>';
                $.each(this.points, function(i, point) {
                    s += '<br/>' + point.series.name + ': ' + point.y + "元";
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
            name: '费用',
            data: Data
        }]
    });
});

var genInviteUrl = function(inviteInfo){
    return location.host + "/signup?code=" + inviteInfo.code;
};

var sendInvite = function(cnt, mailList, callback, fail){
    postData({
        content: cnt,
        receivers: mailList
    }, "/api/send_invite", callback, fail);
};

var checkExpired = function(inviteInfo){
    return Date.now() > inviteInfo.deadline*1000;
};

$(function() {
    model.getBalance();
    model.getBills();
    model.getMoneyInfo();

    var curtain = $("#curtain");
    curtain.bindCurtainSwitches([$("#invite")], [$("#close-btn"), curtain.find(".cancel")]);

    $("#invite-url").on("click", function(){
        $(this).select();
    });
    /*$("#select-url").on("click", function(){
        $("#invite-url").select();
    });*/
    $("#send-invite").on("click", function(){
        var mailList = $("#mail-list-in").text().split(",");
        log($("#mail-list-in").text(), mailList);//----------------
        var cnt = "???";
        sendInvite(cnt, mailList, function(res){
            $.alert("邀请已发送！")
        }, function(err){
            $.alert("出现了未知错误。");
        });
    });

    var getInviteInfo = function(){
        model.getInviteInfo(function(inviteInfo){
            if(checkExpired(inviteInfo)){
                model.updateInvite(function(){
                    getInviteInfo();
                }, function(){});
            }
        }, function(){
            model.createInvite(function(){
                getInviteInfo();
            }, function(){});
        });
    };
    getInviteInfo();

});