// See the LICENSE
// File: app.js
// For exercising the library. Use: node app.js
const {BbLearnRestClient} = require('./bblearn-rest-client');
console.log('Running app.js');

var fqdn = 'bd-partner-a-original.blackboard.com';
var key = '28622588-2145-4003-bd1c-1027bcd5a0c1';
var secret = 'TMmqvWpnNf1Qqt4NCjU98A2oYKAsmgjX';
var myClient = new BbLearnRestClient(fqdn, key, secret);

console.log(JSON.stringify(myClient));

async function callGetAccessToken(){
    let result =  await myClient.getAccessToken();
    console.log(JSON.stringify(result));
}

callGetAccessToken();

