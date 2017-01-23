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
exports.Inspec = function (request) 
{

    var url = request.url;
    var Api = request.url.split("/")[1];
    var version = request.url.split("/")[2];
    var resource = request.url.split("/")[3];

    return new Promise(function (resolve, reject) 
    {
        var serverToConnect = 
        {
            uri: "",
            method: request.method,
            status: 404,
            message: "Api e/ou método não encontrado.",
            headers: ""
        }

        if (!Api || !resource || !request.method || !version) 
        {
            return resolve(serverToConnect)
        }
        else 
        {
            Apis.filter(function(api)
            {
                if(api.name.toLowerCase() == Api.toLowerCase() && api.version.toLowerCase() == version.toLowerCase())
                {
                    var resources = api.resources.filter(function(resources)
                    {
                        if(resources.name.toLowerCase() == resource.toLowerCase() && resources.method.toLowerCase() == request.method.toLowerCase())
                        {
                            serverToConnect.uri = api.servers[0].host + request.url;
                            serverToConnect.message = "Api encontrada";
                            serverToConnect.status = 200;
                            serverToConnect.auth = api.auth ? api.auth : resource.auth ;
                            return;
                        }
                    });
                }
            });
            return resolve(serverToConnect);
        }

    });
}