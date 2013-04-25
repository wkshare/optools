$(function () {
	model.activeCoupon = function(serial_num, id, desc, callback, fail){
		desc = desc || "开发者后台激活优惠券";
		postData({
			serial_num: serial_num,
			id: id,
			desc: desc
		},"/api/wallet/active_coupon", function(res){
	    	callback(res);
		}, function(err){
			log("activeCoupon: ", err);
			fail(err);
		});
	};

	$("#voucher-number-in").on("keyup", function(){
		var number = $(this).val();
		$("#use-voucher").setable(number);
	});


	$("#use-voucher").on("click", function(){
		var number = $("#voucher-number-in").val();
		var numberPattern = /^[\d]+$/;

		if(!numberPattern.test(number)){
			$.alert("号码格式错误");
			return false;
		}

		model.activeCoupon(genSerialNum(), number, "", function(res){
			model.getCoupons();
	    	$("#voucher-number-in").val("");
	    	$("#voucher-number-in").trigger("keyup");
		}, function(err){
			log("激活失败: " + JSON.stringify(err));
			$.alert("激活失败");
			$("#voucher-number-in").val("");
	    	$("#voucher-number-in").trigger("keyup");
		});
	});

    model.getCoupons();
});