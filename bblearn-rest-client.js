// Use of this code means you accept the terms of the included LICENSE file.
// Author: Mark Bykerk Kauffman - 2019.10
// File: bblearn-rest-client.js
// Purpose: Build an Object that can make REST API calls to any Learn system that supports REST.
var fs = require('fs');
var request = require('request');
var rp = require('request-promise-native');

exports.BbLearnRestClient  = function(fqdn, key, secret) {
    let $client = this;
    $client._token = null;
    $client._fqdn = fqdn;
    $client._key = key;
    $client._secret = secret;
    $client._authorization = 'Basic ' + new Buffer.from($client._key + ':' + $client._secret).toString('base64');
    $client._authTime = null;

    $client._requestAuthToken = async function requestAuthToken(parameters = {grant_type: 'client_credentials'}, options={}) {
        // POST to '/learn/api/public/v1/oauth2/token'
        // parameters are the JSON object for the parameters. May be empty. 
        // If empty grant_type defaults to 'client_credentials'
        var result = null;
        var defaultOptions = {
            method: 'post',
            url: 'https://' + $client._fqdn + '/learn/api/public/v1/oauth2/token',                
            headers: {Authorization: $client._authorization},
            form: {grant_type: `${parameters.grant_type}`},
            json: true,
            // insecure: false, These two were mentioned on stackoverflow. But I can't find doc and strictSSL has doc.
            // rejectUnauthorized: true,
            strictSSL: true,
            resolveWithFullResponse: false
        }; 
        
        let mergedOptions = {...defaultOptions, ...options};
        
        /*
        The Date.now() is an inbuilt function in JavaScript which returns the number of 
        milliseconds elapsed since January 1, 1970, 00:00:00 UTC. Since now() is a static
        method of Date, it will always be used as Date.now(). 
        */
        $client._authTime = Date.now(); // The time we got the auth token.
   
        await rp(mergedOptions)
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

    $client.isTokenStale = function (){
        let expires_in = $client._token.expires_in *1000; // TO DO: add the auth time to the expires_in time.

        let expires_at = $client._authTime + expires_in;
        let d = new Date(expires_at);


        let time_diff = expires_at - Date.now(); // To do expires at minus now.

        if (time_diff < 1000) console.log(`TOKEN WENT STALE!!`);
        return (time_diff < 1000); // return true if there's less than a second remaining.
    }

    $client.getAccessToken = async function(parameters = {grant_type: 'client_credentials'}, options ={}){
        if ($client._token == null || $client.isTokenStale()) {
            $client._token = await this._requestAuthToken(parameters, options);
        }
        return $client._token;
    }

    $client.getEndpoint = async function(path, id, params = {}, requestOptions = {}) {

    }
}; 

exports.BbLearnRestClient;