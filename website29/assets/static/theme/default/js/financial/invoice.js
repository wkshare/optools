var parseTime = function(t){
	var d = new Date(t*1000);
	return getDay(0, d);
};

var genStat = function(bill){
	switch(bill.status()){
		case 0:
			return "未申请";
		case 1:
			return bill.update_time() + "申请，审核中";
		case 2:
			return "未通过，审核于" + bill.update_time();
		case 3:
			return "已完成，于" + bill.update_time();
		default:
			return "";
	}
};

var getBills = function(){
	var s = new Date();
	s.setDate(1);
	s.setMonth(0);
	s.setHours(0);
	s.setMinutes(0);
	s.setSeconds(0);
	s.setMilliseconds(0);

	var e = new Date();

	var genTimeStamp = function(t){
		return t.valueOf()*10000;
	}

    model.getBills(genTimeStamp(s), genTimeStamp(e),null, null,false);
};

var checkStatus = function(bill, callback, fail){
	postData({
		serial_num: bill.serial_num
	}, "/api/biz/invoicemgr/get", function(result){
		callback(result);
	}, function(err){
		fail(err);
	});
};

var checkBill = function(bill, event){
	var checkBox = $(event.target);
	bill.apply(checkBox.check());

	$("#get-invoice").setable(getApplyBillNum(model.bills())).on("click", function(){
		$("#curtain").curtainShow();
	});
	return true;
};

var apllyInvoice = function(bills, callback, fail){
	var checkedBills = [];
	$.each(bills, function(i,b){
		if(b.apply()){
			checkedBills.push(b.serial_num);
		}
	});

	postData({
		bills: checkedBills,
		name: $("#nameIn").val(),
		address: $("#addressIn").val(),
		contact: $("#contactIn").val(),
		phone: $("#phoneIn").val()
	}, "/api/biz/invoicemgr/add", function(result){
		callback(result);
	}, function(err){
		fail(err);
	});
};

var getApplyBillSum = function(bills){
	var sum = 0;
	$.each(bills, function(i,b){
		if(b.apply()){
			sum += b.money;
		}
	});
	return sum;
};

var getApplyBillNum = function(bills){
	var num = 0;
	$.each(bills, function(i,b){
		if(b.apply()){
			num ++;
		}
	});
	return num;
};

var checkInput = function(inputs){
	var isFinished = true;
	inputs.each(function(){
		if(!$(this).val()) isFinished = false;
	});
	return isFinished;
}

model.todo.Register("billsReady", function(bills){
	$.each(bills, function(i,bill){
		checkStatus(bill, function(result){
			if(result){
				bill.status(result.status);
				bill.create_time(parseTime(result.create_time));
				bill.update_time(parseTime(result.update_time));
			}else{
				bill.status(0);
			}
		}, function(err){
			bill.status(-1);
			log("checkstatus err: ", err);
		});
	});
});

$(function () {
	var curtain = $("#curtain");
	curtain.bindCurtainSwitches([$("#get-invoice")], [curtain.find(".close-box"), curtain.find("#close")], null, function(){
	});

	$("#apply").on("click", function(){
		apllyInvoice(model.bills(), function(result){
			log("applied.");
			$("#curtain").curtainHide().resetInput();
			getBills();
		}, function(err){
			log("apply err: ", err);
			//getBills();
		});
	});

	var inputs = curtain.find("input");
	inputs.on("keyup", function(){
		var isFinished = checkInput(inputs);
		$("#apply").setable(isFinished);
	});

	getBills();
});