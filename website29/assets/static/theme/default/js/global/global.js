var log = function(){
	if(!console.log.apply) {
		for (var i = 0, l = arguments.length; i < l; i++) {
			console.log(arguments[i]);
		};
		return true;
	}
	return loadFromLocal("allowLog", "log") && console.log.apply(console, arguments);
};

var saveToLocal = function (key, value, nameSpace) {
	if(typeof key !== "string") return false;
	if(nameSpace) key = nameSpace + "$" + key;

	value = JSON.stringify(value);

	window.localStorage[key] = value;
	return true;
};

var loadFromLocal = function (key, nameSpace) {
	if(typeof key !== "string") return false;
	if(nameSpace) key = nameSpace + "$" + key;
	
	var value = window.localStorage[key]
	if(value)
		return $.parseJSON(value);
	return null;
};

var removeFromLocal = function (key, nameSpace) {
	if(typeof key !== "string") return false;
	if(nameSpace) key = nameSpace + "$" + key;
	
	return localStorage.removeItem(key);
};

var toggleLog = function(){
	if(loadFromLocal("allowLog", "log")){
		removeFromLocal("allowLog", "log");
		return "已禁用log";
	}else{
		saveToLocal("allowLog", true, "log");
		return "开启log";
	}
};

var getNavigator = function(){
	var userAgent=navigator.userAgent.toLowerCase(), s, o = {};   
    var browser={
        version: parseInt(userAgent.match(/(?:firefox|opera|safari|chrome|msie)[\/: ]([\d.]+)/)[1]),
        safari: /version.+safari/.test(userAgent),
        chrome: /chrome/.test(userAgent),
        firefox: /firefox/.test(userAgent),
        ie: /msie/.test(userAgent),
        opera: /opera/.test(userAgent ) 
    };
    return browser;
};

var format = function (num, hex, units, dec) {
	num = num || 0;
	dec = dec || 0;
	var level = 0;
	while(num >= hex){
		num /= hex;
		level++;
	}

	if(level==0) dec = 0;

	return {
		"base" : num.toFixed(dec),
		"unit" : units[level],
		"format" : function(sep){
			sep = sep || "";
			return this.base + sep + this.unit;
		}
	};
};

var numFormat = function(num, n){
	if(typeof n !== "number" || n<1) n=1;
	var s = num.toFixed(n);
	var pattern1 = /[0]+$/;
	var pattern2 = /\.$/;
	return s.replace(pattern1, "").replace(pattern2, "");
};

var random = function(min, max){
	min = min || 0;
	max = max || 100;
	var r = Math.random()*(max-min);
	return Math.floor(r+min);
};

var utf8_encode = function(argString) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === "undefined") {
        return "";
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = "",
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
};

var base64_encode = function(data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = "",
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data = utf8_encode(data + '');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
    case 1:
        enc = enc.slice(0, -2) + '==';
        break;
    case 2:
        enc = enc.slice(0, -1) + '=';
        break;
    }

    return enc;
};

