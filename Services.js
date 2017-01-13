var arquivo = require('fs');

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

                    if(arquivos.length == files.length){
                        return resolve(arquivos);
                    }
                }); 
            });
        });
    });
}

// Inspeciona um arquivo de API
exports.Inspec = function(apiName, methodName, verb, Apis){

    return new Promise(function(resolve, reject){

        if(!apiName || !methodName || !verb){
            return reject(err)
        }
        else
        {
            Apis.filter(function(Apis)
            {
                if(Apis.name.toLowerCase() == apiName.toLowerCase())
                {
                    var methods = Apis.methods;
                    var method;
                    methods.filter(function (methods) 
                    {
                        if(methods.name.toLowerCase() == methodName.toLowerCase() && methods.verb.toLowerCase() == verb.toLowerCase())
                        {
                            method = methods;
                            if(Apis.auth && Apis.auth != undefined && Apis.auth != "")
                            {
                                method.auth = Apis.auth;
                            }
                            return;
                        }
                        return;
                    });
                    return resolve(method);
                }
            });
        }
    });
}