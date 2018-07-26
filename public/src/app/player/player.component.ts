import { Component, OnInit, Input } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { GameboardComponent } from '../gameboard/gameboard.component';
import { EnemiesComponent } from '../enemies/enemies.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() gameboardComp: GameboardComponent;

  @Input() enemiesComp: EnemiesComponent;

  player: any;
  state: any = null;
  turn = false;
  weave = false;
  gameState: any = null;



  constructor(private _wss: WebsocketService) { }

  ngOnInit() {
    this.player = null;
    const obs = this._wss.getObservable();
    obs.subscribe((state) => {
      console.log('state observable was updated');
      this.state = state;
      if (this.state) {
        this.getPlayer();
        this.convertTokens();
        this.getTurn();
      }
    });

    const gsObs = this._wss.getGameState();
    gsObs.subscribe((gs) => {
      console.log('game state updated');
      this.gameState = gs;
    });
  }

  testAttack() {
    this._wss.doAttack(this.player, this.player, 1);
  }

  getPlayer() {
    for (const person of this.state.players) {
      if (this._wss.playerid === person.socketid) {
        this.player = person;
        break;
      }
    }
  }


  ready() {
    this._wss.doReady(this.player);
  }
  getTurn() {
    if (this.state.players.indexOf(this.player) === this.state.currentTurn) {
      this.turn = true;
      if (!this.state.history[this.state.history.length - 1].includes(this.player.name)) {
        this._wss._gameState.next({'mode' : 'turnStart', 'value' : 3});
      }
    } else {
      this.turn = false;
    }
  }

  turnAck() {
    this._wss.doTurn(this.player);
  }
  turnEnd() {
    this._wss.endTurn(this.player);
    for (const enemy of this.enemiesComp.enemies) {
      enemy.target = false;
    }
  }
  convertTokens() {
    let tokens = [];
    if (this.player.aptokens >= 0) {
      for (let i = 0; i < this.player.aptokens; i++) {
        tokens.push(i);
      }
    } else if (this.player.aptokens < 0) {
      for (let i = 0; i > this.player.aptokens; i--) {
        tokens.push(i);
      }
    }
    this.player.apTokens = tokens;
    tokens = [];
    if (this.player.hptokens >= 0) {
      for (let i = 0; i < this.player.hptokens; i++) {
        tokens.push(i);
      }
    } else if (this.player.hptokens < 0) {
        for (let i = 0; i > this.player.hptokens; i--) {
        tokens.push(i);
      }
    }
    this.player.hpTokens = tokens;
  }
  actionDivine() {
    this._wss.actionDivine();
  }
  actionLearn() {
    this._wss.actionLearn(this.player);
  }
  actionWeave() {
    this._wss.actionWeave();
  }
  actionCast() {
    this._wss.actionCast();
  }

  actionObscure() {
    this._wss.actionObscure();
  }

  actionScry() {
    this._wss.actionScry();
  }

  selectingSpell(spellCard) {
    if (this.gameState.mode === 'castAction') {
      for (const spell of this.player.spells) {
        spell.highlight = false;
      }
      spellCard.highlight = true;
      this._wss.actionCast();
    }
  }

  castingSpell() {
    const spellToCast =  this.getSpellToCast();
    console.log(spellToCast);
    if (spellToCast.length === 0) {
      this._wss.spellSelectFail();
    } else {
      for (const letter of spellToCast[0].elements) {
        switch (letter) {
          case 'A':
            this.gameboardComp.spellElems.push('air');
            break;
          case 'E':
            this.gameboardComp.spellElems.push('earth');
            break;
          case 'X':
            this.gameboardComp.spellElems.push('aether');
            break;
          case 'F':
            this.gameboardComp.spellElems.push('fire');
            break;
          case 'W':
            this.gameboardComp.spellElems.push('water');
            break;
        }
        this._wss.spellElemSelect();
      }
    }
  }

  getSpellToCast() {
      return this.player.spells.filter( x => { return x.highlight === true; } );
  }

}
