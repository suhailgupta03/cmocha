var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8085 }),
    Ingress = require('./Ingress');
    

function newConnection(webSocket) {
    webSocket.on('message', function newMessage(message) {
         try {
            var msgObject = JSON.parse(message);
            if(webSocket.username) {
                var ingress = new Ingress();
                ingress.parseMessage(msgObject);
                ingress.once('output',(output) => {
                    webSocket.send(output);
                });
            }else if(!webSocket.username && msgObject.username){
                webSocket.username = msgObject.username;
            }
          }catch(e) {
              throw e;
          }
    });
}
wss.on('connection', webSocket => newConnection(webSocket)); 

