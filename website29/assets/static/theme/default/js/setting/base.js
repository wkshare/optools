function Contact(c){
	this.email = c.email;
	this.fullname = c.fullname;
	this.phone_number = c.phone_number;
	this.im_category = c.im_category;
	this.im_number = c.im_number;
	this.gender = c.gender;
	this.contact_type = c.contact_type;
}
function DeveloperInfo(d){
	this.email = d.email;
	this.fullname = d.fullname;
	this.phone_number = d.phone_number;
	this.im_category = d.im_category;
	this.im_number = d.im_number;
	this.company_category = d.company_category;
	this.company_size = d.company_size;
	this.company_name = d.company_name;
	this.website = d.website;
	this.created_at = d.created_at;
	this.isactived = d.isactived;
	this.ispro = d.ispro;
	this.gender = d.gender;

	this.contacts = [];
	if(d.contacts){
		for (var i = 0, l = d.contacts.length; i < l; i++) {
			this.contacts.push(new Contact(d.contacts[i]));
		};
	}
}

model.developerInfo = ko.observable(null);
model.getDeveloperInfo = function(callback, fail){
	var self = this;
	var mail = self.mail();
    self.status.setStatus("developerInfo", false);
	postData({
		email: mail
	},"/api/biz/developer/get", function(res){
		var d = new DeveloperInfo(res);
		self.developerInfo(d);
    	self.status.setStatus("developerInfo", true, d);
		callback && callback(d);
	}, function(err){
		log("Get developerInfo err: ", err);
		fail && fail(err);
	});
};
model.setDeveloperInfo = function(d, callback, fail){
	var self = this;
	postData(d,"/api/biz/developer/set", function(res){
		self.getDeveloperInfo();
		callback && callback(res);
	}, function(err){
		log("Set developerInfo err: ", err);
		fail && fail(err);
	});
};

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

model.inviteeNum = ko.observable(0);
model.inviteInfo = ko.observable(new InviteInfo());

var genInviteUrl = function(inviteInfo){
	return location.host + "/signup?code=" + inviteInfo.code;
};

var sendInvite = function(cnt, mailList, callback, fail){
	postData({
		content: cnt,
		receivers: mailList
	}, "/api/send_invite", callback, fail);
};

model.createInvite = function(callback, fail){
	var self = this;
	getData("/api/biz/invitemgr/create", function(result){
		log("Invite created.");
    	callback && callback(result);
	}, function(err){
		log("Create invite fail.");
    	fail && fail(err);
	});
};

model.updateInvite = function(callback, fail){
	var self = this;
	getData("/api/biz/invitemgr/update", function(result){
		log("Invite updated.");
    	callback && callback(result);
	}, function(err){
		log("Update invite fail.");
    	fail && fail(err);
	});
};

model.getInviteeNum = function(callback, fail){
	var self = this;
    self.status.setStatus("inviteeNum", false);
	getData("/api/biz/invitemgr/invitees_count", function(result){
		self.inviteeNum(result.count);
    	self.status.setStatus("inviteeNum", true);
    	callback && callback(result.count);
	}, function(err){
		log("Get invitee num fail.");
    	fail && fail(err);
	});
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

var checkExpired = function(inviteInfo){
	return Date.now() > inviteInfo.deadline*1000;
};

$(function () {
	$(".main-val").on("focus", function(){
		$(this).addClass("active");
		$(this).next(".add-val").addClass("active");
		$(this).parent(".value").next(".icon-pencil").addClass("active");
	}).on("blur", function(){
		$(this).removeClass("active");
		$(this).next(".add-val").removeClass("active");
		$(this).parent(".value").next(".icon-pencil").removeClass("active");
	});
	$(".add-val").on("focus", function(){
		$(this).addClass("active");
		$(this).prev(".main-val").addClass("active");
		$(this).parent(".value").next(".icon-pencil").addClass("active");
	}).on("blur", function(){
		$(this).removeClass("active");
		$(this).prev(".main-val").removeClass("active");
		$(this).parent(".value").next(".icon-pencil").removeClass("active");
	});

	var valuesIn = $("[name]");
	valuesIn.on("change", function(){
		$("#save").enable();
	});

	$("#save").on("click", function(){
		var newDeveloperInfo = model.developerInfo();
		valuesIn.each(function(){
			var valueIn = $(this);
			var name = valueIn.attr("name");
			var val = valueIn.val();
			newDeveloperInfo[name] = val;
		});
		log(newDeveloperInfo);
		model.setDeveloperInfo(newDeveloperInfo, function(){
			$.alert("已保存");
			$("#save").disable();
		}, function(err){
			$.alert("保存失败，请重试");
		});
	});

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

	var getDeveloperInfo = function(){
		model.getDeveloperInfo(function(d){
			$.each(d, function(key, val){
				$("[name="+key+"]").val(val);
			});
		}, function(err){});
	};
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
	var getInviteeNum = function(){
		model.getInviteeNum();
	};

	getDeveloperInfo();
	getInviteInfo();
	getInviteeNum();
});