var adaptationModes = {
    "1": "限定宽度，高度等比缩放",
    "2": "限定高度，宽度等比缩放",
    "3": "限定宽度和高度，图像等比缩放",
    "4": "限定宽度和高度，图像居中裁剪",
    "5": "限定长边，短边自适应",
    "6": "限定短边，长边边自适应"
};

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

    try{
        var modePattern = {
            "1" : /^([\d]+)$/,
            "2" : /^x([\d]+)$/,
            "3" : /^([\d]+)x([\d]+)\>$/,
            "4" : /^\!([\d]+)x([\d]+)r$/,
            "5" : /^\!([\d]+)x([\d]+)$/,
            "6" : /^\!([\d]+)x([\d]+)r$/
        };
        var test = function(i){
            i = i+"";
            return modePattern[i].test(params.thumbnail);
        };
        var exec = function(i){
            i = i+"";
            return modePattern[i].exec(params.thumbnail);
        };
        if(test(1) && !params.gravity && !params.crop){ // mode 1
            params.adaptationMode = "1";
            params.width = parseInt(exec(1)[1]);
        }else if(test(2) && !params.gravity && !params.crop){ // mdoe 2
            params.adaptationMode = "2";
            params.height = parseInt(exec(2)[1]);
        }else if(test(3) && !params.gravity && !params.crop){ // mdoe 3
            params.adaptationMode = "3";
            params.width = parseInt(exec(3)[1]);
            params.height = parseInt(exec(3)[2]);
        }else if(test(4) && /^\![\d]+x[\d]+a0a0$/.test(params.crop) && params.gravity=="center"){ // mdoe 4
            if(params.crop.slice(0,-4)!=params.thumbnail.slice(0,-1)){
                throw new Error("Different resize in crop & thumbnail.");
            }
            params.adaptationMode = "4";
            params.width = parseInt(exec(4)[1]);
            params.height = parseInt(exec(4)[2]);

        }else if(test(5) && !params.gravity && !params.crop){ // mdoe 5
            params.adaptationMode = "5";
            params.width = parseInt(exec(5)[1]);
            params.height = parseInt(exec(5)[2]);
        }else if(test(6) && !params.gravity && !params.crop){ // mdoe 6
            params.adaptationMode = "6";
            params.width = parseInt(exec(6)[1]);
            params.height = parseInt(exec(6)[2]);
        }else{
            throw new Error("Not supportted setting.")
        }
    }catch(err){
        log("parse " + style + " error: ", err);
        return false;
    }
    return params;
};

var createStyle = function(name, style, callback, fail){
    name = URLSafeBase64Encode(name);
    style = URLSafeBase64Encode(style);

    postData({},"/api/pub/style/"+_bucketName+"/name/"+name+"/style/"+style, function(result){
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
    var curtain = $("#curtain");

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
            var style = prompt("Can not edit, you can input here:", styleCnt);
            if(style){
                createStyle(styleName, style, function(result){
                    model.getCertainBucket(_bucketName);
                }, function(err){
                    $.alert(err);
                });
            }
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

    var styleNameIn = $("#style-name-in");
    var checkStyleName = function(name){
        name = name || styleNameIn.val();
        var namePattern = /^[a-zA-Z0-9\.]*$/;
        if(!namePattern.test(name)){
            $.alert("样式名不符合规范: "+$("#style-name-in").attr("placeholder").split(":")[1], function(){
                styleNameIn.focus();
            });
            return false;
        }

        if(!styleNameIn.attr("disabled")){ //check if name exist while create new style instead of edit
            var styles = model.certainBucket().styles();
            for (var i = 0; i < styles.length; i++) {
                if(styles[i].name == name){
                    $.alert("样式名已存在，无法创建同名样式，您可以修改原有样式内容", function(){
                        styleNameIn.focus();
                    });
                    return false;
                }
            };
        }
        return true;
    };

    $("#style-name-in[name=style_name]").on("change", function(){
        return checkStyleName();
    });

	$("#create-style").on("click", function(){
        var name = $("#style-name-in[name=style_name]").val();
        if(!checkStyleName(name)) return false;

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