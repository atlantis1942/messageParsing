$(function () {
    $('.panel-collapse').collapse('toggle');
    $("input[name^='decValue']").blur();
    $("#message").focus();
    $("#btn").click(function () {
        genMessage();
    });
    $("[data-toggle='tooltip']").tooltip();
});

function showTip (element) {
    console.log($(element).attr("for"));
}

function genHexFromDec(element, length) {
    var decValue = $(element).val();
    if (decValue === "") {
        return false;
    }
    var ret = DecToHex(decValue, length);
    $("#"+$(element).attr('id')+"Hex").val(ret);
}

function genHexFromBin(element, length) {
    var binValue = $(element).val();
    if (binValue === "") {
        return false;
    }
    var ret = BinToHex(binValue, length);
    $("#"+$(element).attr('id')+"Hex").val(ret);
}

function genTimeHex(element, length) {
    var decValue = $(element).val();
    if (decValue === "") {
        return false;
    }
    var dataLen = decValue.length;
    if (dataLen != 14) {
        return false;
    }
    var year = decValue.substr(2, 2);
    var month = decValue.substr(4, 2);
    var day = decValue.substr(6, 2);
    var hour = decValue.substr(8, 2);
    var minute = decValue.substr(10, 2);
    var second = decValue.substr(12, 2);
    var data = [];
    data.push(DecToHex(year, 1));
    data.push(DecToHex(month, 1));
    data.push(DecToHex(day, 1));
    data.push(DecToHex(hour, 1));
    data.push(DecToHex(minute, 1));
    data.push(DecToHex(second, 1));
    $("#"+$(element).attr('id')+"Hex").val(data.join(""));
}

function genASCHex(element) {
    var value = $(element).val();
    if (value === "") {
        return false;
    }
    var data = [];
    for (var i = 0; i < value.length; i++) {
        data.push(DecToHex(value.charCodeAt(i), 1));
    }
    $("#"+$(element).attr('id')+"Hex").val(data.join(""));
}

/**
 * 十进制转十六进制
 * @param decValue
 * @param length
 * @returns {string}
 * @constructor
 */
function DecToHex(decValue, length) {
    //十六进制每4位转换为1位，byte转换后长度为2，word为4，dword为8
    var len = length * 2
    var hexCharCode = [];
    var result = parseInt(decValue).toString(16).toUpperCase();
    while (len > result.length) {
        hexCharCode.push("0");
        len--;
    }
    hexCharCode.push(result);
    return hexCharCode.join("");
}


function BinToHex(binValue, length) {
    //十六进制每4位转换为1位，byte转换后长度为2，word为4，dword为8
    var len = length * 2;
    var hexCharCode = [];
    binValue = binValue.split("").reverse().join("")
    var result = parseInt(binValue, 2).toString(16).toUpperCase();
    while (len > result.length) {
        hexCharCode.push("0");
        len--;
    }
    hexCharCode.push(result);
    return hexCharCode.join("");
}

function genMessage() {
    var payloadData = [];
    $("input[name=hexValue00]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("01");
    $("input[name=hexValue01]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("02");
    $("input[name=hexValue02]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("03");
    $("input[name=hexValue03]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("04");
    $("input[name=hexValue04]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("05");
    $("input[name=hexValue05]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("06");
    $("input[name=hexValue06]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("07");
    $("input[name=hexValue07]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("08");
    $("input[name=hexValue08]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("09");
    $("input[name=hexValue09]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("80");
    $("input[name=hexValue80]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("81");
    $("input[name=hexValue81]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("82");
    $("input[name=hexValue82]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("83");
    $("input[name=hexValue83]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("84");
    $("input[name=hexValue84]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("85");
    $("input[name=hexValue85]").each(function() {
        payloadData.push($(this).val())
    });
    payloadData.push("86");
    $("input[name=hexValue86]").each(function() {
        payloadData.push($(this).val())
    });
    //$("#message").val(payloadData.join(""));
    var payload = payloadData.join("");
    var payloadLen = payload.length/2;
    $("#payloadLength").val(payloadLen);
    $("#payloadLengthHex").val(DecToHex(payloadLen, 2));
    var messageData = [];
    $("input[name=hexValueHead]").each(function() {
        messageData.push($(this).val())
    });
    //messageData.push(DecToHex(payloadLen, 2));
    messageData.push.apply(messageData, payloadData);
    var msg = messageData.join("");
    var checkCode = genCheckCode(msg);
    $("#checkCodeHex").val(checkCode);
    msg = msg + checkCode;
    $("#message").val(msg);
}

function genCheckCode(msg) {
    //去掉消息头
    msg = msg.substr(4);
    //取首字节
    var part = msg.substr(0, 2);
    for (var i = 2; i < msg.length; i = i + 2 ) {
        var other = msg.substr(i, 2);
        part = (parseInt(part, 16)) ^ (parseInt(other, 16));
        part = part.toString(16);
    }
    return part.toUpperCase();
}