/**
 * 存cookie
 * @param {string} name
 * @param {string} value
 * @param {string} time 失效时间, dxx/hxx/sxx(xx为数字), 分别代表 xx日/xx时/xx秒后失效
 */
function setCookie(name, value, time) {
    let str1 = time.substring(1, time.length) * 1;
    let str2 = time.substring(0, 1);
    let strsec = 0;
    if (str2 === "s") {
        strsec = str1 * 1000;
    } else if (str2 === "h") {
        strsec = str1 * 60 * 60 * 1000;
    } else if (str2 === "d") {
        strsec = str1 * 24 * 60 * 60 * 1000;
    }

    let exp = new Date();
    exp.setTime(exp.getTime() + strsec);
    document.cookie = `${name} = ${escape(value)};expires = ${exp.toGMTString()}`;
}

/**
 * 取cookie
 * @param {string} name
 */
function getCookie(name) {
    var arr;
    let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (reg.test(document.cookie)) {
        arr = document.cookie.match(reg);
        return unescape(arr[2]);
    } else
        return null;
}

/**
 * 删除cookie
 * @param {string} name
 */
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

const cookie = {setCookie, getCookie, delCookie}

export default cookie