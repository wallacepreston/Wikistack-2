const http = require('http');
const server = http.createServer();
const models = require('./models');

server.on('request', require('./app'));

//sync creates the table if it does not exist. alter true creates the tables and makes any changes to keep the modules in sync
//order matters because we cannot drop the User table if there are items in the Page table that reference it
models.db.sync() //{ alter: true }
    .then(function () {
        server.listen(3001, function () {
            console.log('Server is listening on port 3001!');
        });
    })
    .catch(console.error);

