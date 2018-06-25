let Player = require('../classes/player.js');

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
const GAME_SETUP = 'GAME_SETUP';
const GAME_START = 'GAME_START';

function attack(target, value){
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

function shield(){};

function hpPlus(){};

function hpMinus(){};

function apPlus(){};

function apMinus(){};

function divine(){};

function weave(){};

function obscure(){};

function scry(){};

function addPlayer(socketid, name){
    return {
        type: ADD_PLAYER,
        socketid: socketid,
        name: name,
        message: 'Created player '+name
    }
}

function removePlayer(player){
    return {
        type: REMOVE_PLAYER,
        player: player,
        message: 'Removed player '+player.name
    }
}

function gameSetup(){
    return {
        type: GAME_SETUP,
        message: 'Set up gameboard'
    }
};

function gameStart(){};

module.exports = {
    // card effects
    ATTACK, HEAL, SHIELD, HP_PLUS, HP_MINUS, AP_PLUS, AP_MINUS,
    // card manipulators
    DIVINE, WEAVE, SCRY, OBSCURE,
    // meta events
    ADD_PLAYER, REMOVE_PLAYER, GAME_SETUP, GAME_START,
    // creator functions for effects
    attack, heal, shield, hpPlus, hpMinus, apPlus, apMinus, 
    // creator functions for manipulators
    divine, weave, scry, obscure,
    // creator functions for meta events
    addPlayer, removePlayer, gameSetup, gameStart,
}