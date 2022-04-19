const express = require('express')
const app = express();
const path = require('path');
const port = 3000;

// 讓html可以使用js和css
app.use(express.static(__dirname));

app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.listen(port,() =>{
    console.log('App is listening to port '+ port);
});

