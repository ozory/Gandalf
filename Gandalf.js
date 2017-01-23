const express = require('express');
const service = require('./modules/services');
const config = require('./modules/config');
const watcher = require('./modules/watcher');
const request = require('request');


var configFiles;
var app = express();

app.all('/*', function (req, res, next) {

    service.Inspec(req).then(function (result) {
        if (result.status == 200) {

            executeCall(result).then(function (body) {
                res.status(result.status).send(body); 
                next();
            });

        }
    });

});

var executeCall = function (result, response) {

    return new Promise(function (resolve, reject) {
        const options =
            {
                url: result.uri,
                method: result.method,
                headers:
                {
                    'Accept': 'application/json',
                    'Accept-Charset': 'utf-8'
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