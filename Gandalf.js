var http = require('http');
var service = require('./modules/services');
var config = require('./modules/config');
var watcher = require('./modules/watcher');
var requester = require('./modules/requester');

var configFiles;
var actualRequest;

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

var InitWatcher = function()
{
    watcher.InitWatch(configFiles.apis, ResetWatcher)
}

var ResetWatcher = function()
{
    Init();
    watcher.Clear();
}

// Carrega as Apis 
var LoadApis = function()
{
    service.LoadApis(configFiles.apis).then(function(result)
    {
        server.listen(configFiles.port);
        console.log("Gandalf is on the bridge...");
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
    var nestedUrl = request.url.split("/")[3];

    if(nestedUrl){
        nestedUrl = "/"+nestedUrl;
    }
    
    actualRequest = request;
    service.Inspec(Api , method , request.method).then(function(result)
    {
        var requestResponse = requester.PerformRequest(result.url +nestedUrl,  result.verb, {}, request.headers, function(data){
            response.writeHead(result.status,{"Content-Type": "text/html"});
            response.write("<h1>"+result.message+"</h1>");
        });
        
        response.end();
    });
}

// Carrega a configuração
var Init = function()
{
    config.loadConfig().then(function(configResult)
    {
        configFiles = configResult;
        LoadApis();
        InitWatcher();
    }).catch(function(err) 
    {
        console.log(err);
   });
}

Init();