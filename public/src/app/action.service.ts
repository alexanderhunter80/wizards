import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

	messages: Subject<any>; // this needs to be changed to represent the actions 

  constructor(private wss: WebsocketService) {
	this.messages = <Subject<any>>wss //not sure about the syntax on this, ALSO change "message"
	.connect()
	.map((response: any): any =>{
		return response;
	}) 
  }
  sendMsg(msg) {
  	this.messages.next(msg); //this all needs to change to represent what we are working with
  }
}
