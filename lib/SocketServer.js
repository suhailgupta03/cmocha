var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8085 }),
    Ingress = require('./Ingress');
    

function newConnection(webSocket) {
    webSocket.on('message', function newMessage(message) {
         try {
            if(webSocket.username) {
                var ingress = new Ingress();
                ingress.parseMessage(message);
                ingress.once('output',(output) => {
                    webSocket.send(output);
                });
            }else if(!webSocket.username && message.username){
                webSocket.username = message.username;
            }
          }catch(e) {
              throw e;
          }
    });
}
wss.on('connection', webSocket => newConnection(webSocket)); 

