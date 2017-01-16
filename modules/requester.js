var querystring = require('querystring');
var https = require('https');


exports.PerformRequest = function performRequest(host, method, data, headers, success) 
{
    var dataString = JSON.stringify(data);
    var options = 
    {
        host: host,
        method: method,
        headers: headers
    };

    var req = https.request(options, function (res) 
    {
        res.setEncoding('utf-8');
        var responseString = '';

        res.on('data', function (data) 
        {
            responseString += data;
        });

        res.on('end', function ()
        {
            console.log(responseString);
            var responseObject = JSON.parse(responseString);
            success(responseObject);
        });

    });

    req.on('error', function(e) 
    {
        console.log('problem with request: ' + e.message);
    });

    req.write(dataString);
    req.end();
}