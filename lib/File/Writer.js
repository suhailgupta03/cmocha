var fs = require("fs"),
    moment = require('moment'),
    EventEmitter = require("events").EventEmitter,
    util = require("util");

function Writer() {
    this.tempDirName = 'temp';
}

/**
 * Inherits from WebSocketServer
 */
util.inherits(Writer,EventEmitter);

Writer.prototype.write = function(data,fname){
    if(data && fname) {
        fname = `./${this.tempDirName}/${fname}`;
        fs.writeFile(fname,data,(error) => {
           if(error) {
               this.emit('failed',error);
           }else {
               this.emit('written',fname)
           } 
        });
    }
}

module.exports = Writer;