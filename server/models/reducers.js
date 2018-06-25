let redux = require('redux');
let actions = require('./actions.js');
let classes = require('./classes.js');

const initialState = {
    players: []
}

function reducer(state = initialState, action){
    switch(action.type){

        case actions.ATTACK: 
            console.log('heard ATTACK');
            console.log(action);
            return state;

        case actions.HEAL:
            console.log('heard HEAL');
            console.log(action);
            return state;

        case actions.ADD_PLAYER:
            return Object.assign({}, state, {
                players: [
                    ... state.players,
                    action.player
                ]
            });

        case actions.REMOVE_PLAYER:
            let newState = state;
            let idx = newState.players.indexOf(action.player);
            newState.players = newState.players.slice(0,idx).concat(newState.players.slice(idx+1));
            return newState;

        default:
            return state;
    }
}


const gameApp = reducer;


module.exports = { gameApp }