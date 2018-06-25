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
const OBSCURE = 'OBSCURE';
const SCRY = 'SCRY';
const REFRESH = 'REFRESH';
const LEARN = 'LEARN';

const ADD_PLAYER = 'ADD_PLAYER';
const REMOVE_PLAYER = 'REMOVE_PLAYER';
const GAME_SETUP = 'GAME_SETUP';
const GAME_START = 'GAME_START';

function attack(actor, target, value){
    return {
        type: ATTACK,
        actor: actor, 
        target: target,
        value: value,
        message: actor.name+' attacked '+target.name+' for '+value+' damage'
    }
}

function heal(actor, value){
    return {
        type: HEAL,
        actor: actor,
        value: value,
        message: actor.name+' healed '+value+' points'
    }
}

function shield(actor, value){
    return {
        type: SHIELD,
        actor: actor,
        value: value,
        message: actor.name+' gained '+value+' Shields'
    }
};

function hpPlus(actor, value){
    return {
        type: HP_PLUS,
        actor: actor,
        value: value,
        message: actor.name+' gained '+value+' Regen tokens'
    }
};

function hpMinus(actor, target, value){
    return {
        type: HP_MINUS,
        actor: actor,
        target: target,
        message: actor.name+' passed '+target.name+' '+value+' Burn tokens'
    }
};

function apPlus(actor, value){
    return {
        type: AP_PLUS,
        actor: actor,
        value: value,
        message: actor.name+' gained '+value+' Haste tokens'
    }
};

function apMinus(actor, target, value){
    return {
        type: AP_MINUS,
        actor: actor,
        target: target,
        value: value,
        message: actor.name+' passed '+target.name+' '+value+' Slow tokens'
    }
};

function divine(actor, value, xy){
    return {
        type: DIVINE,
        actor: actor,
        value: value,
        xy: xy,
        message: actor.name+' looked at '+value+' cards'
    }
};

function weave(actor, xy1, xy2){
    return {
        type: WEAVE,
        actor: actor,
        xy1: xy1,
        xy2: xy2,
        message: actor.name+' wove cards'
    }
};

function obscure(actor, value, xy){
    return {
        type: OBSCURE,
        actor: actor,
        value: value,
        xy: xy,
        message: actor.name+' obscured '+value+' cards'
    }
};

function scry(actor, value, xy){
    return {
        type: SCRY,
        actor: actor,
        value: value,
        xy: xy,
        message: actor.name+' scried '+value+' cards'
    }
};

function refresh(actor, xy){
    return {
        type: REFRESH,
        actor: actor,
        xy: xy,
        message: actor.name+' refreshed a card'
    }
};

function learn(actor, draw, keep){
    return {
        type: LEARN,
        actor: actor,
        draw: draw,
        keep: keep,
        message: actor.name+' learned '+keep+' new spells'
    }
};

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
    DIVINE, WEAVE, SCRY, OBSCURE, REFRESH, LEARN,
    // meta events
    ADD_PLAYER, REMOVE_PLAYER, GAME_SETUP, GAME_START,
    // creator functions for effects
    attack, heal, shield, hpPlus, hpMinus, apPlus, apMinus, 
    // creator functions for manipulators
    divine, weave, scry, obscure, refresh, learn, 
    // creator functions for meta events
    addPlayer, removePlayer, gameSetup, gameStart,
}