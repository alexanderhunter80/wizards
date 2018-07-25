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
    divineCount: number;
    targetingCards = false;
    effects = null;

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
        // this.playerid = this.socket.id;
        // this.player = {id: null, socketid: null, name: null, health: null, shields: null, aptokens: null, hptokens: null};
        // this.enemies = [];

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
            this.divineCount = payload.value;
            this._gameState.next({'mode' : 'divineStep' : 'value' : 4});
        });

        this.socket.on('ACTION_STEP_START', () => {
            this._gameState.next({'mode' : 'actionStepStart' , 'value' : 6});
        });

        this.socket.on('TARGET_PLAYER', (spellEffect) => {
            this.effects = spellEffect;
            this._gameState.next({'mode' : 'targetingPlayer' : 'value' : 13});
        });

        this.socket.on('TARGET_CARDS', (spellEffect) => {
            this.effects = spellEffect;
            this.targetingCards = true;
        });



        // this.socket.on('CAST_END', () => {
        //     socket.emit('ACTION_STEP_END');
        // });
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
        console.log('EMITTING DIVINE');
        this.socket.emit('DIVINE', {actor, value, yx});
    }

    doDivineStep(actor, value, yx) {
        console.log('EMITTING DIVINE_STEP');
        this.socket.emit('DIVINE_STEP', {actor, value, yx});
    }

    doWeave(actor, yx1, yx2) {
        this.socket.emit('WEAVE', {actor, yx1, yx2});
    }

    doObscure(actor, value, yx) {
        this.socket.emit('OBSCURE', {actor, value, yx});
    }

    doScry(actor, value, yx) {
        this.socket.emit('SCRY', {actor, value, yx});
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
        this._gameState.next({'mode' : 'divineActionEnd' , 'value' : 8});
    }
    endTurn(actor) {
        this.socket.emit('TURN_END', {actor});
        this.wipeDivine();
    }
    spellSuccess(actor, cards, spell) {
        this.socket.emit('REPLACE_ELEMENTS', {actor, cards});
        this.socket.emit('CAST_SUCCESS', {actor, spell});
    }

    spellFailure(actor, cards, spell) {
        this.socket.emit('REPLACE_ELEMENTS', {actor, cards});
        this.socket.emit('CAST_FAIL', {actor, spell});
    }

    sendTarget(actor, target) {
        this.socket.emit('CAST_EFFECT', {actor, target, furtherEffects: this.effects.furtherEffects});
        this.effects = null;
        this._gameState.next({'mode' : 'awaiting', 'value' : 99});
    }

    sendCards(actor, cards) {
        this.socket.emit('CAST_EFFECT', {actor, cards, furtherEffects: this.effects.furtherEffects});
        this.effects = null;
        this.targetingCards = false;
        this._gameState.next({'mode' : 'awaiting', 'value' : 99});
    }

    wipeDivine() {
        this.divineCount = 0;
    }

    targetCardsToggle() {
        (this.targetingCards) ? this.targetingCards = false : this.targetingCards = true;
    }

    getDivineCount() {
        return this.divineCount;
    }

    actionDivine(num) {
        this.divineCount = num;
        this._gameState.next({'mode' : 'divineAction', 'value' : 7});
    }

    divineCard() {
        this.divineCount--;
    }

    actionCast() {
        this._gameState.next({'mode' : 'castAction', 'value' : 10});
    }

    spellSelectFail() {
        this._gameState.next({'mode' : 'castAction', 'value' : 11});
    }

    spellElemSelect() {
        this._gameState.next({'mode' : 'spellElemSelect', 'value' : 12});
    }

  }
