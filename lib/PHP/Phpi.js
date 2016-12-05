var execFile = require('child_process').execFile,
    Writer = require('../File/Writer'),
    FileUtil = require('../Util/FileUtil'),
    util = require("util"),
    EventEmitter = require("events").EventEmitter;


var Phpi = function() {
}

util.inherits(Phpi,EventEmitter);

Phpi.prototype.run = function(code) {
    if(code) {
        var writer = new Writer();
        var phpTemp = `${(new FileUtil()).getRandomFileName()}.php`;
        writer.write(code,phpTemp);
        writer.once('written',fileName => this.interpret(fileName));
        writer.once('failed',error => this.failedToWrite(error));   
    }
}


Phpi.prototype.interpret = function(fileName) {
    if(fileName) {
        const child2 = execFile('php', [fileName], (error, stdout, stderr) => {
          if (error) {
            this.emit('f2run',error);
          }else {
              this.emit('phpo',stdout);
          }
        });
    }
}

Phpi.prototype.failedToWrite = function(error) {
    console.log(error);
}

module.exports = Phpi;