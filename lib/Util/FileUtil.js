
function FileUtil(){}

FileUtil.prototype.getRandomFileName = function() {
    return (new Date()).getTime();
}

module.exports = FileUtil;