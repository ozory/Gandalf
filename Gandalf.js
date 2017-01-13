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
       InspecRequest( request, response );
    }
    else{
        response.end();
    }
});

// Carrega a configuração
var Init = function()
{
    config.loadConfig().then(function(configResult)
    {
        configFiles = configResult;
        LoadApis(configFiles)
    }).catch(function(err) 
    {
        console.log(err);
   });
}

// Carrega as Apis 
var LoadApis = function(configFiles)
{
    service.LoadApis().then(function(result)
    {
        server.listen(configFiles.port);
        console.log("Server iniciado...");
    }).catch(function(err) 
    {
        console.log(err);
    });;
}

// Valida a chamada lendo o arquivo
var InspecRequest = function(request, response)
{
    var url = request.url;
    var Api = request.url.split("/")[1];
    var method = request.url.split("/")[2];

    service.Inspec(Api , method , request.method, Apis).then(function(result)
    {
        response.writeHead(result,{"Content-Type": "text/html"});
        response.write("<h1>"+result+"</h1>");
        response.end();
    });
}

Init();