var mkStyleParams = function(opts){
    opts = opts || {};
    var keys = ["thumbnail", "gravity", "crop", "quality", "rotate", "format"];
    var params_string = "", key = null, val = null;
    if (undefined !== opts.auto_orient && opts.auto_orient === true){
        params_string += "/auto-orient";
    }
    for (var i=0; i < keys.length; i++) {
        key = keys[i];
        if (opts[key] !== undefined && opts[key] !== "") {
            params_string += '/' + key + '/' + opts[key];
        }
    }
    return 'imageMogr' + params_string;
};

var parseStyle = function(style){
    var rules = style.split("/");
    var params = {};

    for(var i=0,l=rules.length;i<l;){
        if(rules[i]=="imageMogr"){
            i++;
        }else{
            if(rules[i]=="auto-orient"){
                params["autoOrient"] = true;
                i++;
            }else{
                params[rules[i]] = rules[i+1];
                i+=2;
            }
        }
    }

    return params;
};

var createStyle = function(name, style, callback, fail){
    name = URLSafeBase64Encode(name);
    style = URLSafeBase64Encode(style);

    postData({},"/"+style, function(result){
        if(callback) callback(result);
    }, function(err){
        if(fail) fail(err);
    });
};

var removeStyle = function(name, callback, fail){
    name = URLSafeBase64Encode(name);

    postData({},"/api/pub/unstyle/"+_bucketName+"/name/"+name, function(result){
        if(callback) callback(result);
    }, function(err){
        if(fail) fail(err);
    });
};

