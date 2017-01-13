var arquivo = require('fs');

// Realiza a leitura inicial de configurações do projeto
exports.loadConfig = function(){

    return new Promise(function(resolve, reject){

        arquivo.readFile('./configs/gandalf.json','utf8',function(err, data)
            {
                if(err) return false;
                var config = JSON.parse(data);
                return resolve(config);
            });
    });
}