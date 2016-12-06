var Ingress = require('./lib/Ingress');

var source = "class Tester{public static void main(String args[]){System.out.println(4*3);}}";

var phpSource = "<?php for($i=0;$i<10;$i++){echo $i;}";

var jsSource = "console.log('hello from js');";

var messageObject = {
  'lang' : 'javascript',
  'source' : jsSource,
  'time_limit' : '',
  'memory_limit' : ''
};

var ingress = new Ingress();
ingress.parseMessage(messageObject);

ingress.on('output',(message) => {
    console.log(message);
});