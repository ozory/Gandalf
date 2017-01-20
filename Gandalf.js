var express = require('express');

var service = require('./modules/services');
var config = require('./modules/config');
var watcher = require('./modules/watcher');
const request = require('request');


var configFiles;
var actualRequest;
var app = express();

app.all('/*',function (req, res, next) {

    service.Inspec(req).then(function (result) {
        if (result.status == 200) {
            
            
            
            executeCall(result).then(function(body)
            {
                res.writeHead(200, { 'Content-Type': 'application/json' });
               // res.status(200).json(body);
                res.send(body);
                res.end();
            });
        }
    });
    next();
});

var executeCall = function (result, response) {

    return new Promise(function (resolve, reject) 
    {
        const options =
            {
                url: result.uri,
                method: result.method,
                headers:
                {
                    'Accept': 'application/json',
                    'Accept-Charset': 'utf-8',
                    'User-Agent': 'my-reddit-client'
                }
            };

        request(options, function (err, res, body) {
            return resolve(JSON.parse(body));
        });
    });
}

var initWatcher = function () {
    watcher.InitWatch(configFiles.apis, resetWatcher)
}

var resetWatcher = function () {
    Init();
    watcher.Clear();
}

// Carrega as Apis 
var loadApis = function () {
    service.LoadApis(configFiles.apis).then(function (result) {
        app.listen(configFiles.port);
        console.log("Gandalf is on the bridge...");
    }).catch(function (err) {
        console.log(err);
    });;
}

// Carrega a configuração
var Init = function () {
    config.loadConfig().then(function (configResult) {
        configFiles = configResult;
        loadApis();
        initWatcher();
    }).catch(function (err) {
        console.log(err);
    });
}

Init();