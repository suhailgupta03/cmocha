var Ingress = require('./lib/Ingress');

var source = "class Tester{public static void main(String args[]){System.out.println(4*3);}}";

var phpSource = "<?php for($i=0;$i<10;$i++){echo $i;}";

var messageObject = {
  'lang' : 'php',
  'source' : phpSource,
  'time_limit' : '',
  'memory_limit' : ''
};

messageObject = JSON.stringify(messageObject);

var ingress = new Ingress();
ingress.parseMessage(messageObject);