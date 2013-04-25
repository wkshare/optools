model.certainWlist = ko.observableArray([]);
model.certainBlist = ko.observableArray([]);

var getStatus = function(status) {
	switch (status) {
		case 0: {
			return "已拒绝";
		}
		case 1: {
			return "确认中";
		}
		case 2: {
			return "已通过";
		}
		default: {
			return status;
		}
	}
};

model.getCertainList = function(bucketName){
	postData({
		bucket: bucketName
	},"/api/biz/bwlist/get", function(domains){
		model.certainWlist([]);
		model.certainBlist([]);
		if(domains){
			//domains.sort(function(a,b){return a.create_time < b.create_time;});
			for(var i=0,l=domains.length;i<l;i++){
				if(domains[i].type==1){
					model.certainWlist.push(domains[i]);
				}else if(domains[i].type==2){
					model.certainBlist.push(domains[i]);
				}
			}
		}
	}, function(err){
		log("获取列表失败", err);
	});
};
model.addCertainList = function(bucketName, domain, type, callback, fail){
	postData({
		bucket: bucketName,
		type: type,
		domain: domain
	},"/api/biz/bwlist/add", function(result){
		model.getCertainList(bucketName);
		if(callback) callback(result);
	}, function(err){
		log("添加失败", err);
		if(fail) fail(err);
	});
};
model.removeCertainList = function(bucketName, id, callback, fail){
	log("remove", id);
	postData({
		_id: id
	},"/api/biz/bwlist/delete", function(result){
		model.getCertainList(bucketName);
		if(callback) callback(result);
	}, function(err){
		log("删除失败", err);
		if(fail) fail(err);
	});
};

$(function(){

	var curtain = $("#add-list-curtain");
	var submit = curtain.find("#add-submit");
	var domainIn = curtain.find("[name=domain]");
	var domainError = $("#domain-error");

	curtain.bindCurtainSwitches(
		[$("#add-wlist"), $("#add-blist")],
		[curtain.find(".close-box"), curtain.find(".cancel")], 
		function(){
			domainIn.val("");
			domainError.hide();
		}
	);

	domainIn.on("keyup", function(){
		if($(this).val()){
			submit[0].disabled = false;
		}else{
			submit[0].disabled = true;
		}
	});

	submit.on("click", function(){
		var domainPattern = /^[\w\.\-]+$/;
		var domain = domainIn.val();
		if(!domainPattern.test(domain)){
			domainError.text("输入格式错误").show();
			return false;
		}

		var type = model.certainBucket().anti_leech_mode();
		model.addCertainList(_bucketName, domain, type, function(){
			curtain.curtainHide();
		});
	});

	model.getCertainList(_bucketName);

	var setPrivate = function(bucketName, private, success, fail){ //private: 0/1 -> public/private
		postData({
			bucket : bucketName,
			private : private
		}, "/api/uc/private", function(result){
			if(success) success(result);
		}, function(error){
			if(fail) fail(error);
		});
	};

	var setMode = function(bucketName, mode, success, fail){
		postData({
			bucket : bucketName,
			mode : mode
		}, "/api/uc/antiLeechMode", function(result){
			if(success) success(result);
		}, function(error){
			if(fail) fail(error);
		});
	};

	$("#bucket-limit-setter > .bucket-limit").bindRadio($("#bucket-limit-value > input[type=radio]"), null, "active", function(i,setter){
		var private = setter.attr("value")=="private" ? 1 : 0;

		setPrivate(_bucketName, private, function(result){
			model.getCertainBucket(_bucketName);
		}, function(error){
			$.alert("设置失败");
			model.getCertainBucket(_bucketName);
		});
	}, function(i,setter,callback){
		var private = setter.attr("value")=="private" ? 1 : 0;
		$.confirm("确定将空间设置为" + (private ? "私有" : "公开") + "?", callback);
	});

	$("body").delegate(".domain-delete", "click", function(){
		var id = $(this).prev("span").attr("id");

		$.confirm("确定删除?", function(res){
			res && model.removeCertainList(_bucketName, id, function(result){
			}, function(err){
				$.alert("删除未成功<br/>错误："+JSON.stringify(err));
			});
		});
	});

	var modesName = ["不限制", "白名单", "黑名单"];
	var modes = $("#protect-mode-setter > .protect-mode").bindRadio($("#protect-mode-value > input[type=radio]"), null, "active", function(i,setter){
		setMode(_bucketName, i, function(result){
			//$.alert("切换成功");
			model.getCertainBucket(_bucketName);
			setter.trigger("checkout");
		}, function(error){
			$.alert("切换失败");
			model.getCertainBucket(_bucketName);
		});
	}, function(i,setter,callback){
		$.confirm("确定切换到" + modesName[i] + "模式?", callback);
	});
	var modeHandler = $("#protect-mode-setter > .protect-mode").checkout($("#mode-lists > .list"), null, "active", "checkout");

	model.todo.Register("certainBucketReady", function(bucket){
		var index = bucket.anti_leech_mode();
		modes.set(index);
		modeHandler.checkoutIndex(index);
	});
});