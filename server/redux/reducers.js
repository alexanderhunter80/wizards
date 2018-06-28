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
    learnHelper: {keep: null, cardsDrawn: []},
    highlight: [],
}

let newState, idx, temp, yx, currentPlayer, target, damage;

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



        case actions.GAME_SETUP:
            console.log('reducers.js heard GAME_SETUP');
            newState = Object.assign({}, state);
            let eDeck = new Deck();
            eDeck.initializeAsElementDeck();
            let sDeck = new Deck();
            sDeck.initializeAsSpellDeck();
            let gb = new Gameboard(eDeck, sDeck);
            console.log(gb);
            newState.gameboard = gb;
            newState.history.push(action.message);
            return newState;



        case actions.READY:
            console.log('reducers.js heard READY');
            newState = Object.assign({}, state);
            currentPlayer = newState.players.find((player)=>{
                return player.id == action.actor.id;
            })
            console.log('from '+currentPlayer.socketid);
            currentPlayer.ready = true;
            return newState;



        case actions.GAME_START:
            console.log('reducers.js heard GAME_START');
            newState = Object.assign({}, state);
            // randomize player order
            shuffle(newState.players);
            // set state.currentTurn to 0 (first player)
            newState.currentTurn = 0;
            // set state.gameOn to true
            newState.gameOn = true;
            for(let pl of newState.players){
                for(let i=0; i<5; i++){
                    pl.spells.push(newState.gameboard.spellDeck.topCard());
                }
            };
            newState.history.push(action.message);
            return newState;



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
            newState.history = [... state.history, currentPlayer.name+' started their turn'];
            return newState;














        case actions.ATTACK: 
            console.log('reducers.js heard ATTACK');
            // console.log('... but the future refused to change.  (Action not yet implemented.)')
            newState = Object.assign({}, state);
            target = newState.players.find((player)=>{
                return player.id == action.target.id;
            })
            let damage = action.value;
            // check for shields and cancel 1:1
            if (target.shields > 0){
                while(target.shields > 0 && damage > 0){
                    target.shields--;
                    damage--;
                }
            }
            // deal damage and check for death
            target.health -= damage;
            checkDeath(target);
            newState.history.push(action.message);
            return newState;


        case actions.ATTACK_ALL:
            console.log('reducers.js heard ATTACK_ALL');
            newState = Object.assign({}, state);
            for (target of newState.players){
                if(target == actions.actor){
                    continue;
                } else {
                    if (target.shields > 0){
                        while(target.shields > 0 && damage > 0){
                            target.shields--;
                            damage--;
                        }
                    }
                    target.health -= damage;
                    checkDeath(target);
                }
            }
            newState.history.push(action.message);
            return newState;


        case actions.DRAIN:
            console.log('reducers.js heard DRAIN');
            newState = Object.assign({}, state);
            target = newState.players.find((player)=>{
                return player.id == action.target.id;
            })
            damage = action.value;
            if (target.shields > 0){
                while(target.shields > 0 && damage > 0){
                    target.shields--;
                    damage--;
                }
            }
            // drainy nonsense
            while(damage > 0 && target.health > 0){
                target.health--;
                damage--;
                if(actor.health < 5){actor.health++};
            }
            checkDeath(target);
            newState.history.push(action.message);
            return newState;


        case actions.CURE:
            console.log('reducers.js heard CURE');
            newState = Object.assign({}, state);
            currentPlayer = newState.players.find((player)=>{
                return player.id == action.target.id;
            })
            if(currentPlayer.health > 5){currentPlayer.health = 5;}
            newState.history.push(action.message);
            return newState;


        case actions.SHIELD:
            console.log('reducers.js heard SHIELD');
            newState = Object.assign({}, state);
            currentPlayer = newState.players.find((player)=>{
                return player.id == action.target.id;
            })
            currentPlayer.shields += action.value;
            newState.history.push(action.message);
            return newState;


        case actions.HP_PLUS:
            console.log('reducers.js heard HP_PLUS');
            newState = Object.assign({}, state);
            currentPlayer = newState.players.find((player)=>{
                return player.id == action.target.id;
            })
            currentPlayer.hptokens += action.value;
            newState.history.push(action.message);
            return newState;


        case actions.HP_MINUS:
            console.log('reducers.js heard HP_MINUS');
            newState = Object.assign({}, state);
            currentPlayer = newState.players.find((player)=>{
                return player.id == action.target.id;
            })
            currentPlayer.hptokens -= action.value;
            newState.history.push(action.message);
            return newState;


        case actions.AP_PLUS:
            console.log('reducers.js heard AP_PLUS');
            newState = Object.assign({}, state);
            currentPlayer = newState.players.find((player)=>{
                return player.id == action.target.id;
            })
            currentPlayer.aptokens += action.value;
            newState.history.push(action.message);
            return newState;


        case actions.AP_MINUS:
            console.log('reducers.js heard AP_MINUS');
            newState = Object.assign({}, state);
            currentPlayer = newState.players.find((player)=>{
                return player.id == action.target.id;
            })
            currentPlayer.aptokens -= action.value;
            newState.history.push(action.message);
            return newState;


        case actions.DIVINE:  // actor, value, [yx]
            console.log('reducers.js heard DIVINE');
            // console.log('... but the future refused to change.  (Action not yet implemented.)')
            newState = Object.assign({}, state);
            newState.highlight = action.yx;
            newState.history.push(action.message);
            return newState;

        case actions.UNHIGHLIGHT:
            console.log('reducers.js heard UNHIGHLIGHT');
            newState = Object.assign({}, state, {highlight: []});
            return newState;

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
            newState = Object.assign({}, state);
            // draw N SpellCards from deck, send through socket to actor along with KEEP value
            for(let c=0; c < action.draw; c++){
                newState.learnHelper.cardsDrawn.push(newState.gameboard.spellDeck.topCard());
            }
            newState.learnHelper.keep = action.keep;
            // to be implemented: a stage-2 action where the actor returns the non-kept cards to be discarded
            return newState;


        case actions.LEARN_DISCARD:
            console.log('reducers.js heard LEARN_DISCARD');
            console.log('... but the future refused to change.  (Action not yet implemented.)')
            newState = Object.assign({}, state);
            currentPlayer = newState.players.find((player)=>{
                return player.id == action.target.id;
            })
            // take indices of kept cards and add to actor's spells

            // take indices of kept cards and slice out of learnHelper.cardsDrawn
            // push rest of learnHelper.cardsDrawn into gameboard.spellDeck.discard
            return state;


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







        
        case actions.GAME_END:
            return state;





        case actions.TURN_END:
            console.log('reducers.js heard TURN_END');
            newState = Object.assign({}, state);
            currentPlayer = newState.players[newState.currentTurn];
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
            newState.currentTurn = (newState.currentTurn + 1) % newState.players.length;
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