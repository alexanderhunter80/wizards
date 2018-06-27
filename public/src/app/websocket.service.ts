import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject, BehaviorSubject } from 'rxjs'; // rxjs/observable doesn't work with Angular 6

// import * as Rx from 'rxjs';
// import { environement } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
    state: any;
    playerid: string;
    player: any;
    enemies: any;

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
            // this.state = state;
            // console.log(this.state);
            // this.player = this.state.players.find((player)=>{
            // 	return player.socketid == this.playerid;
            // });
            // console.log(this.player);
            // this.enemies.push(this.state.players.find((player)=>{
            // 	return player.socketid !== this.playerid;
            // }));
            // console.log(this.enemies);
        });

        this.socket.on('UPDATE', (state) => {
            console.log('websocket.service says: state UPDATE');
            this._state.next(state);
            // this.state = state;
            // this.player = this.state.players.find((player)=>{
            // 	return player.socketid == this.playerid;
            // });
            // console.log(this.player);
            // this.enemies.push(this.state.players.find((player)=>{
            // 	return player.socketid !== this.playerid;
            // }));
            // console.log(this.enemies);
        });

        this.socket.on('HIGHLIGHT', (payload) => {
            // highlight cards given by coordinates in payload
            // format of payload: {type: 'ACTIONNAME', coords: [yx, yx, yx]}
        });
    }

    getObservable() {
        return this._state.asObservable();
    }

    addPlayer(name) {
        console.log('websocket.service says: addPlayer()');
        // this.socket.emit('addPlayer', {name: name});
        // this.socket.on('addedPlayer', function(data){
        // 	console.log(data)
        // 	this.allPlayersSource.next(data['players']);
        // }.bind(this));
   }

   ready() {
        this.socket.emit('READY', {actor: this.player});
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

	doReady(actor){
		console.log('sending READY');
		this.socket.emit('READY', {actor});
	}
    doTurn(actor){
    this.socket.emit('TURN_ACK', {actor: this.player});
  }

  }
