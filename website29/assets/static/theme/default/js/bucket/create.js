var checkValid = function(){
	var bucketName_pattern = /^[a-zA-Z0-9][a-zA-Z0-9\+\-]*$/;
	var bucketNameIn = $("#bucketname-in");
	var bucketName = bucketNameIn.val();

	if(!bucketName_pattern.test(bucketName)){
		$(".error").text("空间名不符规范").show();
		bucketNameIn.focus();
		return false;
	}
};

$(function () {
	
});