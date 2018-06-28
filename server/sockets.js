const gameStore = require('./redux/store');
const actions = require('./redux/actions')

module.exports = function(io){

    function update(){
        console.log('emitting UPDATE');
        io.emit('UPDATE', gameStore.getState());
    }

    io.on('connection', (socket) => {

        // connect and disconnect

        console.log('new connection made');
        gameStore.dispatch(actions.addPlayer(socket.id, 'dummy name'));
        console.log(gameStore.getState());
        console.log('emitting INIT / UPDATE');
        socket.emit('INIT', gameStore.getState());
        socket.broadcast.emit('UPDATE', gameStore.getState());

        socket.on('disconnect', function(){
            let theState = gameStore.getState();
            let leaver = theState.players.find((player)=>{
                return player.socketid == socket.id;
            });
            console.log('sockets.js says: '+leaver.name+' disconnected');
            gameStore.dispatch(actions.removePlayer(leaver));
            update();
        });



        // ready and game start

        socket.on(actions.READY, (payload)=>{
            console.log('sockets.js says: heard READY');
            console.log(payload);
            gameStore.dispatch(actions.ready(payload.actor));
            let readyState = gameStore.getState();
            let allReady = readyState.players.reduce((acc, flag)=>{
                return (acc && flag.ready);
            }, true);
            if (allReady){
                io.emit('GAME_STARTED');
                gameStore.dispatch(actions.gameStart());
                update();
                io.emit('TURN_START');
            }
        });



        // hear TURN_ACK, dispatch TURN_START, respond either DIVINE_STEP_START or 

        socket.on(actions.TURN_ACK, (payload)=>{
            console.log('sockets.js says: heard TURN_ACK');
            gameStore.dispatch(actions.turnStart());
            update();
        });



        // 









        socket.on(actions.ATTACK, (payload)=>{
            console.log('sockets.js says: heard ATTACK');
            gameStore.dispatch(actions.attack(payload.actor, payload.target, payload.value));
            update();
        });

        socket.on(actions.ATTACK_ALL, (payload)=>{
            console.log('sockets.js says: heard ATTACK_ALL');
            gameStore.dispatch(actions.attackAll(payload.actor, payload.value));
            update();
        })

        socket.on(actions.CURE, (payload)=>{
            console.log('sockets.js says: heard CURE');
            gameStore.dispatch(actions.cure(payload.actor, payload.value));
            update();
        });

        socket.on(actions.SHIELD, (payload)=>{
            console.log('sockets.js says: heard SHIELD');
            gameStore.dispatch(actions.shield(payload.actor, payload.value));
            update();
        });

        socket.on(actions.HP_PLUS, (payload)=>{
            console.log('sockets.js says: heard HP_PLUS');
            gameStore.dispatch(actions.hpPlus(payload.actor, payload.value));
            update();
        });        

        socket.on(actions.HP_MINUS, (payload)=>{
            console.log('sockets.js says: heard HP_MINUS');
            gameStore.dispatch(actions.hpMinus(payload.actor, payload.target, payload.value));
            update();
        });

        socket.on(actions.AP_PLUS, (payload)=>{
            console.log('sockets.js says: heard AP_PLUS');
            gameStore.dispatch(actions.apPlus(payload.actor, payload.value));
            update();
        });

        socket.on(actions.AP_MINUS, (payload)=>{
            console.log('sockets.js says: heard AP_MINUS');
            gameStore.dispatch(actions.apMinus(payload.actor, payload.target, payload.value));
            update();
        });

        // card stuff

        socket.on(actions.DIVINE, (payload)=>{
            console.log('sockets.js says: heard DIVINE');
            gameStore.dispatch(actions.divine(payload.actor, payload.value, payload.yx));
            // regular state with HIGHLIGHT data
            socket.broadcast.emit('UPDATE', gameStore.getState());
            // super secret state with divined cards faceUp = true
            let ephemeral = gameStore.getState();
            for(c of payload.yx){
                ephemeral.gameboard.grid[c[0]][c[1]].faceUp = true;
            }
            socket.emit('UPDATE', ephemeral);
        });

        socket.on(actions.UNHIGHLIGHT, ()=>{
            console.log('sockets.js says: heard UNHIGHLIGHT');
            gameStore.dispatch(actions.unhighlight());
            update();
        });

        socket.on(actions.WEAVE, (payload)=>{
            console.log('sockets.js says: heard WEAVE');
            gameStore.dispatch(actions.weave(payload.actor, payload.yx1, payload.yx2));
            update();
            socket.broadcast.emit('HIGHLIGHT', {type: 'WEAVE', coords: [payload.yx1, payload.yx2]});
        });

        socket.on(actions.OBSCURE, (payload)=>{
            console.log('sockets.js says: heard OBSCURE');
            gameStore.dispatch(actions.obscure(payload.actor, payload.value, payload.yx));
            update();
            socket.broadcast.emit('HIGHLIGHT', {type: 'OBSCURE', coords: payload.yx});
        });

        socket.on(actions.SCRY, (payload)=>{
            console.log('sockets.js says: heard SCRY');
            gameStore.dispatch(actions.scry(payload.actor, payload.value, payload.yx));
            update();
            socket.broadcast.emit('HIGHLIGHT', {type: 'SCRY', coords: payload.yx});
        });        


        // refresh, learn, etc 

    

        
    });


}