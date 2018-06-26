const gameStore = require('./redux/store');
const actions = require('./redux/actions')

module.exports = function(io){

    io.on('connection', (socket) => {

        console.log('new connection made');
        gameStore.dispatch(actions.addPlayer(socket.id, 'dummy name'));
        console.log(gameStore.getState());
        console.log('emitting test event');
        socket.emit('testevent', gameStore.getState());

        socket.on('ATTACK', (payload)=>{
            console.log(payload);
            gameStore.dispatch(actions.attack(payload.actor, payload.target, payload.value));
            console.log(gameStore.getState());
        });
    
        socket.on('disconnect', function(){
            console.log('connection disconnected');
            let theState = gameStore.getState();
            let leaver = theState.players.find((player)=>{
                return player.socketid == socket.id;
            });
            gameStore.dispatch(actions.removePlayer(leaver));
            console.log(gameStore.getState());
        });
    
        // socket.on('join', function(data){ //mock write up for joining the game, setting up a template for most sockets
        // 	socket.join(/*data.game*/);
        // 	console.log('joined the game') // or name or do we want to just say player
        // 	socket.broadcast.emit('new user joined', {/*user: data.id, */ message: 'player has joined the game'})
        // });
        
    });


}