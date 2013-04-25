model.currentPackage = ko.observable(null);
model.todo.Register("packagesReady", function(packages){
	var currentPackage;
	$.each(packages, function(i, package){
		if(package.id == _package_id){
			currentPackage = package;
		}
	});
	if(!currentPackage){
		$.alert("选择的套餐有误，点击确定返回重新选择套餐", function(){
			location.pathname="/financial/package";
		});
	}else{
		model.currentPackage(currentPackage);
	}
});
model.todo.Register("packagesReady", function(packages){
	var payTypeCtl = $(".pay-choice").checkout($(".pay-tab"));

	$("#use_balance").on("change", function(){
		if($(this).check()){
			$("#remain-num-line").show();
		}else{
			$("#remain-num-line").hide();
		}
	});
});

$(function(){
	model.getPackages();
});