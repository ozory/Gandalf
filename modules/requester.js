var querystring = require('querystring');
var http = require('http');


exports.PerformRequest = function performRequest(request, data, headers, success) 
{
    var dataString = JSON.stringify(data);
    var options = 
    {
        host: request.host,
        path: request.path,
        method: request.verb,
        port: request.port
    };

    var req = http.request(options, function (res) 
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