const redux = require('redux');
const actions = require('./actions');
const Player = require('../classes/player');
const Gameboard = require('../classes/gameboard');
const Deck = require('../classes/deck');

const initialState = {
    gameOn: false,
    players: [],
    nextPlayer: 1,
    gameboard: null,
    history: [],
}

function reducer(state = initialState, action){
    switch(action.type){

        case actions.ATTACK: 
            console.log('heard ATTACK - not yet implemented');
            console.log(action);
            return state;

        case actions.HEAL:
            console.log('heard HEAL - not yet implemented');
            console.log(action);
            return state;

        case actions.ADD_PLAYER:
            console.log('heard ADD_PLAYER');
            let np = new Player(state.nextPlayer, action.socketid, action.name);
            return Object.assign({}, state, {
                players: [
                    ... state.players,
                    np
                ], 
                nextPlayer: state.nextPlayer + 1,
                history: [... state.history, action.message]
            });

        case actions.REMOVE_PLAYER:
            console.log('heard REMOVE_PLAYER');
            let newState = state;
            let idx = newState.players.indexOf(action.player);
            newState.players = newState.players.slice(0,idx).concat(newState.players.slice(idx+1));
            newState.history = [... state.history, action.message]
            return newState;

        case actions.GAME_SETUP:
            console.log('heard GAME_SETUP');
            let eDeck = new Deck();
            eDeck.initializeAsElementDeck();
            let gb = new Gameboard(eDeck);
            console.log(gb);
            return Object.assign({}, state, {
                gameboard: gb,
                history: [... state.history, action.message]
            });



        default:
            return state;
    }
}


const gameApp = reducer;


module.exports = { gameApp }