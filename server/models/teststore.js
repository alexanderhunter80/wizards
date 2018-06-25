let redux = require('redux');
let actions = require('./actions.js');
let reducers = require('./reducers.js');
let gameApp = reducers.gameApp;

const gameStore = redux.createStore(gameApp);




// testing time

console.log(gameStore.getState());

const unsubscribe = gameStore.subscribe(() => {
    console.log(gameStore.getState());
})

let s;
gameStore.dispatch(actions.addPlayer(123589,'Cartman'));
s = gameStore.getState();
let cartman = s.players[s.players.length-1];
gameStore.dispatch(actions.addPlayer(872136,'Kyle'));
s = gameStore.getState();
let kyle = s.players[s.players.length-1];
gameStore.dispatch(actions.addPlayer(168683,'Stan'));
s = gameStore.getState();
let stan = s.players[s.players.length-1];
gameStore.dispatch(actions.addPlayer(712394,'Kenny'));
s = gameStore.getState();
let kenny = s.players[s.players.length-1];


console.log('setting up gameboard');
console.log(actions.gameSetup());
gameStore.dispatch(actions.gameSetup());

gameStore.dispatch(actions.attack(cartman, kyle, 3));
gameStore.dispatch(actions.attack(stan, kenny, 2));
gameStore.dispatch(actions.heal(kyle, 5));
gameStore.dispatch(actions.heal(kenny, 1));


unsubscribe();