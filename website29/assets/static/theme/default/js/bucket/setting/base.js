$(function () {
	var curtain = $("#curtain");
	curtain.bindCurtainSwitches([$("#set-style")], [$("#close-btn"), curtain.find(".cancel")]);

	var set_Sep = function(bucketName, sep, success, fail){
		postData({}, "/api/pub/separator/"+bucketName+"/sep/"+$.base64.encode(sep), function(result){
			//...
			if(success) success(result);
		}, fail);
	};
	
	$("#sep-submit").on("click", function(){
		var separator = "";
		$("#ops-block").find("input[type=checkbox]").each(function(){
			var sep = $(this);
			if(sep[0].checked) separator += sep.val();
		});
		set_Sep(_bucketName, separator, function(result){
			model.getCertainBucket(_bucketName);
			curtain.curtainHide();
		}, function(error){
			$.alert(error);
		});
	});
});