var URLSafeBase64Encode = function(v) {
	v = base64_encode(v);
    return v.replace(/\//g, '_').replace(/\+/g, '-');
};

var getDayObj = function(offset, t){
	offset = offset || "now";

	if(!t){
		var t = new Date(phpjs.strtotime(offset)*1000);
	}

	return {
		y: t.getFullYear(),
		m: t.getMonth() + 1,
		d: t.getDate(),
		value: t.valueOf()
	};
};

var dateFormat = function(y, m, d, sep){
	sep = sep || "";
	var f = "";
	if(y) f+=y+sep;
	if(m) f+=( m<10 ? "0"+m : "" + m )+sep;
	if(d) f+=( d<10 ? "0"+d : "" + d );
	return f;
};

var getYear = function(offset){
	var t = getDayObj(offset);

	return dateFormat(t.y);
};

var getMonth = function(offset){
	var t = getDayObj(offset);

	return dateFormat(t.y,t.m);
};

var getDay = function(offset, tt){
	var t = getDayObj(offset, tt);

	return dateFormat(t.y,t.m,t.d);
};

var maxRepeatNum = 5;
var defaultRepeatNum = 2;

var postData = function (data, url, success, fail, repeat) {
	//if(typeof repeat === "undefined") repeat = defaultRepeatNum;
	$.ajax(url, {
        data: data,
        type: "post", 
        dataType: "json",
        success: success,
        error: function(){
        	fail && fail();
        	if(typeof repeat === "number" && repeat>0) repeat--;
        	if(repeat === true) repeat = maxRepeatNum;
        	repeat && postData(data, url, success, fail, repeat);
        }
    });
};

var getData = function (url, success, fail, repeat) {
	if(typeof repeat === "undefined") repeat = defaultRepeatNum;
	postData("", url, success, fail, repeat);
};

var testBottom = function() {
    var getScrollTop = function() {  
        if(document.documentElement&&document.documentElement.scrollTop){  
            return document.documentElement.scrollTop;  
        }else if(document.body){  
            return document.body.scrollTop;  
        }  
    };

    var getClientHeight = function() {  
        if(document.body.clientHeight && document.documentElement.clientHeight){  
            return (document.body.clientHeight<document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;          
        }else{
            return (document.body.clientHeight>document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;      
        }  
    };

    var getScrollHeight = function() {  
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);  
    };
    return getScrollTop() + getClientHeight() >= getScrollHeight();
};

var showPwd = function (handles) {
	handles.each(function () {
		var handle = $(this);
		var pwd_in = handle.siblings("input[type=password]");
		handle.mousedown(function(){
			pwd_in.attr("type", "text");
		}).mouseup(function(){
			pwd_in.attr("type", "password");
		}).mouseout(function(){
			pwd_in.attr("type", "password");
		});
	});
};

$.extend({
	getTemplates: function(){
		var self = this;

		if(!self.templates){
			self.templates = {};
			$.getJSON("/static/theme/default/templates/preload-list.json", function(list){
				$.each(list, function(i, name){
					$.get("/static/theme/default/templates/"+name+".html", function(template){
						self.templates[name] = template;
					});
				});
			});
		}
	},
	renderTemplate: function(name, values){
		if(!this.templates || !this.templates[name]) return "";
		var template = this.templates[name];
		$.each(values, function(key, value){
			template = template.replace("$$"+key, value);
		});
		return $(template);
	},
	alert: function(word, callback){
		word = typeof word === "string" ? word : JSON.stringify(word);
		var values = {
			title: "Attention - Qiniu",
			word: word
		}
		var box = $.renderTemplate("alert-box", values);
		box.appendTo('body').boxShow();

		box.find("#box-confirm, .close-box").on("click", function(){
			box.boxHide().remove();

			callback && callback();
		});
	},
	prompt: function(word, value, callback){
		word = typeof word === "string" ? word : JSON.stringify(word);
		value = value ? value : "";
		if(typeof value === "function"){
			callback = value;
			value = "";
		}
		callback = callback || function(a){log(a);};
		
		var values = {
			title: "Input - Qiniu",
			word: word,
			value: value
		}
		var box = $.renderTemplate("prompt-box", values);
		box.appendTo('body').boxShow();

		box.find("#box-submit").on("click", function(){
			var value = box.find("#box-in").val();
			box.boxHide().remove();

			callback && callback(value);
		});
		box.find("#box-cancel, .close-box").on("click", function(){
			box.boxHide().remove();

			callback && callback(false);
		});
	},
	confirm: function(word, callback){
		word = typeof word === "string" ? word : JSON.stringify(word);
		callback = callback || function(a){log(a);};
		
		var values = {
			title: "Confirm - Qiniu",
			word: word
		}
		var box = $.renderTemplate("confirm-box", values);
		box.appendTo('body').boxShow();

		box.find("#box-confirm").on("click", function(){
			box.boxHide().remove();

			callback && callback(true);
		});
		box.find("#box-cancel, .close-box").on("click", function(){
			box.boxHide().remove();

			callback && callback(false);
		});
	}
});

$.fn.extend({
	checkout: function( cnt, index, activeClass, event ) {
		event = event || "click";
		var handle = this;
		var current = index || 0;
		activeClass = activeClass || "current";

		var active = function(i){
	        handle.eq(i).addClass(activeClass);
	        cnt.eq(i).show();
	    };

	    var disactive = function(i){
	        handle.eq(i).removeClass(activeClass);
	        cnt.eq(i).hide();
	    };

		handle.on(event, function () {
			var i = handle.index($(this));
			if(current!=i){
				disactive(current);
				current = i;
				active(i);
			}
		});

		handle.checkoutIndex = function(i){
			if(current!=i){
				disactive(current);
				current = i;
				active(i);
			}
		};

		cnt.hide();
		active(current);

		return handle;
	},
	setActive: function (activeClass) {
		activeClass = activeClass || "active";

		var ops = this;
		var loc = location.href;
		var L_loc = loc.length;

		var isAcceptable = function (i) {
			var acceptArray = ["/", "?", "#", undefined];

			return acceptArray.indexOf(i) >= 0;
		};

		ops.each(function (i) {
			var op = $(this);
			var href = op.attr("href").split("?")[0];

			var L_href = href.length;
			var pos = loc.indexOf(href);

			if( pos>=0 && ( isAcceptable(loc[pos+L_href]) || isAcceptable(href[L_href-1]) ) ){
				op.addClass(activeClass);
				return true;
			}
		});
	},
	bindClick: function () {
		$(this).each(function(){
			var btn = $(this);
			var closeAccOp = function () {
				btn.removeClass("active");
			}
			btn.on("click", function (e) {
				btn.toggleClass("active");
				e.stopPropagation();
			});

			btn.on("mouseleave", function () {
				if(btn.hasClass("active")){
					$("body").on("click", closeAccOp);
				}
			});

			btn.on("mouseenter", function () {
				$("body").off("click", closeAccOp);
			});
		});

		return $(this);
	},
	bindCurtainSwitches: function (on, off, afterOn, afterOff, beforeOn, beforeOff) {
		var obj = this;

		for(var i=0,l=on.length;i<l;i++){
			on[i].on("click", function(){
				//if(beforeOn && !beforeOn($(this))) return false;
				
				var exec = function(){
					obj.show();
					$("#curtain-bg").show();
					window.scrollTo(0,50);
					if(afterOn) afterOn();
				};

				if(beforeOn){
					beforeOn($(this), function(res){
						if(res){
							exec();
						}
					});
				}else{
					exec();
				}

				/*obj.show();
				$("#curtain-bg").show();
				window.scrollTo(0,50);
				if(afterOn) afterOn();*/
				return false;	
			});
		}

		for(var i=0,l=off.length;i<l;i++){
			off[i].on("click", function(){
				var exec = function(){
					obj.hide();	
					$("#curtain-bg").hide();
					if(afterOff) afterOff();
				};
				if(beforeOff){
					beforeOff($(this), function(res){
						if(res){
							exec();
						}
					});
				}else{
					exec();
				}

				/*if(beforeOff && !beforeOff($(this))) return false;
				obj.hide();	
				$("#curtain-bg").hide();
				if(afterOff) afterOff();*/
				return false;	
			});
		}

		return obj;
	},
	curtainShow: function(){
		var box = $(this);
		$("#curtain-bg").show();
		window.scrollTo(0,50);
		box.show().find("input").first().focus();
		return box;
	},
	curtainHide: function(){
		$("#curtain-bg").hide();
		return $(this).hide();
	},
	boxShow: function(){
		var box = $(this);
		$("#box-bg").show();
		box.show().find("input").first().focus();
		return box;
	},
	boxHide: function(){
		$("#box-bg").hide();
		return $(this).hide();
	},
	bindRadio: function(values, defaultIndex, activeClass, after, before) {
		activeClass = activeClass || "active";
		var setters = this;
		var defaultIndex = typeof(defaultIndex)==="number" ? defaultIndex : 0;
		var index = defaultIndex;

		var checkout = function(setter){
			var val = setter.attr("value");

			setters.removeClass(activeClass);
			setter.addClass(activeClass);

			valuer = values.filter("[value="+val+"]");
			valuer[0].checked = true;
			index = setters.index(setter);
			
			valuer.trigger("change");
		}

		var setOpt = function(setter){
			if(!setter.hasClass(activeClass)){
				checkout(setter);
			}
		};

		var set = function(i){
			var setter = setters.eq(i);
			
			setOpt(setter);
		};

		var init = function(){
			set(defaultIndex);
		};

		var get = function(){
			return index;
		};
		var setVal = function(val){
			if(typeof val !== "string") return init();
			setOpt(setters.filter("[value="+val+"]"));
		};
		var getVal = function(){
			return values.eq(index).attr("value");
		};

		setters.on("click", function () {
			var setter = $(this);

			if(setter.hasClass(activeClass)) return false;

			if(before){
				before(setters.index(setter), setter, function(res){
					if(res){
						checkout(setter);
						if(after) after(setters.index(setter), setter);
					}
				});
			}else{
				checkout(setter);
				if(after) after(setters.index(setter), setter);
			}

			return true;
		}); 

		init();

		return {
			"init": init,
			"set": set,
			"get": get,
			"setVal": setVal,
			"getVal": getVal
		};
	},
	live: function(selector, event, handler, context){
		context = context || "body";
		$(context).delegate(selector, event, handler);
	},
	check: function(){
		if(arguments.length==0){
			return this.checkVal();
		}else{
			var ret = this.checkVal.apply(this, arguments);
			this.trigger("change");
			return ret;
		}
	},
	checkVal: function(){
		var self = this;

		if(arguments.length==0){
			return self[0].checked;
		}
		
		var val = arguments[0] ? true : false;
		self.each(function(){
			$(this)[0].checked = val;
		});
		return val;
	},
	setable: function (val) {
		val = val ? true : false;
		var withDisableAttrEles = ["SELECT","INPUT","BUTTON"]; 
		$(this).each(function(){
			if(withDisableAttrEles.indexOf(this.tagName)>=0){
				this.disabled = !val;
			}else{
				if(val) $(this).removeClass("disabled");
				else $(this).addClass("disabled");
			}
		});
		return $(this);
	},
	disable: function () {
		return $(this).setable(false);
	},
	enable: function () {
		return $(this).setable(true);
	},
	resetInput: function(){
		$(this).find("input[type=text]").val("");
		$(this).find("input[type=password]").val("");
		$(this).find("input[type=checkbox]").checkVal(false);

		return $(this);
	},
	simulateScroll: function(items, step, limit, reachBtm, leaveBtm){
		var wrapper = $(this);
		/*if(!items){
			wrapper.css("max-height","none");
			return wrapper;
		}*/

		var current = 0;

		wrapper.css("max-height",step*limit+1+"px");

		wrapper.getCurrent = function(){
			return current;
		};

		wrapper.scroll = function(change){
			var scroller = items.eq(0);
			var num = items.length;
			var newVal = current + change;
			if(newVal>0 || newVal+(num-limit)<0) return false;

			current = newVal;
			if(current+(num-limit)==0){
				reachBtm();
			}
			if(current+(num-limit)==1 && change==1){
				leaveBtm();
			}

			scroller.animate({
				marginTop: step*current 
			}, 0);
			return false;
		};

		wrapper.on("mousewheel", function(event){
			var up = event.originalEvent.wheelDelta;
			var change = up > 0 ? 1 : -1;
			
			return wrapper.scroll(change);
		});

		wrapper.on("DOMMouseScroll", function(event){
			var up = -event.originalEvent.detail;
			var change = up > 0 ? 1 : -1;

			return wrapper.scroll(change);
		});

		wrapper.on("keyup", function(event){
			if(event.keyCode){
				var cmd = event.keyCode;
				return false;
			}
		});

		return wrapper;
	},
	autoScrollX: function(speed){
		speed = speed || 1;
		var period = 100; //ms
		var scroller = $(this);
		var wrapper = scroller.parent();
		var outWidth = wrapper.width();
		var inWidth = scroller.width();

		if(outWidth > inWidth) return false;

		var gap = inWidth - outWidth;
		var left = 0;
		var intervalTimer, timeoutTimer;

		scroller.css({
			position: "relative"
		});

		var set = function(nleft){
			left = nleft;
			scroller.css({
				left: -nleft+"px"
			});
		};

		wrapper.startScroll = function(s){
			set(0);
			if(s) speed = s;
			intervalTimer = setInterval(function(){
				if(left >= gap){
					wrapper.pauseScroll();
					timeoutTimer = setTimeout(function(){
						wrapper.startScroll(speed);
					}, 1000);
				}else{
					set((left+speed) % (gap+20));
				}
			}, period);
		};

		wrapper.pauseScroll = function(){
			clearInterval(intervalTimer);
			clearTimeout(timeoutTimer);
		};

		wrapper.stopScroll = function(){
			wrapper.pauseScroll();
			set(0);
		};

		return wrapper;
	}
});


//----------------- Todo (event model) -------------------------

function Todo() {
	this.list = {};
}

Todo.prototype.Register = function(trigger, handle) {
	if(typeof(trigger) !== "string"){
		return false;
	}

	if(typeof(this.list[trigger])!=="object") this.list[trigger] = [];

	this.list[trigger].push(handle);
	return true;
};

Todo.prototype.Trigger = function(trigger, obj) {

	var args = [];
	for (var i = 0, l1=arguments.length, l2 = this.Trigger.length; i < l1; i++) {
		if (i>=l2) {
			args.push(arguments[i]);	
		};
	};

	if(typeof(this.list[trigger])!=="object") return true;

	var li = this.list[trigger];
	for (var i = 0, l = li.length; i < l; i++) {
		li[i].apply(obj, args);
	};
	//this.list[trigger] = [];

	return true;
};

// ---------------------------- view model ---------------------------------

var defaultObj = {
	base : '...',
	unit : "MB"
};
var defaultVal = '...';
var defaultArray = [];

var defaultPageNum = 10;
var defaultNumInPage = 10;
var defaultGetPageDeviation = 2;

var storageUnits = ["B", "KB", "MB", "GB", "TB"];
var storageHex = 1024;

var numUnits = ["次", "万次"];
var numHex = 10000;

var maxLoadBucketNum = 5;

var level2_domain_pattern = /^[a-zA-Z0-9][a-zA-Z0-9\+\-]*.qiniudn.com$/

function Bucket (b) {
    this.name = ko.observable(b.name ? b.name : defaultVal);
    this.storage = ko.observable(defaultObj);
    this.download = ko.observable(defaultObj);
    this.apiQuery = ko.observable(defaultObj);

	this.anti_leech_mode = ko.observable(b.anti_leech_mode);

	var domains = b.bind_domains;
	var new_domains = {
		permanent: "",
		level2: "",
		custom: domains || []
	};
	if(domains){
		for(var i=0,l=domains.length;i<l;i++){
			var domain = domains[i];
			if(level2_domain_pattern.test(domain)){
				new_domains["level2"] = domain;
				break;
			}
		}
		if(l>0) domains.splice(i,1);
	}
	this.bind_domains = ko.observable(new_domains);

	this.expires = ko.observable(b.expires);
	this.host = ko.observable(b.host);
	this.private = ko.observable(b.private==1);
	this.protected = ko.observable(b.protected==1);

	this.refer_bl = ko.observableArray(b.refer_bl);
	this.refer_wl = ko.observableArray(b.refer_wl);
	this.visit_ctr = ko.observable(b.refer_wl?1:(b.refer_bl?2:0));

	this.refresh_time = ko.observable(b.refresh_time);
	this.separator = ko.observableArray((b.separator || "").split(""));
	this.source = ko.observable(b.source);

	this.styles = ko.observableArray([]);
	for(var name in b.styles){
		var rules = b.styles[name].split("/");
		var style = {
			name: name,
			cnt: b.styles[name]
		};
		for(var i=0,l=rules.length;i<l;){
			if(rules[i]=="imageMogr" || rules[i]=="auto-orient"){
				i++;
			}else{
				style[rules[i]] = rules[i+1];
				i+=2;
			}
		}
		this.styles.push(style);
	}

	this.formData = {};
}

function File (f) {
    this.name = ko.observable(f.key || "");

    /*this.url = ko.observable( _downloadInfo.url && _downloadInfo.token ? 
    	"http://" + _downloadInfo.url + "/" + f.key + "?token=" + _downloadInfo.token : 
    	"");*/

    this.url = ko.computed(function() {
		return  _downloadInfo.url && _downloadInfo.token ? 
    	"http://" + _downloadInfo.url + "/" + this.name() + "?token=" + _downloadInfo.token : 
    	"";
	}, this);

    var date = new Date(Math.floor(f.putTime/10000));
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    m = (m>=10 ? "" : "0" ) + m;
    d = (d>=10 ? "" : "0" ) + d;
    var t = [y,m,d].join("/");
    this.createTime = ko.observable(t);

    var temp = format(f.fsize, storageHex, storageUnits, 0);
	this.size = ko.observable({
		base : temp.base,
		unit : temp.unit
	});

    this.type = ko.observable(f.mimeType);
    this.hash = ko.observable(f.hash);
}

function UserViewModel () {
	var self = this;
	
	self.todo = new Todo();

	//----------------- members -------------------------

	self.mail = ko.observable(_mail || defaultVal);

	self.balance = ko.observable({});
	self.storage = ko.observable(defaultObj);
    self.download = ko.observable(defaultObj);
    self.apiQuery = ko.observable(defaultObj);

    self.noticeNum = ko.observable(defaultVal);

	self.bucketsName = ko.observableArray(defaultArray);
	self.buckets = ko.observableArray(defaultArray);

	self.appInfo = ko.observable({key:[]});

	self.currentBucketsNum = 0;
	var Status = function(){
		var ready = {};

		return {
			setStatus: function(data, status){
				ready[data] = status;

				var args = [data+"Ready", null];
				for (var i = 0, l1=arguments.length, l2 = this.setStatus.length; i < l1; i++) {
					if (i>=l2) {
						args.push(arguments[i]);	
					};
				};

				if(status){
					self.todo.Trigger.apply(self.todo, args);
				}
			},
			getStatus: function(data){
				return ready[data] || false;
			}
		};
	};
	self.status = Status();

	self.numInPage = ko.observable(10);

	self.certainBucket = ko.observable(new Bucket({}));
	self.certainFileNum = ko.observable(0);
	self.certainFiles = ko.observableArray([[]]);
	self.certainMarker = ko.observable("");
	self.certainPageIndex = ko.observable(0);
	self.certainPageRange = ko.observable({});

	self.certainBucketHasMore = ko.observable(true);


	//----------------- functions -------------------------

    self.getBalance = function(callback) {
        self.status.setStatus("balance", false);
        getData("/api/wallet/info", function(result) { 
        	if(result){
        		self.balance({
        			amount: (result.amount/10000).toFixed(2),
        			cash: (result.cash/10000).toFixed(2),
        			coupon: (result.coupon/10000).toFixed(2)
        		});
        	}
        	self.status.setStatus("balance", true);
			if(callback) callback();
        });
    };

    self.getAccountInfo = function(callback) {
        self.status.setStatus("accountInfo", false);

        postData({
        	"timezone":"+08:00",
        	"month": getMonth()
    		},"/api/stats/info", function(result) { 

			if(typeof(result.apicall_get) === "number" && typeof(result.apicall_put) === "number") {
        		var temp = format(result.apicall_get + result.apicall_put, numHex, numUnits, 2);
        		self.apiQuery({
        			base : temp.base,
        			unit : temp.unit
        		});
        	}

        	if(typeof(result.space) === "number") {
        		var temp = format(result.space, storageHex, storageUnits, 2);
        		self.storage({
        			base : temp.base,
        			unit : temp.unit
        		});
        	}

        	if(typeof(result.transfer) === "number") {
        		var temp = format(result.transfer, storageHex, storageUnits, 2);
        		self.download({
        			base : temp.base,
        			unit : temp.unit
        		});
        	}

        	self.status.setStatus("accountInfo", true);
			if(callback) callback(result);
        });
    };

    self.getAppInfo = function(callback) {
        self.status.setStatus("appInfo", false);
    	postData({app:"default"}, "/api/uc/appInfo", function(result){
    		if(result){
    			if(result.key){
    				var appInfo = {
    					"key": [],
    					"appId": result.appId,
    					"utype": result.utype
    				};
    				appInfo.key.push({
    					"accessKey": result.key,
    					"secretKey": result.secret,
    					"state": result.state || 0
    				});

    				if(result.key2){
    					appInfo.key.push({
	    					"accessKey": result.key2,
	    					"secretKey": result.secret2,
	    					"state": result.state2 || 0
	    				});
    				}
    				// sort --- sort()not reliable in ie8-
    				if(appInfo.key.length>1){
	    				if(appInfo.key[0].accessKey > appInfo.key[1].accessKey){
	    					var tmp = appInfo.key[0];
	    					appInfo.key[0] = appInfo.key[1];
	    					appInfo.key[1] = tmp;
	    				}
	    			}
		    		self.appInfo(appInfo);
	        		self.status.setStatus("appInfo", true);
    			}
	    	}
			if(callback) callback(result);
    	});
    };

	self.getBucketsName = function (callback) {
        self.status.setStatus("bucketsName", false);

		getData("/api/rs/buckets",function(buckets){
			if(buckets) self.bucketsName(buckets);

        	self.status.setStatus("bucketsName", true, self.bucketsName());
			if(callback) callback();
		});
	};

	self.saveBucketsName = function () {
		var bucketsName = self.bucketsName();
		//return saveToLocal("bucketsName", bucketsName);
	};

	self.loadBucketsName = function () {
        self.status.setStatus("bucketsName", false);
		var bucketsName = loadFromLocal("bucketsName");

		if(bucketsName){
			self.bucketsName(bucketsName);

        	self.status.setStatus("bucketsName", true);

			return true;
		}else{
			return false;
		}
	};

	self.getBucketInfo = function (bucketName, callback) {
        self.status.setStatus("bucketInfo", false);
		var getStat = function (result) {
			result = result || {};
			result.name = bucketName;

			var newBucket = new Bucket(result);

			postData({
				"timezone" : "+08:00",
				"bucket": bucketName,
				"month": getMonth()
			},"/api/stats/info", function(result) { 

				if(typeof(result.apicall_get) === "number" && typeof(result.apicall_put) === "number") {
	        		var temp = format(result.apicall_get + result.apicall_put, numHex, numUnits, 2);
	        		newBucket.apiQuery({
	        			base : temp.base,
	        			unit : temp.unit
	        		});
	        	}

	        	if(typeof(result.space) === "number") {
	        		var temp = format(result.space, storageHex, storageUnits, 2);
	        		newBucket.storage({
	        			base : temp.base,
	        			unit : temp.unit
	        		});
	        	}

	        	if(typeof(result.transfer) === "number") {
	        		var temp = format(result.transfer, storageHex, storageUnits, 2);
	        		newBucket.download({
	        			base : temp.base,
	        			unit : temp.unit
	        		});
	        	}

        		self.status.setStatus("bucketInfo", true, newBucket);

				if(callback) callback(newBucket);
	        }, function(){
	        	if(callback) callback(newBucket);
	        });
		};
		postData({bucket : bucketName}, "/api/uc/bucketInfo", getStat, getStat);
	};

	self.getBucketFormData = function(bucket, type, from, to, p, callback){
        self.status.setStatus("bucketFormData"+type, false);
		if(typeof bucket === "string" || !bucket){
        	var name = bucket;
        	bucket = {
        		name: function(){
        			return name;
        		}, 
        		formData:{}
        	};
        }
		p = p || "day";


		postData({
			"bucket": bucket.name(), 
			"from": from, 
			"to": to, 
			"p": p
		}, "/api/stats/select/"+type, function(result){
			bucket.formData[type] = result;
        	self.status.setStatus("bucketFormData"+type, true, result);
	        if(callback) callback(result);
		}, function(err){});
	};

	self.getBucketApiCallFormData = function(bucket, from, to, p, callback){
        self.status.setStatus("bucketApiCallFormData", false);
        if(typeof bucket === "string" || !bucket){
        	var name = bucket;
        	bucket = {
        		name: function(){
        			return name;
        		}, 
        		formData:{}
        	};
        }
		p = p || "day";

		postData({
			"bucket": bucket.name(), 
			"type" : "get",
			"from": from, 
			"to": to, 
			"p": p
		}, "/api/stats/select/apicall", function(result1){
			bucket.formData["apicall"] = {};
			bucket.formData["apicall"]["get"] = result1;

        	postData({
				"bucket": bucket.name(), 
				"type" : "put",
				"from": from, 
				"to": to, 
				"p": p
			}, "/api/stats/select/apicall", function(result2){
				bucket.formData["apicall"]["put"] = result2;
	        	self.status.setStatus("bucketApiCallFormData", true, result1, result2);
	        	if(callback) callback(result1, result2);
			}, function(err){});
		}, function(err){});
	};

	self.getCertainBucket = function(bucketName, callback) {
        self.status.setStatus("certainBucket", false);

		self.getBucketInfo(bucketName, function(bucket){
			self.certainBucket(bucket);
			
        	self.status.setStatus("certainBucket", true, bucket);
			if(callback) callback(bucket);
		});
	};

	self.getCertainFiles = function(bucketName, prefix, pageNum, callback, fail, refresh) {
		self.status.setStatus("certainFiles", false);

		var clearCurrent = function(){
			self.certainFiles([]);
			self.certainFileNum(0);
			self.certainMarker("");
			return true;
		};
		refresh && clearCurrent();

		marker = self.certainMarker() || "";
		prefix = prefix || "";
		var numInPage = self.numInPage() || defaultNumInPage;
		pageNum = pageNum || defaultPageNum;
		var num = numInPage * pageNum;
		getData("/api/rsf/list?bucket="+bucketName+"&marker="+marker+"&limit="+num+"&prefix="+prefix, function(result){
			if(result){
				refresh && clearCurrent();	//clean again incase too frequent request causing unclean

				var items = result.items || [];
				var l = items.length;

				self.certainBucketHasMore(l>=num);

				self.certainFileNum(self.certainFileNum()+l);
				
				var currentLastPage = [];
				if(self.certainFiles()){
					currentLastPage = self.certainFiles()[self.certainFiles().length-1];
				}
				

				var pageFiles = [];
				for(var i=0; i<l; i++){
					if(currentLastPage && currentLastPage.length < numInPage){
						currentLastPage.push(new File(items[i]));
					}else{
						if(pageFiles.push(new File(items[i])) >= numInPage){
							self.certainFiles.push(pageFiles);
							pageFiles = [];
						}
					}
					
				}
				if(pageFiles.length > 0) {
					self.certainFiles.push(pageFiles);
				}

				self.certainMarker(result.marker);

				self.status.setStatus("certainFiles", true);
			}
			if(callback) callback(self.certainFiles(), marker);
		}, function(err){
			log("getCertainFiles Error: ", err);
			fail(err);
		});
	};

	self.getBuckets = function (num, callback) {
        self.status.setStatus("buckets", false);
		num = num || maxLoadBucketNum;

		var bucketsName = self.bucketsName();
		var l = bucketsName.length;
		var currentBucketsNum = self.currentBucketsNum;
		var i, buckets = [];
		if(l>num + currentBucketsNum) l = num + currentBucketsNum;
		for (i = currentBucketsNum;  i< l; i++) {
			var bucketName = bucketsName[i];

			var f = (function(){
				var index = i; // use closure to ensure the sequence of each bucket (as it is in the bucketNames)
				return function(bucket){
					self.buckets()[index] = bucket;
					self.buckets.splice(0,0);// to trigger
					self.currentBucketsNum++;
					if(self.currentBucketsNum == l){
						/*for(var j=self.currentBucketsNum;j<buckets.length;j++){
							self.buckets.push(buckets[j]);
							self.currentBucketsNum++;
						}*/
						self.status.setStatus("buckets", true, self.buckets());
						if(callback) callback();
					}
				};
			})();

			self.getBucketInfo(bucketName, f);
		}
	};
}

var model = new UserViewModel();

var shortCuts = {
	// ESC
	"27": function(event){ 
		$(".curtain").hide();
	}
};

$(function() {
	$.getTemplates();

	$(".op", "#box-right-ops").setActive("current");
	if(location.pathname !== "/"){
		$("#box-right-ops").find("[href='/']").removeClass("current");
	}

	$("body").on("keyup", function(e){
		if(e.keyCode){
			var cmd = e.keyCode.toString();
			shortCuts[cmd] && shortCuts[cmd]();
		}
	});

	$(".choices > .choice", ".box").setActive("current");

	$("#account-ops").bindClick();


	showPwd($(".show-pwd"));

	ko.applyBindings(model);

	model.todo.Register("bucketsNameReady", function(){
		var bucketMoreTip = $("#bucket-more-tip");
		var initialWord = bucketMoreTip.text();
		var endWord = "没有更多";
		var scroller = $("#bucket-ops").simulateScroll($("#bucket-ops > a"), 41, 6, function(){
			bucketMoreTip.text(endWord);
		}, function(){
			bucketMoreTip.text(initialWord);
		});

		if(typeof _bucketName !== "undefined"){
			if(model.bucketsName().indexOf(_bucketName)<0){
				//Go back to "/" if this bucket does not exist
				location.href = location.origin;
			}
		}

		$("#bucket-ops .bucket-op>span").each(function(){
			var t = $(this);
			$(this).on("mouseenter", function(){
				t = $(this).autoScrollX();
				t && t.startScroll(4);
			}).on("mouseleave", function(){
				t && t.stopScroll();
			});
		});
	});

	$("input").first().focus();

	/**
	 * Tip
	 */
	console.log("Hi~如果遇到异常，使用toggleLog()打开或关闭log，方便发现问题并反馈给我们。");
});
