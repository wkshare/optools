model.price = ko.observable(new Price());
model.getPrice = function(){
	postData({time:Date.now()*10000},"/api/price/get",function(res){
		var info;
		for (var i = 0, l = res.units.length; i < l; i++) {
			var unit = res.units[i];
			if(unit.type == "base"){
				info = JSON.parse(unit.info);
			}
		};
		model.price(new Price(info));
	},function(err){
		log("获取价格信息出错", err);
	});
};

$(function(){
	model.getPrice();
});