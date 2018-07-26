import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject, BehaviorSubject } from 'rxjs'; // rxjs/observable doesn't work with Angular 6

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
    state: any;
    playerid: string;
    enemies: any;
    counter  = 0;
    spell = null;
    effects = [];
    actor = null;

    _state: BehaviorSubject<any> = new BehaviorSubject(null);

    _gameState: BehaviorSubject<any> = new BehaviorSubject({'mode' : 'ready', 'value' : 1});

    private allPlayersSource = new Subject<any>();
    allPlayers$ = this.allPlayersSource.asObservable();

    private socket: SocketIOClient.Socket; // the client instance of socket.io

    constructor(private _http: HttpClient) {
        console.log('i built a websocket');
        this.socket = io();
        this.socket.on('connect', () => {
            this.playerid = this.socket.id;
            console.log('playerid');
            console.log(this.playerid);
        });

        this.socket.on('INIT', (state) => {
            console.log('websocket.service says: state INIT');
            this._state.next(state);
        });

        this.socket.on('UPDATE', (state) => {
            console.log('websocket.service says: state UPDATE');
            this._state.next(state);
        });

        this.socket.on('DIVINE_STEP_START', payload => {
            console.log('websocket.service says: state DIVINE STEP');
            this.counter = payload.value;
            this._gameState.next({'mode' : 'divineStep' , 'value' : 4});
        });

        this.socket.on('ACTION_STEP_START', () => {
            this._gameState.next({'mode' : 'actionStepStart' , 'value' : 6});
        });

        this.socket.on('TARGET_PLAYER', (spellEffect) => {
            this.effects = spellEffect;
            this._gameState.next({'mode' : 'targetingPlayer' , 'value' : 13});
        });

        this.socket.on('TARGET_CARDS', (spellEffect) => {
            this.effects = spellEffect;
        });
    }

    getObservable() {
        return this._state.asObservable();
    }

    getGameState() {
        return this._gameState.asObservable();
    }

    addPlayer(name) {
        console.log('websocket.service says: addPlayer()');
        // this.socket.emit('addPlayer', {name: name});
        // this.socket.on('addedPlayer', function(data){
        // 	console.log(data)
        // 	this.allPlayersSource.next(data['players']);
        // }.bind(this));
   }

   doAttack(actor, target, value) {
       this.socket.emit('ATTACK', {actor, target, value});
   }

   doAttackAll(actor, value) {
       this.socket.emit('ATTACK_ALL', {actor, value});
   }

    doCure(actor, value) {
       this.socket.emit('CURE', {actor, value});
    }

    doShield(actor, value) {
       this.socket.emit('SHIELD', {actor, value});
    }

    doHpPlus(actor, value) {
       this.socket.emit('HP_PLUS', {actor, value});
    }

    doHpMinus(actor, target, value) {
       this.socket.emit('HP_MINUS', {actor, target, value});
    }

    doApPlus(actor, value) {
       this.socket.emit('AP_PLUS', {actor, value});
    }

    doApMinus(actor, target, value) {
        this.socket.emit('AP_MINUS', {actor, target, value});
    }

    doDivine(actor, value, yx) {
        this.socket.emit('DIVINE', {actor, value, yx});
        // Further Effects?
        (this.effects.length > 0) ? this.doSpellEffects() : this._gameState.next({'mode' : 'ActionEnd' , 'value' : 8});
    }

    doDivineStep(actor, value, yx) {
        this.socket.emit('DIVINE_STEP', {actor, value, yx});
    }

    doWeave(actor, yx1, yx2) {
        this.socket.emit('WEAVE', {actor, yx1, yx2});
        // Further Effects?
        (this.effects.length > 0) ? this.doSpellEffects() : this._gameState.next({'mode' : 'ActionEnd' , 'value' : 8});
    }

    doObscure(actor, value, yx) {
        this.socket.emit('OBSCURE', {actor, value, yx});
        // Further Effects?
        (this.effects.length > 0) ? this.doSpellEffects() : this._gameState.next({'mode' : 'ActionEnd' , 'value' : 8});
    }

    doScry(actor, value, yx) {
        this.socket.emit('SCRY', {actor, value, yx});
        // Further Effects?
        (this.effects.length > 0) ? this.doSpellEffects() : this._gameState.next({'mode' : 'ActionEnd' , 'value' : 8});
    }

    doReady(actor) {
        console.log('sending READY');
        this.socket.emit('READY', {actor});
        this._gameState.next({'mode' : 'start', 'value' : 2});
    }
    doTurn(actor) {
        console.log('starting TURN');
        this._gameState.next({'mode' : 'awaiting', 'value' : 99});
        this.socket.emit('TURN_ACK', {actor});
    }
    doDivineStepEnd() {
        this.socket.emit('DIVINE_STEP_END');
        this._gameState.next({'mode' : 'divineStepEnd' , 'value' : 5});
    }
    doDivineEnd(actor) {
        this.socket.emit('DIVINE_END', {actor});
        this._gameState.next({'mode' : 'ActionEnd' , 'value' : 8});
    }
    endTurn(actor) {
        this.socket.emit('TURN_END', {actor});
    }

    spellSuccess(actor, discard, spell) {
        // replace used gameboard elements
        this.socket.emit('REPLACE_ELEMENTS', {actor, cards: discard});
        // remove spell from player's hand
        this.socket.emit('CAST_SUCCESS', {actor, spell});
        // save spell, spell effects, and actor for all spell effects;
        this.spell = spell;
        this.effects = spell.effects;
        this.actor = actor;

        // do first spell effect
        this.doSpellEffects();
    }

    spellFailure(actor, discard, spell) {
        // replace used gameboard elements
        this.socket.emit('REPLACE_ELEMENTS', {actor, cards: discard});
        // player to experience cast fail punishment
        this.socket.emit('CAST_FAIL', {actor, spell});
    }

    sendTarget(target) {
        this.socket.emit('CAST_EFFECT', {actor: this.actor, target, furtherEffects: [this.effects[0]]});
        this.effects.shift();
        // Further Effects?
        (this.effects.length > 0) ? this.doSpellEffects() : this._gameState.next({'mode' : 'ActionEnd' , 'value' : 8});
    }

    actionDivine(num = 2) {
        this.counter = num;
        this._gameState.next({'mode' : 'divineAction', 'value' : 7});
    }

    actionScry(num = 1) {
        this.counter = num;
        this._gameState.next({'mode' : 'scryAction', 'value' : 17});
    }

    actionObscure(num = 1) {
        this.counter = num;
        this._gameState.next({'mode' : 'obscureAction', 'value' : 18});
    }

    actionWeave() {
        this.counter = 2;
        this._gameState.next({'mode' : 'weaveAction', 'value' : 15});
    }

    actionCast() {
        this._gameState.next({'mode' : 'castAction', 'value' : 10});
    }

    reduceCounter() {
        this.counter--;
    }

    actionLearn(actor) {
        this.socket.emit('LEARN', {actor, draw: 4, keep: 2});
        this._gameState.next({'mode' : 'learnAction', 'value' : 16});
    }

    spellSelectFail() {
        this._gameState.next({'mode' : 'castAction', 'value' : 11});
    }

    spellElemSelect() {
        this._gameState.next({'mode' : 'spellElemSelect', 'value' : 12});
    }

    getCounter() {
        return this.counter;
    }

    learn(actor, cardIndices) {
        this.socket.emit('LEARN_DISCARD', {actor, cardIndices});
        this._gameState.next({'mode' : 'ActionEnd' , 'value' : 8});
    }

    doSpellEffects() {
        console.log(this.effects);
        if (this.effects.length > 0) {
            if (this.effects[0].targetPlayer) {
                this._gameState.next({'mode' : 'targetingPlayer' , 'value' : 13});
            } else { // not targeted
                console.log(this.effects[0]);
                switch (this.effects[0].type) {
                    case 'DIVINE':
                        this.actionDivine(this.effects[0].value);
                        this.effects.shift();
                        break;
                    case 'WEAVE':
                        this.actionWeave();
                        this.effects.shift();
                        break;
                    case 'SCRY':
                        this.actionScry(this.effects[0].value);
                        this.effects.shift();
                        break;
                    case 'OBSCURE':
                        this.actionObscure(this.effects[0].value);
                        this.effects.shift();
                        break;
                    default:
                        this.socket.emit('CAST_EFFECT', {actor : this.actor, furtherEffects : [this.effects[0]]});
                        this.effects.shift();
                        break;
                }
            }
        }
        if (this.effects.length === 0 && this.spell) { // killing leftover's
            this.actor = null;
            this.spell = null;
        }
    }

    enemyTargetFail() {
        this._gameState.next({'mode' : 'targetingPlayer', 'value' : 14});
    }

    getEffectsCount() {
        return this.effects.length;
    }

  }
