var hound = require('hound');

var Watcher;
exports.InitWatch = function (directory, event) 
{
    Watcher = hound.watch(directory);
    Watcher.on('change', function(file, stats) {
        event();
    });
    Watcher.on('create', function(file, stats) {
        event();
    });
    Watcher.on('delete', function(file, stats) {
       event();
    });
}

exports.Clear = function()
{
    Watcher.clear();
}
