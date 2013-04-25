function formatTime(t){
	var date = new Date(Math.floor(t/10000));
	return dateFormat(date.getYear()+1900, date.getMonth()+1, date.getDate(), "-");
}

function formatMoney(m){
	return m/10000;
}

function genSerialNum(){
	return getDay()+random(0,10)+random(0,10)+random(0,10)+random(0,10);
}

function genPriceArray(arr, hex, units){
	if(!arr) return [];

	var max, min = 0;
	for (var i = 0, l = arr.length; i < l; i++) {
		arr[i].min = format(min, hex, units, 0);
		arr[i].max = format(arr[i].range, hex, units, 0);
		min = arr[i].range;

		arr[i].price = arr[i].price/10000

		arr[i].isLast = (i==l-1);
	};

	return arr;
}

function Price(info){
	info = info || {};
	this.apiGet = ko.observableArray(genPriceArray(info.api_get, 1000, ["次", "千次"]) || []);
	this.apiPut = ko.observableArray(genPriceArray(info.api_put, 1000, ["次", "千次"]) || []);
	this.space = ko.observableArray(genPriceArray(info.space, storageHex, ["GB", "TB"]) || []);
	this.transferOut = ko.observableArray(genPriceArray(info.transfer_out, storageHex, ["GB", "TB"]) || []);
}

function Bill(b){
	this.serial_num = b.serial_num;
	this.prefix = b.prefix;
	this.type = b.type;
	this.uid = b.uid;
	this.money = formatMoney(b.money);
	this.timeStamp = b.time;
	this.time = formatTime(b.time);
	this.desc = b.desc;
	this.details = b.details;
	this.balance = 0;

	this.op = typeof paymentType !== "undefined" ? (paymentType[b.type] || "其他来源") : b.type;
	this.status = ko.observable("");
	this.create_time = ko.observable("");
	this.update_time = ko.observable("");
	this.apply = ko.observable(false);
}

function Coupon(c){
	this.id = c.id;
	this.uid = c.uid;
	this.quota = formatMoney(c.quota);
	this.balance = formatMoney(c.balance);
	this.effecttimeStamp = c.effecttime;
	this.effecttime = formatTime(c.effecttime);
	this.deadtimeStamp = c.deadtime;
	this.deadtime = formatTime(c.deadtime);
	this.day = c.day;
}

function Package(p){
	this.id = p.id;            // ID
	this.desc = p.desc;          // 相关描述
	this.deadtime = p.deadtime;       // 结束有效时间, 100ns
	this.money = formatMoney(p.money);          // 套餐金额, Yuan
	this.space = p.space;          // 空间额度, GB
	this.transferOut = p.transfer_out;   // 流量额度, GB
	this.bandwidth = p.bandwidth;      // 带宽额度
	this.apiGet = p.api_get;        // get请求数额度, 1000次
	this.apiPut = p.api_put;         // put请求数额度, 1000次
}

$(function(){
	model.bills = ko.observableArray([]);
	model.coupons = ko.observableArray([]);
	model.packages = ko.observableArray([]);

	model.getBills = function(starttime, endtime, prefix, type, expenses){
		var self = this;
    	self.status.setStatus("bills", false);
		postData({
			starttime: starttime || ((new Date(Date.now())).setDate(1)*10000),
			endtime: endtime || (getDayObj().value*10000),
			prefix: prefix || "",
			type: type || "",
			expenses: expenses || false
		},"/api/wallet/get_bills", function(bills){
			model.bills([]);
			if(bills){
				for (var i = 0, l=bills.length; i < l; i++) {
					model.bills.push(new Bill(bills[i]));
				};
			}
    		self.status.setStatus("bills", true, model.bills());
		}, function(){
			log("获取记录失败");
		});
	};
	model.getCoupons = function(starttime, endtime){
		var self = this;
    	self.status.setStatus("coupons", false);
		postData({
			starttime: starttime || ((new Date(0)).valueOf()*10000),
			endtime: endtime || ((new Date()).valueOf()*10000)
		},"/api/wallet/get_coupons", function(coupons){
			model.coupons([]);
			if(coupons){
				for (var i = 0, l=coupons.length; i < l; i++) {
					model.coupons.push(new Coupon(coupons[i]));
				};
			}
    		self.status.setStatus("coupons", true, model.coupons());
		}, function(){
			log("获取记录失败");
		});
	};
	model.getPackages = function(){
		var self = this;
    	self.status.setStatus("packages", false);
		postData({time:Date.now()*10000},"/api/price/get",function(res){
			var info;
			for (var i = 0, l = res.units.length; i < l; i++) {
				var unit = res.units[i];
				if(unit.type == "package"){
					info = JSON.parse(unit.info);
					info.deadtime = unit.deadtime;
					model.packages.push(new Package(info));
				}
			};
    		self.status.setStatus("packages", true, model.packages());
		},function(err){
			log("获取套餐信息出错", err);
		});
	};
});
