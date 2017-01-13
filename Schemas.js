var mongoose = require('mongoose');

exports.GetApiSchema = function(){

    var Schema = mongoose.Schema(
    {
        name: String,
        version: String,
        description: String,
        methods:  
        [{ 
            name: String, 
            verb: String,
            auth: String 
        }],
        servers:  
        [{ 
            url: String
        }]
    });

    var ApiSchema = mongoose.model('Apis', Schema);
    return ApiSchema;
}