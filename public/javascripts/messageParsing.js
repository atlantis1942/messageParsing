$(function () {
    $('.panel-collapse').collapse('toggle');
    $("input[name^='decValue']").blur();
    $("#message").focus();
    $("#btn").click(function () {
        genMessage();
    });
    $("[data-toggle='tooltip']").tooltip();
    $('#myTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })
    $('#messageType').change(function () {
        $('#messageTypeHex').val($('#messageType').val());
    })
});

/**
 * 显示属性提示信息
 * @param element
 */
function showTip (element) {
    $(element).attr("title", tips[$(element).attr("code")]).tooltip('fixTitle').tooltip('show');
}

/**
 * 十进制生成十六进制字符串
 * @param element
 * @param length
 * @returns {boolean}
 */
function genHexFromDec(element, length) {
    var decValue = $(element).val();
    if (decValue === "") {
        return false;
    }
    var ret = DecToHex(decValue, length);
    $("#"+$(element).attr('id')+"Hex").val(ret);
}

/**
 * 二进制生成十六进制字符串（大端翻转）
 * @param element
 * @param length
 * @returns {boolean}
 */
function genHexFromBin(element, length) {
    var binValue = $(element).val();
    if (binValue === "") {
        return false;
    }
    var ret = BinToHex(binValue, length);
    $("#"+$(element).attr('id')+"Hex").val(ret);
}

/**
 * 日期生成十六进制字符串
 * @param element
 * @param length
 * @returns {boolean}
 */
function genTimeHex(element, length) {
    var decValue = $(element).val();
    if (decValue === "") {
        return false;
    }
    var dataLen = decValue.length;
    if (dataLen != 12) {
        return false;
    }
    var year = decValue.substr(0, 2);
    var month = decValue.substr(2, 2);
    var day = decValue.substr(4, 2);
    var hour = decValue.substr(6, 2);
    var minute = decValue.substr(8, 2);
    var second = decValue.substr(10, 2);
    var data = [];
    data.push(DecToHex(year, 1));
    data.push(DecToHex(month, 1));
    data.push(DecToHex(day, 1));
    data.push(DecToHex(hour, 1));
    data.push(DecToHex(minute, 1));
    data.push(DecToHex(second, 1));
    $("#"+$(element).attr('id')+"Hex").val(data.join(""));
}

/**
 * 字符串获取ASCII
 * @param element
 * @returns {boolean}
 */
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
 * 生成报文
 */
function genMessage() {
    var type = $('#myTab li.active a').attr("code");
    $("#message").val("");
    var payloadData = [];
    $("#" + type + " input[name=hexValueMsg]").each(function() {
        payloadData.push($(this).val())
    });
    var payload = payloadData.join("");
    var payloadLen = payload.length/2;
    $("#payloadLength" + "_" + type).val(payloadLen);
    $("#payloadLengthHex" + "_" + type).val(DecToHex(payloadLen, 2));
    var messageData = [];
    $("#" + type + " input[name=hexValueHead]").each(function() {
        messageData.push($(this).val())
    });
    messageData.push.apply(messageData, payloadData);
    var msg = messageData.join("");
    var checkCode = genCheckCode(msg);
    $("#checkCodeHex" + "_" + type).val(checkCode);
    msg = msg + checkCode;
    $("#message").val(msg);
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

/**
 * 二进制转十六进制
 * @param binValue
 * @param length
 * @returns {string}
 * @constructor
 */
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

/**
 * 生成校验码（异或）
 * @param msg
 * @returns {string}
 */
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