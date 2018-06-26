import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs'; //rxjs/observable doesn't work with Angular 6
// import * as Rx from 'rxjs';
// import { environement } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

	// socket = io('http://localhost:8000'); //socket that connects to the socket.io server

	// joinGame(data){
	// 	this.socket.emit('join', data);
	// }
	// newUserJoined(){
	// 	let observable = new Observable<{user: String, message: String}> (observer =>{
	// 		this.socket.on('new user joined', (data)=>{
	// 			observer.next(data);
	// 		});
	// 		return () => {this.socket.disconnect();}
	// 	});
	// 	return observable;
	// }

	// // constructor() { }

	socket: any;
	observer: any;

	getEvent() {
		this.socket = io('http://localhost:8000');

		this.socket.on('event', (event)=>{
			this.observer.next(event.data);
		});

		return this.createObservable();
	}

	createObservable() : Observable<Object> {
		return new Observable(observer => {
			this.observer = observer;
		});
	}




  }
