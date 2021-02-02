/* Requires */
var express = require('express');
var ws = require('ws');
var http = require('http');
var path = require('path');
const bodyParser = require("body-parser");

/* Config */
var port = 5022
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());
var server = http.createServer(app);
var sockets = new ws.Server({server});



// /* Express */
// app.set('port', port);


/* Routes */
app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {      
    console.log('requested /')
    res.render('index.html');
});

/* Logic */
sockets.on('connection', function(conn) {
    console.log('new connect');
    
    app.get("/showClusters", function(req, res) {
    let msg = {"method": "show", "data": req.body};
    let msg_str = JSON.stringify(msg)
    conn.send(msg_str);
    res.sendStatus(200);
    });

    app.get("/notifyEmergencyDescription", function(req, res) {
        let json_obj = req.body;
        let msg = {"method": "notify", "data": json_obj};
        let msg_str = JSON.stringify(msg);
        conn.send(msg_str);
        res.sendStatus(200);
    });

    
    conn.on('data', function(message) {
        var data = JSON.parse(message);
        return conn.write(JSON.stringify({type:'server', info:'spam', warn:clients[conn.id].warn}));
    });

    conn.on('close', function() {
        console.log('disconnected')
    });
});




server.listen(port);
// chat.installHandlers(server, {prefix:'/socket', log:function(){}});
console.log('ok')