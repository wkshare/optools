var upload;

model.currentPrefix = ko.observable("");

model.certainPageFiles = ko.computed(function() {
	return this.certainFiles()[this.certainPageIndex()] || [];
}, model);

model.isFilesEmpty = ko.computed(function() {
	var arr = this.certainFiles();
	return arr.length == 0 || arr[0].length == 0;
}, model);

function isImage(url){
	var imageSuffixes = ["png", "jpg", "gif", "bmp"];
	var suffixMatch = /\.([a-zA-Z0-9]+)(\?|\@|$)/;
	var suffix = "";

	if(!suffixMatch.test(url)) return false;

	var res = suffixMatch.exec(url);
	suffix = res[1].toLowerCase();

	for(var i=0,l=imageSuffixes.length;i<l;i++){
		if(suffix == imageSuffixes[i]){
			return true;
		}
	}
	return false;
}

function isEmpty(arr){
	return arr.length == 0 || arr[0].length == 0;
}

var triggerChange = function(resource){
	resource(resource());
};

model.certainFile = ko.observable({
	name: function(){
		return null;
	},
	url: function(){
		return null;
	},
	createTime: function(){
		return null;
	},
	size: function(){
		return null;
	}
});

model.setCertainFile = function(file){
	if(model.certainFile() && model.certainFile().name() == file.name()) return true;
	model.certainFile(file);
	return true;
};

