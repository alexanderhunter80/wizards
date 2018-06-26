import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs'; //rxjs/observable doesn't work with Angular 6

// import * as Rx from 'rxjs';
// import { environement } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

	state: any;
	playerid: string;

	private allPlayersSource = new Subject<any>();
	allPlayers$ = this.allPlayersSource.asObservable();

	private socket: SocketIOClient.Socket; // the client instance of socket.io

	constructor(private _http: HttpClient) {
		this.socket = io();
		
		this.socket.on('testevent', (event) => {
			console.log('heard testevent');
			this.playerid = this.socket.id;
			this.state = event;
		});
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
		console.log({'ATTACK': {actor, target, value}});
		this.socket.emit('ATTACK', {actor, target, value});
	}

  }
