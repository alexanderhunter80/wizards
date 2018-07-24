import { Component, OnInit, Input } from '@angular/core';
import { WebsocketService} from '../websocket.service';
import { PlayerComponent } from '../player/player.component';
import { GameboardComponent } from '../gameboard/gameboard.component';


@Component({
  selector: 'app-enemies',
  templateUrl: './enemies.component.html',
  styleUrls: ['./enemies.component.scss']
})
export class EnemiesComponent implements OnInit {

  @Input() gameboardComp: GameboardComponent;

  @Input() playerComp: PlayerComponent;

  enemies: any = null;
  state: any = null;

  constructor(private _wss: WebsocketService) { }

  ngOnInit() {
    const obs = this._wss.getObservable();
    obs.subscribe((state) => {
      this.state = state;
      if (this.state) {
        this.getEnemies();
        this.convertTokens();
      }
    });
  }


  getEnemies() {
    this.enemies = this.state.players.filter((enemy) => {
      return this._wss.playerid !== enemy.socketid;
    });
    console.log(this.enemies);
  }

  convertTokens() {
    for (let j = 0; j < this.enemies.length; j++) {
        let tokens = [];
        for (let i = 0; i < this.enemies[j].aptokens; i++) {
          tokens.push(i);
        }
        this.enemies[j].aptokens = tokens;
        tokens = [];
        for (let i = 0; i < this.enemies[j].hptokens; i++) {
          tokens.push(i);
        }
        this.enemies[j].hptokens = tokens;
      }
  }

  selectEnemy(enemy) {
    if (this._wss.targetingPlayer) {
      enemy.target = true;
      this._wss.sendTarget(this.playerComp.player, enemy);
    }
  }
}
