$(function() {
	var refresh_vertification = function(){
		var vertification_pic = $("#vertification-pic");
		vertification_pic.attr("src", "/verifycode?rd=" + Math.random());
	};
	$("#refresh-vertification").on("click", refresh_vertification);
	$("#vertification-pic").on("click", refresh_vertification);

	//$("#acc-type-setter > .acc-type").bindRadio($("#acc-type-value > input[type=radio]"), 0, "active");

	var checkRegistered = function(mail, callback){
		postData({id:mail}, "/api/account/admin/checkuid", function(res){
			var isRegistered = res["result"];
			callback(isRegistered);
		});
	};

	$("input[name=email]").blur(function(){
		var email_in = $(this);
		var error_out = email_in.siblings(".error");
		var mail = email_in.val();
		checkRegistered(mail, function(isRegistered){
			var error = "";
			if(isRegistered){
				error = "该邮箱已被注册!";
				email_in.focus().select();
			}else{
				error = "";
			}
			error_out.text(error);
		});
	});

});