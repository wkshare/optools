$(function() {
	var refresh_vertification = function(){
		var vertification_pic = $("#vertification-pic");
		vertification_pic.attr("src", vertification_pic.attr("src"));
	};
	$("#refresh-vertification").on("click", refresh_vertification);
	$("#vertification-pic").on("click", refresh_vertification);

	var navInfo = getNavigator();
	var showTipTime = loadFromLocal("showTipTime","tip") || 0;
	if(navInfo.ie && navInfo.version<9 && showTipTime < 5){
		var tip = $("#top-tip");
		tip.html("您正在使用较低版本IE，为了获得更好的浏览体验，建议使用<a target='_blank' href='http://www.google.com/chrome/'>Chrome</a>、<a target='_blank' href='http://www.mozilla.org/en-US/firefox/new/'>firefox</a>，或<a target='_blank' href='http://windows.microsoft.com/zh-cn/internet-explorer/download-ie'>更高版本IE</a>。<span class='cancel'>我知道了</span>").slideDown();
		tip.find(".cancel").on("click", function(){
			saveToLocal("showTipTime",showTipTime+1,"tip");
			tip.slideUp();
		});
	}
});