$(function () {
	/**
	 * Add funcs
	 */
	var checkAll = $("#check-all");

	var fileNumInPage = 10;
	model.numInPage(fileNumInPage);

	var getCheckedNum = function(){
		return $(".check-one:checked").length;
	};

	var checkStatus = function(){
		var checked = getCheckedNum()>0;
		checkAll.checkVal(checked);
		if(checked){
			$(".hidden-op").show();
		}else{
			$(".hidden-op").hide();
		}
	};

	var addChecked = function(row){
		row.addClass("active");
	};

	var removeChecked = function(row){
		row.removeClass("active");
	}

	checkAll.change(function(){
		var val = $(this).checkVal();
		$(".check-one").check(val); 
	});

	$(".check-one").live(".check-one", "change", function(){
		if($(this).check()){
			addChecked($(this).parents("tr"));
		}else{
			removeChecked($(this).parents("tr"));
		}
		checkStatus();
	});

	$("[type=checkbox]").live("[type=checkbox]", "click", function(e){
		e.stopPropagation();
	});

	$(".file-row").live(".file-row", "click", function(){
		checkAll.check(false);
		$(this).find(".check-one").click();
	});

	$(".check-col").live(".check-col", "click", function(e){
		$(this).find("[type=checkbox]").click();
		e.stopPropagation();
	});

	var initChosen = function(){
		checkAll.checkVal(false);
		model.certainFile(null);
	};

	var refreshFiles = function(model, bucket, prefix) {
		$("#table-bg-word").hide();
		//var prefix = $("#searchBucketNamePrefix").val();
		initChosen();

		//model.currentPrefix(prefix);
		model.certainFiles([]);
		model.getCertainFiles(bucket, prefix, fileNumInPage, function(){
			checkStatus();
			$("#table-bg-word").show();
		}, function(){
			$("#table-bg-word").show();
		}, true);
		log("~");//----------------------------
	};

	var deleteCertainFile = function(key, bucket, callback){
		var entryURI = URLSafeBase64Encode(bucket+":"+key);
		
		postData({}, "/api/rs/delete/"+entryURI, function(){
			$.each(model.certainPageFiles(), function(i,certainPageFile){
				if(certainPageFile && certainPageFile.name() == key){
					refreshFiles(model, _bucketName);
				}
			});

			if (callback) callback();
		});
	};

	var renameCertainFile = function(key, newKey, bucket, callback){
		var entryURI = URLSafeBase64Encode(bucket+":"+key);
		var entryURI2 = URLSafeBase64Encode(bucket+":"+newKey);
		
		postData({}, "/api/rs/move/"+entryURI+"/"+entryURI2, function(){
			$.each(model.certainPageFiles(), function(i,certainPageFile){
				if(certainPageFile && certainPageFile.name() == key){
					certainPageFile.name(newKey);
					triggerChange(model.certainFiles);
				}
			})

			if (callback) callback();
		});
	};

	/**
	 * get files
	 * & to pages
	 */

	refreshFiles(model, _bucketName);

	var certainPageIndex = 0;
	var hash = location.hash;
	var pattern = /^(\#)(\d+)$/;
	if(pattern.test(hash)){
		var p = parseInt(pattern.exec(hash)[2])-1;
		certainPageIndex = p>=0 ? p : certainPageIndex;
	}

	var setHash = function(index){
		if(location.hash !== "#" + (index+1))
			location.hash = "#" + (index+1);
	};

	var setCertainPageIndex = function(index) {
		var pageNum = model.certainFiles().length;
		var hasMore = model.certainBucketHasMore();

		if(pageNum==0){
			setHash(0);
			model.certainPageRange({
				min: 0,
				max: 0
			});
			return false;
		}

		if(index>=0 && index<pageNum){
			model.certainPageIndex(index);
			setHash(index);

			initChosen();

			var min = index >= 5 ? index-5 : 0;
			var max = min + 9;

			model.certainPageRange({
				min: min,
				max: max
			});
		}else{
			if(index>=pageNum && !hasMore){
				setCertainPageIndex(0);
			}
		}

		if(hasMore && index >= (pageNum - 3)){
			var t = (Math.floor((index - pageNum + 3)/10)+1) * 10;
			model.getCertainFiles(_bucketName, model.currentPrefix(), t, function(){
				setCertainPageIndex(index);
			});
			log("-");//------------------------
		}
	};

	model.todo.Register("certainFilesReady", function(){
		if(model.certainFiles()) setCertainPageIndex(certainPageIndex);
	});

	$(".page-link").live(".page-link", "click", function(){
		var index = parseInt($(this).attr("index"));
		setCertainPageIndex(index);
	});

	$("#first-page-link").live("#first-page-link", "click", function(){
		setCertainPageIndex(0);
	});
	$("#prev-link").live("#prev-link", "click", function(){
		setCertainPageIndex(model.certainPageIndex()-1);
	});
	$("#next-link").live("#next-link", "click", function(){
		setCertainPageIndex(model.certainPageIndex()+1);
	});

	/**
	 * bind ops -----------------------------------------------
	 */


	$(".more-ops").live(".more-ops", "click", function (e) {
		$(this).toggleClass("active");
		e.stopPropagation();
	});

	$(".more-ops").live(".more-ops", "mouseleave", function () {
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		}
	});

	$("[op=delete]").live("[op=delete]", "click", function(){
		var fileops = $(this).parents(".file-ops");
		var key = fileops.prev(".name").text();
		deleteCertainFile(key, _bucketName);
	});

	$("[op=rename]").live("[op=rename]", "click", function(){
		var fileops = $(this).parents(".file-ops");
		var key = fileops.prev(".name").text();
		$.prompt("请输入新的文件名：",key, function(key2){
			if(key2){
				renameCertainFile(key, key2, _bucketName);
			}
		});
	});

	$("#remove-all").on("click", function(){
		$(".check-one:checked").each(function(i, item){
			var td = $(this).parent();
			var key = td.next().find(".name").text();
			deleteCertainFile(key, _bucketName, function(){
				//td.parent().remove();
			});
		});
	});

	$("#refresh").on("click", function(){
		refreshFiles(model, _bucketName, model.currentPrefix());
	});

	$("#searchBucketNamePrefix").on("change", function(){
		if(model.currentPrefix() == $(this).val()) return false;
		model.currentPrefix($(this).val());
		refreshFiles(model, _bucketName, model.currentPrefix());
	});

	$("#searchBucketNamePrefix").on("keyup", function(){
		if(model.currentPrefix() == $(this).val()) return false;
		model.currentPrefix($(this).val());
		refreshFiles(model, _bucketName, model.currentPrefix());
	});


	var curtain = $("#curtain2");
	curtain.bindCurtainSwitches([$("#upload")], [curtain.find(".close-box"), curtain.find("#close")], null, function(){
		cancelQueue(upload);
		$(".progressWrapper").hide();
		refreshFiles(model, _bucketName);
	}, null, function(t, callback){
		if(upload.getStats().files_queued){
			$.confirm("当前有"+upload.getStats().files_queued+"个文件正在上传，关闭对话框将取消其上传，确定关闭？", callback);
		}else{
			callback(true);
		}

	});


	/**
	 * upload file --------------------------------------------------------------------
	 */

	upload = new SWFUpload({
		// Backend Settings
		upload_url: _uploadInfo.url,
		post_params: {},

		file_post_name : "file",

		// File Upload Settings
		file_size_limit : "102400000",	// 100MB
		file_types : "*.*",
		file_types_description : "所有文件类型",
		file_upload_limit : 0,
		file_queue_limit : 0,

		// Event Handler Settings (all my handlers are in the Handler.js file)
		swfupload_preload_handler : preLoad,
		swfupload_load_failed_handler : loadFailed,
		file_dialog_start_handler : fileDialogStart,
		file_queued_handler : fileQueued,
		file_queue_error_handler : fileQueueError,
		file_dialog_complete_handler : fileDialogComplete,
		upload_start_handler : uploadStart,
		upload_progress_handler : uploadProgress,
		upload_error_handler : uploadError,
		upload_success_handler : uploadSuccess,
		upload_complete_handler : uploadComplete,

		// Button Settings
		button_placeholder_id : "spanButtonPlaceholder",
		button_width: 80,
		button_height: 28,
		button_cursor : SWFUpload.CURSOR.HAND,
		button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,

		// Flash Settings
		flash_url : "/static/add-on/swfupload/swfupload.swf",
		flash9_url : "/static/add-on/swfupload/swfupload_fp9.swf",


		custom_settings : {
			progressTarget : "fsUploadProgress",
			cancelButtonId : "btnCancel",

			uploadToken : _uploadInfo.token || "noTokenGot",
			bucket : _bucketName
		},

		// Debug Settings
		debug: false
	});
});