$(function() {
    curtain = $("#curtain");

    adaptationStyleSetter = $("#adaptation-style-setter > .adaptation-style").bindRadio($("#adaptation-style-value > input[type=radio]"), 0, "active");
    watermarkStyleSetter = $("#watermark-style-setter > .watermark-style").bindRadio($("#watermark-style-value > input[type=radio]"), 0, "active");
    watermarkPositionSetter = $("#watermark-position-setter > .watermark-position").bindRadio($("#watermark-position-value > input[type=radio]"), 0, "active");

    var errorInfo  = {};

    var showError = function(){
        if(errorInfo){
            $.alert(JSON.stringify(errorInfo).replace(/\"/g,""));
        }
        errorInfo = {};
    };

    var setError = function(err){
        errorInfo = err;
        log("err: ", errorInfo);        
    }

    var getStyle = function(){
        var width = $("input[name=width]").val();
        var height = $("input[name=height]").val();
        var thumbnail, gravity, crop;

        var adaptationMode = adaptationStyleSetter.getVal();
        switch(adaptationMode){
            case "1": 
                if(!width){
                    setError("需设置宽度");
                    return false;
                }
                thumbnail = width;
                break;
            case "2":
                if(!height){
                    setError("需设置高度");
                    return false;
                } 
                thumbnail = "x" + height;
                break;
            case "3": 
                if(!width || !height){
                    setError("需设置宽度,高度");
                    return false;
                } 
                thumbnail = width + "x" + height + ">";
                break;
            case "4": 
                if(!width || !height){
                    setError("需设置宽度,高度");
                    return false;
                } 
                var resize = "!" + width + "x" + height;
                thumbnail = resize + "r";
                gravity = "center";
                crop = resize + "a0a0";
                break;
            case "5": 
                if(!width || !height){
                    setError("需设置宽度,高度");
                    return false;
                } 
                thumbnail = "!" + width + "x" + height;
                break;
            case "6": 
                if(!width || !height){
                    setError("需设置宽度,高度");
                    return false;
                } 
                thumbnail = "!" + width + "x" + height + "r";
                break;
            default:
                log(adaptationMode);
                setError("图片尺寸适配方式设置错误");
                return false;
        }

        var format = $("[name=format]").val();
        var rotate = $("[name=rotate]").val();
        var autoOrient = $("[name=auto_orient]").checkVal();
        var quality = $("#quality").slider("value");

        return mkStyleParams({
            auto_orient: autoOrient,
            thumbnail: thumbnail,
            gravity: gravity,
            crop: crop,
            quality: quality,
            rotate: rotate,
            format: format
        });
    };

    var generatePrev = function(){
        log("auto gen prev...");//------------
        var style = getStyle();
        if(!style){
            return false;
        }

        var newSrc = imageSrc+"?"+style;
        $("#preview").attr("src",newSrc);
        $("#preview").parent("a").attr("href", newSrc);
        return true;
    };

    var qualityIn = $("input[name=quality]");
    $("#quality").slider({
        min: 1,  
        max: 100, 
        value: 50,
        change: function(event, ui){
            qualityIn.val(ui.value);
            qualityIn.trigger("change");
            $(this).find(".chosen").css("width",parseInt(ui.value)+"%");
        },
        slide: function(event, ui){
            $(this).find(".chosen").css("width",parseInt(ui.value)+"%");
        }
    });
    $("#quality-block").find("[op]").on("click", function(){
        switch($(this).attr("op")){
            case "min":
                $("#quality").slider("value", 1);
                break;
            case "mid":
                $("#quality").slider("value", 50);
                break;
            case "max":
                $("#quality").slider("value", 100);
                break;
            default:
                return false;
        }
    });

    var transparentIn = $("input[name=transparent]")
    $("#transparent").slider({
        min: 1,  
        max: 100, 
        value: 100,
        change: function(event, ui){
            transparentIn.val(ui.value);
            transparentIn.trigger("change");
            $(this).find(".chosen").css("width",parseInt(ui.value)+"%");
        },
        slide: function(event, ui){
            $(this).find(".chosen").css("width",parseInt(ui.value)+"%");
        }
    });



    $(".detail-name").checkout($(".detail", ".details"));

    curtain.init = function(val){
        $("#preview").attr("src", "http://portal-files.qiniudn.com/sample1.jpg");

        $("input[name=style_name]").setable(!val);
        $("#create-style").text(val ? "保存修改" : "确认创建");
        val = val || {};
        $("input[name=style_name]").val(val.styleName || "");
        $("input[name=width]").val(val.width || "");
        $("input[name=height]").val(val.height || "");
        $("[name=format]").val(val.format || "");
        $("[name=rotate]").val(val.rotate || "");
        $("[name=auto_orient]").check(val.autoOrient || false);
        $("#quality").slider("value", parseInt(val.quality) || 50);

        adaptationStyleSetter.setVal(val.adaptationMode || "1");
        watermarkStyleSetter.setVal(val.watermarkStyle || "1");
        watermarkPositionSetter.setVal(val.watermarkPosition || "1");

     };

	$("#new-image-style").on("click", function(){ 
        curtain.init();
		curtain.curtainShow();
	});

    $(".style-name").live(".style-name", "click", function(){
        $(this).parents(".card").find(".edit-op").trigger("click");
    });
    $(".edit-op").live(".edit-op", "click", function(e){
        var thisStyle = $(this).parents(".image-style");
        var styleName = thisStyle.find(".style-name").text();
        var styleCnt = thisStyle.find(".style-cnt").text();
        var style = parseStyle(styleCnt);
        if(!style){
            $.prompt("Can not edit, you can input here:", styleCnt, function(style){
                if(style){
                    createStyle(styleName, style, function(result){
                        model.getCertainBucket(_bucketName);
                    }, function(err){
                        $.alert(err);
                    });
                }
            });
        }else{
            style.styleName = styleName;
            curtain.init(style);
            curtain.curtainShow();
        }
        e.stopPropagation();
        return false;
    });
    $(".delete-op").live(".delete-op", "click", function(e){
        var styleName = $(this).parents(".image-style").find(".style-name").text();
        removeStyle(styleName, function(result){
            model.getCertainBucket(_bucketName);
        }, function(err){
            $.alert(err);
        });
        e.stopPropagation();
        return false;
    });

	$("#close-btn").on("click", function(){
		curtain.curtainHide();
	});
    $(".cancel").on("click", function(){
        curtain.curtainHide();
        return false;
    });

    var imageSrc = $("#preview").attr("src");

    $("#generate-prev").on("click", function(){
        if(!generatePrev()){
            showError();
        }
    });
    $("input").on("change", generatePrev);
    $("select").on("change", generatePrev);

    $("#style-name-in[name=style_name]").on("change", function(){
        var name = $("#style-name-in[name=style_name]").val();
        var namePattern = /^[a-zA-Z0-9\.]*$/;
        if(!namePattern.test(name)){
            $.alert("样式名只限字母、小数点");
            return false;
        }
    });

	$("#create-style").on("click", function(){
        var name = $("#style-name-in[name=style_name]").val();
        var namePattern = /^[a-zA-Z0-9\.]+$/;
        if(!namePattern.test(name)){
            $.alert("样式名不符合规范（只限字母、小数点且不为空）");
            return false;
        }
        var style = getStyle();
        if(!style){
            showError();
            return false;
        }

        createStyle(name, style, function(result){
            curtain.curtainHide();
            model.getCertainBucket(_bucketName);
        }, function(err){
            $.alert(err);
        });
    });
});