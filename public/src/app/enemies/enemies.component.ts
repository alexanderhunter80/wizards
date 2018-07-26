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
  gameState: any = null;

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

    const gsObs = this._wss.getGameState();
    gsObs.subscribe((gs) => {
      console.log('game state updated');
      this.gameState = gs;
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
        if (this.enemies[j].aptokens >= 0) {
          for (let i = 0; i < this.enemies[j].aptokens; i++) {
            tokens.push(i);
          }
        } else if (this.enemies[j].aptokens < 0) {
          for (let i = 0; i > this.enemies[j].aptokens; i--) {
            tokens.push(i);
          }
        }
        this.enemies[j].apTokens = tokens;
        tokens = [];
        if (this.enemies[j].hptokens >= 0) {
          for (let i = 0; i < this.enemies[j].hptokens; i++) {
            tokens.push(i);
          }
        } else if (this.enemies[j].hptokens < 0) {
          for (let i = 0; i > this.enemies[j].hptokens; i--) {
            tokens.push(i);
          }
        }
        this.enemies[j].hpTokens = tokens;
      }
  }

  selectEnemy(enemy) {
    if (this.gameState.mode === 'targetingPlayer') {
      if (enemy.target) {
        this._wss.enemyTargetFail();
      } else {
          enemy.target = true;
          this._wss.sendTarget(enemy);
          if (this._wss.getEffectsCount() === 0) {this.clearEnemies(); }
        }
    }
  }

  clearEnemies() {
    for (const enemy of this.enemies) {
      enemy.target = false;
    }
  }

}
