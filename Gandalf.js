var http = require('http');
var service = require('./Services');
var config = require('./Configuration');


var Apis;
var configFiles;

// Inicia escuta do server
var server = http.createServer(function(request,response)
{
    if(request.url !== '/favicon.ico')
    {
        if(!configFiles)
        {
            config.loadConfig().then(function(configResult)
            {
                configFiles = configResult;
                InspecRequest( request, response );
            }).catch(function(err) 
            {
                console.log(err);
                // handle errors
            });
        }
        else
        {
            InspecRequest( request, response );
        }
    }
    else{
        response.end();
    }
});

var LoadApis = function()
{
     service.LoadApis().then(function(contents){
          Apis = contents;
     });
}

// Valida a chamada lendo o arquivo
var InspecRequest = function(request, response)
{
    var url = request.url;
    var Api = request.url.split("/")[1];
    var method = request.url.split("/")[2];

    service.Inspec(Api , method , request.method, Apis).then(function(result)
    {
        if(result)
        {
            response.writeHead(200,{"Content-Type": "text/html"});
            response.write("<h1>Encontrado com sucesso</h1>");
        }
        else
        {
            response.writeHead(404,{"Content-Type": "text/html"});
            response.write("<h1>Não encontrado</h1>");
        }
        response.end();
    });
}


server.listen(3000);
LoadApis();