function getDateStr(time) {
    const d = new Date(time);
    const dateStr = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日 " + getTwo(d.getHours()) + ":" + getTwo(d.getMinutes());
    return dateStr;
}
function getTwo(num) {
    if (num < 10) {
        return '0' + num;
    } else {
        return num;
    }
}
module.exports = {
    getDateStr : getDateStr
}