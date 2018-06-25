let classes = require('./classes.js');

const ATTACK = 'ATTACK';
const HEAL = 'HEAL';
const SHIELD = 'SHIELD';
const HP_PLUS = 'HP_PLUS';
const HP_MINUS = 'HP_MINUS';
const AP_PLUS = 'AP_PLUS';
const AP_MINUS = 'AP_MINUS';

const DIVINE = 'DIVINE';
const WEAVE = 'WEAVE';
const OBSCURE = 'OBSCURE'
const SCRY = 'SCRY'

const ADD_PLAYER = 'ADD_PLAYER';
const REMOVE_PLAYER = 'REMOVE_PLAYER';

function attack(target, value){
    // just logging rn
    return {
        type: ATTACK,
        target: target,
        value: value,
        message: 'Attacked '+target.name+' for '+value+' damage'
    }
}

function heal(value){
    return {
        type: HEAL,
        value: value,
        message: 'Healed '+value+' points'
    }
}

function addPlayer(id, socketid, name){
    let np = new classes.Player(id, socketid, name);
    return {
        type: ADD_PLAYER,
        player: np
    }
}

function removePlayer(player){
    return {
        type: REMOVE_PLAYER,
        player: player
    }
}

module.exports = {
    // card effects
    ATTACK, HEAL, SHIELD, HP_PLUS, HP_MINUS, AP_PLUS, AP_MINUS,
    // card manipulators
    DIVINE, WEAVE, SCRY, OBSCURE,
    // meta-events
    ADD_PLAYER, REMOVE_PLAYER,
    // event creator functions
    attack, heal,
    // game metafunctions
    addPlayer, removePlayer,
}