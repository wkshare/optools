$(function () {
	var agree_input = $("#agree_input");
	agree_input.change(function(){
		if(this.checked) $("#delete-bucket").attr("disabled",false);
		else $("#delete-bucket").attr("disabled",true);
	});
	
	$("#delete-bucket").on("click", function(){
		$.confirm("请再次确认是否删除本空间", function(res){
			res && postData({
				bucketname: _bucketName,
				agree: agree_input[0].checked
			}, "/bucket/setting/advanced?delete", function(data){
				if(data.success===true){
					$.alert("已成功删除!", function(){
						location.href="/";
					})
				}else{
					$.alert("未能成功删除")
					log(data.message);
				}
			});
		});
	});
});