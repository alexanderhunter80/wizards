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

let newState;
let idx;

function reducer(state = initialState, action){
    switch(action.type){

        case actions.ATTACK: 
            console.log('reducers.js heard ATTACK');
            // console.log('... but the future refused to change.  (Action not yet implemented.)')
            newState = Object.assign({}, state);
            idx = newState.players.indexOf(action.target);
            newState.players[idx].health -= action.value;
            if(newState.players[idx].health <= 0){
                newState.players[idx].isGhost = true;
                console.log('HE DED');
                console.log('(death not yet fully implemented)');
            }
            newState.history.push(action.message);
            return newState;


        case actions.CURE:
            console.log('reducers.js heard CURE');
            newState = Object.assign({}, state);
            idx = newState.players.indexOf(action.actor);
            newState.players[idx].health += action.value;
            if(newState.players[idx].health > 5){newState.players[idx].health = 5;}
            newState.history.push(action.message);
            return newState;


        case actions.SHIELD:
            console.log('reducers.js heard SHIELD');
            newState = Object.assign({}, state);
            idx = newState.players.indexOf(action.actor);
            newState.players[idx].shields += action.value;
            newState.history.push(action.message);
            return newState;


        case actions.HP_PLUS:
            console.log('reducers.js heard HP_PLUS');
            newState = Object.assign({}, state);
            idx = newState.players.indexOf(action.actor);
            newState.players[idx].hptokens += action.value;
            newState.history.push(action.message);
            return newState;


        case actions.HP_MINUS:
            console.log('reducers.js heard HP_MINUS');
            newState = Object.assign({}, state);
            idx = newState.players.indexOf(action.actor);
            newState.players[idx].hptokens -= action.value;
            newState.history.push(action.message);
            return newState;


        case actions.AP_PLUS:
            console.log('reducers.js heard AP_PLUS');
            newState = Object.assign({}, state);
            idx = newState.players.indexOf(action.actor);
            newState.players[idx].aptokens += action.value;
            newState.history.push(action.message);
            return newState;


        case actions.AP_MINUS:
            console.log('reducers.js heard AP_MINUS');
            newState = Object.assign({}, state);
            idx = newState.players.indexOf(action.actor);
            newState.players[idx].aptokens -= action.value;
            newState.history.push(action.message);
            return newState;


        case actions.DIVINE:
            console.log('reducers.js heard DIVINE');
            console.log('... but the future refused to change.  (Action not yet implemented.)')
            return state;


        case actions.WEAVE:
            console.log('reducers.js heard WEAVE');
            console.log('... but the future refused to change.  (Action not yet implemented.)')
            return state;


        case actions.SCRY:
            console.log('reducers.js heard SCRY');
            console.log('... but the future refused to change.  (Action not yet implemented.)')
            return state;


        case actions.OBSCURE:
            console.log('reducers.js heard OBSCURE');
            console.log('... but the future refused to change.  (Action not yet implemented.)')
            return state;


        case actions.REFRESH:
            console.log('reducers.js heard REFRESH');
            console.log('... but the future refused to change.  (Action not yet implemented.)')
            return state;


        case actions.LEARN:
            console.log('reducers.js heard LEARN');
            console.log('... but the future refused to change.  (Action not yet implemented.)')
            return state;




        case actions.ADD_PLAYER:
            console.log('reducers.js heard ADD_PLAYER');
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
            console.log('reducers.js heard REMOVE_PLAYER');
            newState = Object.assign({}, state);
            idx = newState.players.indexOf(action.player);
            newState.players = newState.players.slice(0,idx).concat(newState.players.slice(idx+1));
            newState.history = [... state.history, action.message]
            return newState;


        case actions.GAME_SETUP:
            console.log('reducers.js heard GAME_SETUP');
            let eDeck = new Deck();
            eDeck.initializeAsElementDeck();
            let sDeck = new Deck();
            sDeck.initializeAsSpellDeck();
            let gb = new Gameboard(eDeck, sDeck);
            console.log(gb);
            return Object.assign({}, state, {
                gameboard: gb,
                history: [... state.history, action.message]
            });


        case actions.GAME_START:
            console.log('reducers.js heard GAME_START');
            console.log('... but the future refused to change.  (Action not yet implemented.)')
            return state;



        default:
            console.log('reducers.js is confused!')
            console.log('It defaulted itself in its confusion.')
            return state;
    }
}


const gameApp = reducer;


module.exports = { gameApp }