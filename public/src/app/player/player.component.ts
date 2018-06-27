import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  player: any;
  constructor(private _wss: WebsocketService) { }

  ngOnInit() {
    // this.getPlayer();
  }

  testAttack() {
    this._wss.doAttack(this._wss.state.players[0], this._wss.state.players[0], 1);
  }

  getPlayer() {
    for (const person of this._wss.state['players']) {
      if (this._wss.playerid === person.socketid) {
        console.log('Player being set' + person);
        this.player = person;
        break;
      }
    }
  }

}
