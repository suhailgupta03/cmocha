var Javaci = require('./Java/Javaci'),
    Phpi = require('./PHP/Phpi'),
    util = require("util"),
    EventEmitter = require("events").EventEmitter;

function Ingress() {
    this.mandatoryParameters = ['source','lang','time_limit','memory_limit'];
    this.langSupported = ['JAVA','PHP','C','C++','JAVASCRIPT','NODEJS'];
}

util.inherits(Ingress,EventEmitter);

Ingress.prototype.parseMessage = function(message) {
    try{
        var output = {'status': false};
        
        if('object' === typeof message) {
            var completeRequest = true;
            // Check if the mandatory parameters were received
            this.mandatoryParameters.forEach(function(element) {
               if('undefined' === typeof message[element]) {
                   completeRequest = true;
                   return;
               } 
            });
            if(!completeRequest) {
                output.message = 'Insufficient parameters received';        
            }else {
                // If sufficient parameters were received, process the request
                this.rout(message);   
                output.status = true;
            }
        }
    }catch(e) {
        throw e;
    }
    return output;
}

Ingress.prototype.rout = function(actionObject) {
    var lang = actionObject.lang.toUpperCase();
    var source = actionObject.source;
    switch(lang) {
        case 'JAVA':
            var javaci = new Javaci();
            javaci.run(source);
            javaci.once('f2run',msg => this.output(msg));
            javaci.once('jvmo',msg => this.output(msg));
            break;
        case 'PHP':
            var phpi = new Phpi();
            phpi.run(source);
            phpi.once('f2run',msg => this.output(msg));
            phpi.once('phpo',msg => this.output(msg));
        default:
            break;
    }
}

Ingress.prototype.output = function(msg) {
    if(msg.message)
        this.emit('output',msg.message);
    else
        this.emit('output',msg);
}

module.exports = Ingress;