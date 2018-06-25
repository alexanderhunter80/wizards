// WIZARD CARD DUELS

// Programmed at Coding Dojo Bellevue, June 2018, by Wizards 'Я' Us
// (Jordan Hudson, Alex Hunter, and Jym Tuesday Paschall)

// Angular front-end and SASS styling by Jordan Hudson
// Socket and event handling by Jym Paschall
// MEAN back-end and Redux implementation by Alex Hunter


const express = require('express');
const app = express();
const server = app.listen(8000);

const gameStore = require('./redux/store');
const actions = require('./redux/actions')

const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static(path.join( __dirname, '../public/dist/public' )));

// require('./mongoose/mongoose.js');

app.get('/test', (req,res,next)=>{
    gameStore.dispatch(actions.gameSetup());
    res.json(gameStore.getState());
});

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

