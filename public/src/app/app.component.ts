import { Component, OnInit } from '@angular/core';
// import { ActionService } from './action.service';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [WebsocketService]
})
export class AppComponent {

  watcher: any;
  
  constructor(private _WsS: WebsocketService) {}; //This all can be moved to other components to run more modular

  ngOnInit(){
    this.watcher = this._WsS.getEvent()
      .subscribe(event => {
        console.log(event);
      });
  }


  // join(){
  // this._WsS.joinGame({/*user: this.user*/})
  // };

  

  
  }

