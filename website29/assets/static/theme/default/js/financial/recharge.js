function checkValid(){
	var payNum = $("#amountIn").val();
	var payNumPattern = /^[\d]+(\.[\d]{1,2})?$/;
	if(!payNumPattern.test(payNum)){
		$(".error").text("请输入正确格式的充值金额，最多可到小数点后两位").show();
		return false;
	}
	return true;
};

var checkInput = function(){
	var paymentTypeChecked = false;
	$("[name=paymentType]").each(function(){
		if($(this).check()) paymentTypeChecked = true;
	});
	var amountInput = $("#amountIn").val() || false;
	$("#recharge").setable(paymentTypeChecked && amountInput);
};

$(function(){
	$("[name=paymentType]").first().check(true);
	$("input").on("keyup", checkInput);
	$("input").on("change", checkInput);
});