const redux = require('redux');
const actions = require('./actions');
const Player = require('../classes/player');
const Gameboard = require('../classes/gameboard');
const Deck = require('../classes/deck');

const initialState = {
    gameOn: false,
    players: [],
    currentTurn: null,
    nextPlayer: 1,
    gameboard: null,
    history: [],
}

let newState;
let idx;
let temp;
let yx;
let currentPlayer;

function checkDeath(player){
    if(player.health <= 0){
        player.isGhost = true;
        console.log('HE DED');
        console.log('(death not yet fully implemented)');
    }

}

function shuffle(array) {  // Fisher-Yates shuffle
    let counter = array.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function reducer(state = initialState, action){
    switch(action.type){


        case actions.ATTACK: 
            console.log('reducers.js heard ATTACK');
            // console.log('... but the future refused to change.  (Action not yet implemented.)')
            newState = Object.assign({}, state);
            idx = newState.players.indexOf(action.target);
            newState.players[idx].health -= action.value;
            checkDeath(newState.players[idx]);
            newState.history.push(action.message);
            return newState;


        case actions.ATTACK_ALL:
            console.log('reducers.js heard ATTACK_ALL');
            newState = Object.assign({}, state);
            for (target of newState.players){
                if(target == actions.actor){
                    continue;
                } else {
                    target.health -= action.value;
                    checkDeath(target);
                }
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
            // respond with elements of N face-down cards through socket to actor
            // broadcast coordinates of those cards to all non-actors to be highlighted
            // state does not change
            return state;


        case actions.WEAVE:
            console.log('reducers.js heard WEAVE');
            console.log('reducers.js says: WEAVE is untested!');
            newState = Object.assign({}, state);
            temp = newState.gameboard.grid[action.yx1[0]][action.yx1[1]];
            newState.gameboard.grid[action.yx1[0]][action.yx1[1]] = newState.gameboard.grid[action.yx2[0]][action.yx2[1]];
            temp = newState.gameboard.grid[action.yx2[0]][action.yx2[1]]
            return newState;


        case actions.SCRY:
            console.log('reducers.js heard SCRY');
            console.log('reducers.js says: SCRY is untested!');
            newState = Object.assign({}, state);
            for (yx of action.yx){
                newState.gameboard.grid[yx[0]][yx[1]].faceUp = true;
            }
            return newState;


        case actions.OBSCURE:
            console.log('reducers.js heard OBSCURE');
            console.log('reducers.js says: OBSCURE is untested!');
            newState = Object.assign({}, state);
            for (yx of action.yx){
                newState.gameboard.grid[yx[0]][yx[1]].faceUp = false;
            }
            return newState;


        case actions.REFRESH:
            console.log('reducers.js heard REFRESH');
            console.log('... but the future refused to change.  (Action not yet implemented.)')
            // discard targeted card, replace from deck
            // show element of card to actor through socket
            // broadcast coordinates of card to all non-actors
            return state;


        case actions.LEARN:
            console.log('reducers.js heard LEARN');
            console.log('... but the future refused to change.  (Action not yet implemented.)')
            // drawn N SpellCards from deck, send through socket to actor along with KEEP value
            // to be implemented: a stage-2 action where the actor returns the non-kept cards to be discarded
            return state;


        // case (post-LEARN action):


        case actions.ADD_PLAYER:
            console.log('reducers.js heard ADD_PLAYER');
            let np = new Player(state.nextPlayer, action.socket, action.name);
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
            newState = Object.assign({}, state);
            // randomize player order
            shuffle(newState.players);
            // set state.currentTurn to 0 (first player)
            newState.currentTurn = 0;
            // set state.gameOn to true
            newState.gameOn = true;
            // figure out how to indicate the first player's turn - angular side?
            return newState;

        
        case actions.GAME_END:
            return state;


        case actions.TURN_START:
            console.log('reducers.js heard TURN_START');
            newState = Object.assign({}, state);
            currentPlayer = newState.players[newState.currentTurn];
            // ap +- tokens
            if (currentPlayer.aptokens > 0){
                currentPlayer.adjustActions++;
                currentPlayer.aptokens--;
                if (currentPlayer.aptokens > 0 && currentPlayer.passives.overdrive) {
                    currentPlayer.adjustActions++;
                    currentPlayer.apTokens--;
                }
            } else if (currentPlayer.apTokens < 0){
                currentPlayer.adjustActions--;
                currentPlayer.aptokens++;
            }
            // confirmation event?
            return newState;


        case actions.TURN_END:
            console.log('reducers.js heard TURN_END');
            newState = Object.assign({}, state);
            // hp +- tokens
            if (currentPlayer.hptokens > 0){
                if (currentPlayer.health < 5){
                    currentPlayer.health++;
                }
                currentPlayer.hptokens--;
                if (currentPlayer.hptokens > 0 && currentPlayer.passives.hypermetabolism) {
                    if (currentPlayer.health < 5){
                        currentPlayer.health++;
                    }
                    currentPlayer.hpTokens--;
                }
            } else if (currentPlayer.hpTokens < 0){
                currentPlayer.health--;
                checkDeath(currentPlayer);
                currentPlayer.hptokens++;
            }
            // advance state.currentTurn to next % number-of-players
            // figure out how to fire the next turnStart
            return newState;


        case actions.DIVINE_STEP_START:
            return state;


        case actions.DIVINE_STEP_END:
            return state;


        case actions.ACTION_STEP_START:
            return state;


        case actions.ACTION_STEP_END:
            return state;









        default:
            console.log('reducers.js is confused!')
            console.log('It defaulted itself in its confusion.')
            return state;
    }
}


const gameApp = reducer;


module.exports = { gameApp }