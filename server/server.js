const express = require('express');
const app = express();
const server = app.listen(8000);

const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static(path.join( __dirname, '../public/dist/public' )));

// require('./models/mongoose.js');

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

