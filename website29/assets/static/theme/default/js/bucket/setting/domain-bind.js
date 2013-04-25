model.certainCustomDomains = ko.observableArray([]);
model.getCertainCustomDomains = function(bucketName){
	postData({
		bucket: bucketName
	},"/api/biz/cdomain/get", function(domains){
		if(domains){
			model.certainCustomDomains(domains);
		}else{
			model.certainCustomDomains([]);
		}
	}, function(){
		log("获取审核中自定义域名列表失败");
	});
};

$(function () {
	var level2_agree = $("#level2-agree");
	var level2_submit = $("#level2-submit");
	var level2_in = $("input[name=level2_domain]");
	level2_agree.change(function(){
		if(this.checked) level2_submit.attr("disabled",false);
		else level2_submit.attr("disabled",true);
	});
	var custom_agree = $("#custom-agree");
	var custom_submit = $("#custom-submit");
	var custom_in = $("input[name=custom_domain]");
	custom_agree.change(function(){
		if(this.checked) custom_submit.attr("disabled",false);
		else custom_submit.attr("disabled",true);
	});

	model.getCertainCustomDomains(_bucketName);

	var level2_curtain = $("#level2-domain-setting-curtain");
	level2_curtain.bindCurtainSwitches(
		[$("#set-level2-domain")],
		[level2_curtain.find(".close-box"), level2_curtain.find(".cancel")], 
		function(){
			level2_agree.check(false);
			var initVal = model.certainBucket() && model.certainBucket().bind_domains() ? model.certainBucket().bind_domains().level2.split(".")[0] : "";
			level2_in.val(initVal);
		}
	);

	var custom_curtain = $("#custom-domain-setting-curtain");
	custom_curtain.bindCurtainSwitches(
		[$("#set-custom-domain")],
		[custom_curtain.find(".close-box"), custom_curtain.find(".cancel")], 
		function(){
			custom_agree.check(false);
			custom_in.val("");
		}
	);

	var cancelDomainBind = function(id, domain, success, fail){
		postData({
			_id: id,
			domian: domain,
			bucket: _bucketName
		},"/api/biz/cdomain/delete", function(result){
			model.getCertainCustomDomains(_bucketName);
			if(success) success(result);
		}, function(error){
			log(error);
			if(fail) fail(error);
		});
	};

	var deleteDomainBind = function(domain, success, fail){
		domain = $.base64.encode(domain);
		postData("","/api/rs/unpublish/"+domain, function(result){
			if(success) success(result);
		}, function(error){
			log(error);
			if(fail) fail(error);
		});
	};

	var addDomainBind = function(bucketName, domain, success, fail){
		//domain = $.base64.encode(domain);
		postData({
			publish: domain,
			from: bucketName
		},"/api/rs/admin/publish", function(result){
			log(result);
			if(success) success(result);
		}, function(error){
			log(error);
			if(fail) fail(error);
		});
	};

	var addCustomDomainBind = function(bucketName, domain, success, fail){
		//domain = $.base64.encode(domain);
		postData({
			domain: domain,
			bucket: bucketName
		},"/api/biz/cdomain/add", function(result){
			model.getCertainCustomDomains(_bucketName);
			if(success) success(result);
		}, function(error){
			log(error);
			if(fail) fail(error);
		});
	};

	$("body").delegate(".domain-delete", "click", function(){
		var domain = $(this).prev("span").text();

		$.confirm("确定删除该域名绑定?", function(res){
			res && deleteDomainBind(domain, function(result){
				model.getCertainBucket(_bucketName);
			}, function(){
				$.alert("Failed.");
			});
		});
	});

	$("body").delegate(".domain-cancel", "click", function(){
		var id = $(this).prev("span").attr("_id");
		var domain = $(this).prev("span").text();

		$.confirm("该域名绑定还在审核中，确定删除?", function(res){
			res && cancelDomainBind(id, domain, function(result){
			}, function(){
				$.alert("删除失败");
			});
		});
	});
	
	level2_submit.on("click", function(){
		var level2Pattern = /^[a-zA-Z0-9][a-zA-Z0-9\+\-]*$/;
		if(!level2Pattern.test(level2_in.val())) {
			$("#level2-bind-error").text("输入格式不正确!");
			return false;
		}
		var domain = model.certainBucket().bind_domains().level2;
		var new_domain = level2_in.val() + level2_in.next().text();

		if(domain==new_domain) {
			$("#bind-error").text("与原有域名相同!");
			return false;
		}

		if(domain){
			deleteDomainBind(domain, function(result){
				model.getCertainBucket(_bucketName);
			}, function(){
				$.alert("Delete failed.");
			});
		}
		addDomainBind(_bucketName, new_domain, function(result){
			model.getCertainBucket(_bucketName);
			level2_curtain.curtainHide();
		}, function(error){
			$.alert("Add failed.");
		});
	});

	custom_submit.on("click", function(){
		var customPattern = /^[\w\.]+$/;
		if(!customPattern.test(custom_in.val())) {
			$("#custom-bind-error").text("输入格式不正确!");
			return false;
		}
		var domain = custom_in.val();

		addCustomDomainBind(_bucketName, domain, function(result){
			//model.getCertainBucket(_bucketName);
			custom_curtain.curtainHide();
		}, function(error){
			$.alert("Bind failed.");
		});
	});
});