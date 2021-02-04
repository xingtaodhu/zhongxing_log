function bytesToSize(bytes) {
    let size = "";
    if (bytes === 0) return '0 B';
    let k = 1024;
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));

    if (i < units.length) {
        size = parseFloat((bytes / Math.pow(k, i)).toPrecision(3)) + " " + units[i];
    } else {
        size = parseFloat((bytes / Math.pow(k, units.length - 1)).toPrecision(3)) + ' ' + units[units.length - 1];
    }

    let sizestr = size + "";
    let len = sizestr.indexOf(".");
    let dec = sizestr.substr(len + 1, 2);
    if (dec === "00") { //当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 3);
    }
    return sizestr;
}

function formatDuration(mss) {
    let time = "-";
    if (parseInt(mss) > 0) {
        let days = Math.floor(mss / (1000 * 60 * 60 * 24));
        let hours = Math.floor((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((mss % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((mss % (1000 * 60)) / 1000);
        let ms = mss % 1000;

        time = "";
        if (days) time += `${days}天`;
        if (hours) time += `${hours}小时`;
        if (minutes) time += `${minutes}分钟`;
        if (seconds) time += `${seconds}秒`;
        if (ms) time += `${ms}毫秒`;
    }
    return time;
}


export {
    bytesToSize,
    formatDuration
}