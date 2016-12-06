var execFile = require('child_process').execFile,
    Writer = require('../File/Writer'),
    util = require("util"),
    EventEmitter = require("events").EventEmitter;


var Javaci = function() {
    this.rootPackage = 'temp';
}

util.inherits(Javaci,EventEmitter);

Javaci.prototype.run = function(code) {
    if(code) {
        var classDetails = this.classToInject(code);
        if(Object.keys(classDetails).length > 0) {
            code = `${classDetails['classToInject']}${code}`;
            var writer = new Writer();
            writer.write(code,`${classDetails['className']}.java`);
            writer.once('written',fileName => this.compileAndRun(fileName));
            writer.once('failed',error => this.failedToWrite(error));   
        }
    }
}


Javaci.prototype.compileAndRun = function(fileName) {
    if(fileName) {
        const child2 = execFile('javac', [fileName], (error, stdout, stderr) => {
          if (error) {
            this.emit('f2run',error);
          }else {
              var pathToClassFile = fileName.replace('.java','').trim();
              var classFile = `${this.rootPackage}.${pathToClassFile.substr(pathToClassFile.lastIndexOf('/')+1,pathToClassFile.length)}`;
              execFile('java', [classFile], (error, stdout, stderr) => {
              if (error) {
                this.emit('f2run',error);
              }else {
                this.emit('jvmo',stdout);
              }
            });
          }
        });
    }
}

Javaci.prototype.failedToWrite = function(error) {
    console.log(error);
}

Javaci.prototype.classToInject = function(originalCode) {
    var classDetails = {};
    if(originalCode) {
        var userClassName = this.extractClassNameFromCode(originalCode);
        if(userClassName) {
            var c2userMain = `${userClassName}.main(null);`;
            var className = 'T'+ (new Date()).getTime();
            var cToInject = `package ${this.rootPackage};class ${className} {public static void main(String args[]){${c2userMain}}}`; 
            classDetails['className'] = className;
            classDetails['classToInject'] = cToInject;
        }   
    }
    return classDetails;
}

Javaci.prototype.extractClassNameFromCode = function(code) {
    var className;
    if(code) {
        var classNameList = code.match(/class[\s]+[\w\s]+[{]/g);
        if(classNameList && classNameList.length == 1) {
            className = classNameList[0].replace('class','').trim().replace('{','').trim();
        }else {
            // zero||multiple classes found
        }
    }
    return className;
}
module.exports = Javaci;