function getDateStr(time) {
    const d = new Date(time);
    const dateStr = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日 " + d.getHours() + ":" + d.getMinutes();
    return dateStr;
}
module.exports = {
    getDateStr : getDateStr
}