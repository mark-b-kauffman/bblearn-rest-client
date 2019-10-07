// SEE THE LICENSE
// File: bblearn-rest-client.js
// Purpose: Build an Object that can make REST API calls to any Learn system that supports REST.
var fs = require('fs');
var request = require('request');
var rp = require('request-promise-native');

exports.BbLearnRestClient  = function(fqdn, key, secret) {
    let $client = this;
    let token = null;
    $client._fqdn = fqdn;
    $client._key = key;
    $client._secret = secret;
    $client._authorization = 'Basic ' + new Buffer.from($client._key + ':' + $client._secret).toString('base64');

    $client._requestAuthToken = async function requestAuthToken(parameters = {grant_type: 'client_credentials'}) {
        // POST to '/learn/api/public/v1/oauth2/token'
        // parameters are the JSON object for the parameters. May be empty. 
        // If empty grant_type defaults to 'client_credentials'
        var result = null;
        var options = {
            method: 'post',
            url: 'https://' + $client._fqdn + '/learn/api/public/v1/oauth2/token',                
            headers: {Authorization: $client._authorization},
            form: {grant_type: `${parameters.grant_type}`},
            json: true,
            resolveWithFullResponse: false
        }; 
        console.log(`_RequestAuthToken - parameters: ${JSON.stringify(parameters)}`);
        
        await rp(options)
            .then(function (parsedBody){
                result = parsedBody;
                // POST succeeded
            })
            .catch(function (err){
                result = err;
                // POST Failed
            });
        return result;
    }

    $client.getAuthToken = function(parameters = {grant_type: 'client_credentials'}){
        result = this._requestAuthToken(parameters);
        return result;
    }
}; 

exports.BbLearnRestClient;