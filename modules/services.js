var arquivo = require('fs');
var Apis;

// Carrega as apis
exports.LoadApis = function (apisDirectory) 
{
    return new Promise(function (resolve, reject) 
    {
        var arquivos = [];
        arquivo.readdir(apisDirectory, function (err, files) 
        {
            if (err) throw err;
            files.forEach(function (file) 
            {
                arquivo.readFile(apisDirectory + '/' +file, 'utf-8', function (err, data) 
                {
                    var content = JSON.parse(data);
                    arquivos.push(content);

                    if (arquivos.length == files.length) 
                    {
                        Apis = arquivos;
                        return resolve(true);
                    }
                });
            });
        });
    });
}

// Inspeciona um arquivo de API
exports.Inspec = function (apiName, methodName, verb) 
{
    return new Promise(function (resolve, reject) 
    {
        var serverToConnect = 
        {
            url: "",
            method: methodName,
            auth: "",
            status: 404,
            message: "Api e/ou método não encontrado."
        }

        if (!apiName || !methodName || !verb) 
        {
            return resolve(serverToConnect)
        }

        else 
        {

            Apis.filter(function(api)
            {
                if(api.name.toLowerCase() == apiName.toLowerCase()){
                    var methods = api.methods.filter(function(method)
                    {
                        if(method.name.toLowerCase() == methodName.toLowerCase() && method.verb.toLowerCase() == verb.toLowerCase())
                        {
                            serverToConnect.url = api.servers[0].url;
                            serverToConnect.message = "Api encontrada";
                            serverToConnect.status = 200;
                            serverToConnect.auth = api.auth ? api.auth : method.auth ;

                            return;
                        }
                    });
                }
            });
            
            return resolve(serverToConnect);
        }

    });
}