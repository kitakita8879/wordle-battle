const express = require('express')
const app = express();
const path = require('path');
const port = 3000;
var fs = require('fs');
var http = require('http');
var httpServer = http.createServer(app);
// For http
// httpServer.listen(3000,'0.0.0.0');


// 讓html可以使用js和css
app.use(express.static(__dirname));

app.get('/',(req, res) => {
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.listen(process.env.PORT || port,() =>{
    console.log('App is listening to port '+ port);
});

