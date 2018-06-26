// WIZARD CARD DUELS

// Programmed at Coding Dojo Bellevue, June 2018, by Wizards 'Я' Us
// (Jordan Hudson, Alex Hunter, and Jym Tuesday Paschall)

// Angular front-end and SASS styling by Jordan Hudson
// Socket and event handling by Jym Paschall
// MEAN back-end, Redux implementation, and game design by Alex Hunter


const express = require('express');
const app = express();
const server = app.listen(8000);

const gameStore = require('./redux/store');
const actions = require('./redux/actions')

const path = require('path');

const bodyParser = require('body-parser');
const io = require('socket.io').listen(server);
app.use(bodyParser.json());

app.use(express.static(path.join( __dirname, '../public/dist/public' )));

// require('./mongoose/mongoose.js');

app.get('/test', (req,res,next) => {
    gameStore.dispatch(actions.gameSetup());
    res.json(gameStore.getState());
});

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

// socket whatevers
io.on('connection', (socket) => {

    console.log('new connection made');
    gameStore.dispatch(actions.addPlayer(socket, 'dummy name'));
    console.log(gameStore.getState());
    console.log('emitting test event');
    socket.emit('testevent');
    

	socket.on('disconnect', function(){
		console.log('connection disconnected');
	});

	socket.on('join', function(data){ //mock write up for joining the game, setting up a template for most sockets
		socket.join(/*data.game*/);
		console.log('joined the game') // or name or do we want to just say player
		socket.broadcast.emit('new user joined', {/*user: data.id, */ message: 'player has joined the game'})
	});
	
});




