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
  turn: any;
  constructor(private _wss: WebsocketService) { }

  ngOnInit() {
    this.player = null;
    const obs = this._wss.getObservable();
    obs.subscribe((state) => {
      console.log('state observable was updated');
      this.state = state;
      if (this.state) {
        this.getPlayer();
        this.getTurn();
      }

    });
  }

  testAttack() {
    this._wss.doAttack(this.player, this.player, 1);
  }

  getPlayer() {
    for (const person of this.state.players) {
      if (this._wss.playerid === person.socketid) {
        console.log('Player being set' + person);
        this.player = person;
        console.log(this.player);
        break;
      }
    }
  }


  ready(){
    this._wss.doReady(this.player);
  }
  getTurn() {
    this.turn = true;
    if(this.state.players.indexOf(this.player) === this.state.currentTurn){
      console.log('It is your TURN' +this.player+ 'as your turn says' +this.state.currentTurn);
      this.turn = true;
    }
    else{
      console.log('It is not your TURN');
    }
  }
  turnAck() {
    console.log('Acknowledged')
    this._wss.doTurn(this.player);

  }
  turnEnd() {
    console.log('Ending')
    this._wss.endTurn(this.player);
  }
}
