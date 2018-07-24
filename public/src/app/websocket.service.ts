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
    player: any;
    enemies: any;
    divine = false;
    divineCount: number;
    targetingPlayer = false;
    targetingCards = false;
    effects = null;
    // actionStep = false;

    _actionStep: BehaviorSubject<any> = new BehaviorSubject(false);

    _state: BehaviorSubject<any> = new BehaviorSubject(null);

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
            this.divine = true;
        });

        this.socket.on('ACTION_STEP_START', () => {
            this._actionStep.next(true);
        });

        this.socket.on('TARGET_PLAYER', (spellEffect) => {
            this.effects = spellEffect;
            this.targetingPlayer = true;
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

    getActionStepBoolean() {
        return this._actionStep.asObservable();
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
    }
    doTurn(actor) {
        console.log('starting TURN');
        this.socket.emit('TURN_ACK', {actor});
    }
    doDivineStepEnd() {
        this.socket.emit('DIVINE_STEP_END');
    }
    doDivineEnd(actor) {
        this.socket.emit('DIVINE_END', {actor});
    }
    endTurn(actor) {
        this.socket.emit('TURN_END', {actor});
        this.wipeDivine();
    }
    spellSuccess(actor, cards, spell) {
        this.socket.emit('REPLACE_ELEMENTS', {actor, cards});
        this.socket.emit('CAST_SUCCESS', {actor, spell});
    }

    sendTarget(actor, target) {
        this.socket.emit('CAST_EFFECT', {actor, target, furtherEffects: this.effects.furtherEffects});
        this.effects = null;
        this.targetingPlayer = false;
    }

    sendCards(actor, cards) {
        this.socket.emit('CAST_EFFECT', {actor, cards, furtherEffects: this.effects.furtherEffects});
        this.effects = null;
        this.targetingCards = false;
    }

    wipeDivine() {
        this.divine = false;
        this.divineCount = 0;
    }

    targetCardsToggle() {
        (this.targetingCards) ? this.targetingCards = false : this.targetingCards = true;
    }


  }
