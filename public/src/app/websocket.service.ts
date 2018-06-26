import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Ovservable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { environement } '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

	private socket; //socket that connects to the socket.io server

  constructor() { }

  connect(): Rx.Subject<MessageEvent> { //MessageEvent is a placeholder, change later to match what is needed
  	this.socket = io(); 

  	let observable = new Observable(observer => { //defining obvervable which will observe any incoming "messages"
  		this.socket.on('message', (data) => { //message is a placeholder, change later to proper Event
  			console.log("received message from Websocket Service")
  			observer.next(data);
  		})
  		return () => {
  			this.socket.disconect();
  		}
  	});
  	let observer = { //defining observer which will listen to "messages" from our other components and send "messages" back to our socket server whenever the 'next()' method is called
  		next: (data: Object) => {
  			this.socket.emit('message', JSON.stringify(data));
  		}
  	};

  	return Rx.Subject.create(observer, observable); //return Rx.Subject which is a combo of both an observer and observable
  }


}
