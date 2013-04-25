var checkOff = function(){
	var onKeys = $(".key-card").not(".off");
	if(onKeys.length<=1){
		onKeys.find(".key-switch").addClass("disabled");
	}else{
		onKeys.find(".key-switch").removeClass("disabled");
	}
};

model.todo.Register("appInfoReady", function(){
	checkOff();
});
$(function () {
	model.getAppInfo();

	
	$("#key-switch").live("#key-switch", "click", function(){
		if ($(this).hasClass("disabled")) {
			$.alert("至少需保留一组可用key!");
			return false;
		};
		postData({
			app: "default",
			key: model.appInfo().key[0].accessKey,
			state: 1-model.appInfo().key[0].state
		}, "/api/uc/setKeyState", function(result){
			model.getAppInfo();
		}, function(err){
			model.getAppInfo();
			$.alert("出错了，错误信息：\n"+JSON.stringify(err));
		});
	});
	$("#key-switch2").live("#key-switch2", "click", function(){
		if ($(this).hasClass("disabled")) {
			$.alert("至少需保留一组可用key!");
			return false;
		};
		postData({
			app: "default",
			key: model.appInfo().key[1].accessKey,
			state: 1-model.appInfo().key[1].state
		}, "/api/uc/setKeyState", function(result){
			model.getAppInfo();
		}, function(err){
			model.getAppInfo();
			$.alert("出错了，错误信息：\n"+JSON.stringify(err));
		});
	});

	$("#remove-key").live("#remove-key", "click", function(){
		$.confirm("确定删除?", function(res){
			res && postData({
				app: "default",
				key: model.appInfo().key[0].accessKey
			}, "/api/uc/deleteAccess", function(result){
				model.getAppInfo();
			}, function(err){
				model.getAppInfo();
				$.alert("出错了，错误信息：\n"+JSON.stringify(err));
			});
		});
	});
	$("#remove-key2").live("#remove-key2", "click", function(){
		$.confirm("确定删除?", function(res){
			res && postData({
				app: "default",
				key: model.appInfo().key[1].accessKey
			}, "/api/uc/deleteAccess", function(result){
				model.getAppInfo();
			}, function(err){
				model.getAppInfo();
				$.alert("出错了，错误信息：\n"+JSON.stringify(err));
			});
		});
	});

	$("#new-key-card").live("#new-key-card", "click", function(){
		postData({
			app: "default"
		}, "/api/uc/newAccess", function(result){
			model.getAppInfo();
		}, function(err){
			model.getAppInfo();
			$.alert("出错了，错误信息：\n"+JSON.stringify(err));
		})
		return false;
	});

	$(".key-cover").live(".key-cover","click", function(){
		toggleSlide($(this));
	});

	$(".key-val").live(".key-val", "click", function(){
		$(this).select();
	});

	var toggleSlide = (function(){
		var left = true;

		return function(obj){
			if(left){
				obj.animate({
		        	right: "-120px"
		        }, 500);
		        left = false;
			}else{
				obj.animate({
		        	right: "-0px"
		        }, 500);
		        left = true;
			}
		};
	})();
});