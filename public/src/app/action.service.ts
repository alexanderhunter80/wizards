import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
// import { Observable, Subject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ActionService {


  constructor(private wss: WebsocketService) {

  }

}
