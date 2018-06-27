import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  player: any;
  state: any;
  constructor(private _wss: WebsocketService) { }

  ngOnInit() {
    this.player = null;
    let obs = this._wss.getObservable();
    obs.subscribe((state)=>{
      console.log('state observable was updated');
      this.state = state;
      console.log(this.state);
      if(this.state){
        this.getPlayer();
      }
    });
  }

  testAttack() {
    this._wss.doAttack(this.player, this.player, 1);
  }

  getPlayer() {
    for (let person of this.state.players) {
      if (this._wss.playerid === person.socketid) {
        console.log('Player being set' + person);
        this.player = person;
        console.log(this.player);
        break;
      }
    }
  }

}
