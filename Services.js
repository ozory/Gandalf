var arquivo = require('fs');
var mongoose = require('mongoose');
var schemas = require('./Schemas');

var ApiSchema;

// Carrega as apis
exports.LoadApis = function () {
    return new Promise(function (resolve, reject) {
        var arquivos = [];
        arquivo.readdir('./apis/', function (err, files) {
            if (err) throw err;
            files.forEach(function (file) {
                arquivo.readFile('./apis/' + file, 'utf-8', function (err, data) {
                    var content = JSON.parse(data);
                    arquivos.push(content);

                    if (arquivos.length == files.length) {
                        CreateCollection(arquivos).then(function () {
                            return resolve(true);
                        });
                    }
                });
            });
        });
    });
}

// Inspeciona um arquivo de API
exports.Inspec = function (apiName, methodName, verb, Apis) {
    return new Promise(function (resolve, reject) {

        var serverToConnect = {
            url: "",
            method: methodName,
            status: 404,
            message: "Api e/ou método não encontrado."
        }

        if (!apiName || !methodName || !verb) {
            return resolve(serverToConnect)
        }
        else {
            var query = ApiSchema.findOne({ "name": apiName, "methods.name": methodName });
            query.exec(function (err, data) {
                if (err || !data) {
                    return resolve(serverToConnect);
                }
                else {
                    serverToConnect.url = data.servers[0].url;
                    serverToConnect.message = "Api encontrada";
                    serverToConnect.status = 200;
                }
                return resolve(serverToConnect);
            });
        }
    });
}

var CreateCollection = function (Apis) {
    return new Promise(function (resolve, reject) {
        var connection = mongoose.connection;

        if (!connection || !connection._hasOpened) {
            mongoose.connect("mongodb://localhost:27017/data/db/apis");
            mongoose.Promise = global.Promise;

            var db = mongoose.connection;
            db.once('open', function () {
                ApiSchema = schemas.GetApiSchema();
               return Load(resolve,reject, Apis);
            });
        }
        else{
            return Load(resolve,reject, Apis);
        }
        
    });
}

var Load = function (resolve, reject, Apis) {
    
    ApiSchema.collection.remove();
    ApiSchema.collection.insert(Apis, onInsert);

    function onInsert(err, data) {
        if (err) {
            return resolve(false);// TODO: handle error
        }
        else {
            return resolve(true);
        }
    }
}