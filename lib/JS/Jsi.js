var execFile = require('child_process').execFile,
    Writer = require('../File/Writer'),
    FileUtil = require('../Util/FileUtil'),
    HttpClient = require('../Http/HttpClient'),
    util = require("util"),
    EventEmitter = require("events").EventEmitter;


var Jsi = function() {
    this.closureCompilerAddress = 'closure-compiler.appspot.com';
    this.closureCompilerPath = 'compile';
    this.code = null;
}

util.inherits(Jsi,EventEmitter);

Jsi.prototype.run = function(code) {
    if(code) {
        this.code = code;
        var closureParams = {
              'js_code' : code,
              'compilation_level' : 'WHITESPACE_ONLY',
              'output_format' : 'json',
              'output_info' : 'errors'
        }
        var httpClient = new HttpClient(this.closureCompilerAddress);
        httpClient.sendPost(this.closureCompilerPath,closureParams);
        httpClient.once('downstream',chunk => this.parseClosureResponse(chunk));
        
        this.once('no-closure-error',() => this.writeJsTemp());
    }
}


Jsi.prototype.parseClosureResponse = function(chunk) {
    if('{}' === chunk) {
        // No errors
        this.emit('no-closure-error');
    }else {
        // Has errors
        var chunkObj = JSON.parse(chunk);
        var errorObj = chunkObj.errors[0];
        var completeError = `${errorObj.error} on line ${errorObj.line} at line number ${errorObj.lineno}`;
        this.emit('f2run',completeError);
    }
}


Jsi.prototype.writeJsTemp = function() {
    if(this.code) {
        var writer = new Writer();
        var jsTemp = `${(new FileUtil()).getRandomFileName()}.js`;
        writer.write(this.code,jsTemp);
        writer.once('written',fileName => this.runWithNode(fileName));
        writer.once('failed',error => this.failedToWrite(error));  
    }      
}

Jsi.prototype.runWithNode = function(fileName) {
    if(fileName) {
        const child2 = execFile('node', [fileName], (error, stdout, stderr) => {
          if (error) {
            this.emit('f2run',error);
          }else {
              this.emit('jso',stdout);
          }
        });
    }
}

Jsi.prototype.failedToWrite = function(error) {
    console.log(error);
}

module.exports = Jsi;