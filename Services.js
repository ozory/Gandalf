var arquivo = require('fs');
var mongoose = require('mongoose');
var schemas = require('./Schemas');

var ApiSchema ;

// Carrega as apis
exports.LoadApis = function()
{
    return new Promise(function(resolve, reject){
        var arquivos = [];
        arquivo.readdir('./apis/', function(err, files) 
        {
            if(err) throw err;
            files.forEach(function(file) 
            { 
                arquivo.readFile('./apis/'+file, 'utf-8', function(err, data) 
                { 
                    var content = JSON.parse(data);
                    arquivos.push(content);

                    if(arquivos.length == files.length)
                    {
                        CreateCollection(arquivos).then(function()
                        {
                            return resolve(true);
                        });
                    }
                }); 
            });
        });
    });
}

// Inspeciona um arquivo de API
exports.Inspec = function(apiName, methodName, verb, Apis)
{
    return new Promise(function(resolve, reject){

        if(!apiName || !methodName || !verb){
            return resolve(404)
        }
        else
        {
           var query =  ApiSchema.findOne({"name": apiName, "methods.name": methodName});
           query.exec(function(err,data)
           {
                if (err || !data) return resolve(404);
                
                var serverToConnect ={
                    url : data.servers[0].url,
                    method : methodName
                }
                return resolve(JSON.stringify(serverToConnect));
           });
        }
    });
}

var CreateCollection = function(Apis)
{
    return new Promise(function(resolve, reject)
    {
        mongoose.connect("mongodb://localhost:27017/data/db/apis");
        mongoose.Promise = global.Promise;

        var db = mongoose.connection;
        db.once('open', function() 
        {
            ApiSchema = schemas.GetApiSchema();
            ApiSchema.collection.remove();
            ApiSchema.collection.insert(Apis, onInsert);

            function onInsert(err, data) 
            {
                if (err) 
                {
                    return resolve(false);// TODO: handle error
                } 
                else 
                {
                    return resolve(true);
                }
            }
        });
    });
}