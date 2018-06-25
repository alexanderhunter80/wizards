let redux = require('redux');
let actions = require('./actions.js');
let reducers = require('./reducers.js');
let gameApp = reducers.gameApp;

const gameStore = redux.createStore(gameApp);

console.log(gameStore.getState());

const unsubscribe = gameStore.subscribe(() => {
    console.log(gameStore.getState());
})

let s;
gameStore.dispatch(actions.addPlayer(1,1,'Cartman'));
s = gameStore.getState();
let cartman = s.players[s.players.length-1];
console.log(cartman);
gameStore.dispatch(actions.addPlayer(2,2,'Kyle'));
s = gameStore.getState();
let kyle = s.players[s.players.length-1];
console.log(kyle);
gameStore.dispatch(actions.addPlayer(3,3,'Stan'));
s = gameStore.getState();
let stan = s.players[s.players.length-1];
console.log(stan);
gameStore.dispatch(actions.addPlayer(4,4,'Kenny'));
s = gameStore.getState();
let kenny = s.players[s.players.length-1];
console.log(kenny);
gameStore.dispatch(actions.removePlayer(stan));


unsubscribe();