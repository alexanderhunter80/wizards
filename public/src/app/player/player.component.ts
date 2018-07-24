import { Component, OnInit, Input } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() gameboardComp: GameboardComponent;

  @Input() enemiesComp: EnemiesComponent;

  player: any;
  state: any;
  turn = false;
  turnConfirm = false;
  actionStep: any = false;
  castSpell: any = false;
  confirmSpell: Boolean = false;



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

    const asObs = this._wss.getActionStepBoolean();
    asObs.subscribe((step) => {
      console.log('action step updated');
      this.actionStep = step;
      });
  }

  testAttack() {
    this.gameboardComp.holdActionStep = true;
    this._wss._actionStep.next(false);
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
    } else {
      this.turn = false;
    }
  }
  turnAck() {
    this._wss.doTurn(this.player);
    this.turnConfirm = true;
  }
  turnEnd() {
    this.turnConfirm = false;
    this.gameboardComp.holdActionStep = false;
    this._wss.endTurn(this.player);
    for (const enemy of this.enemiesComp.enemies) {
      enemy.target = false;
    }
  }
  convertTokens() {
    let tokens = [];
    for (let i = 0; i < this.player.aptokens; i++) {
      tokens.push(i);
    }
    this.player.aptokens = tokens;
    tokens = [];
    for (let i = 0; i < this.player.hptokens; i++) {
      tokens.push(i);
    }
    this.player.hptokens = tokens;
  }
  actionDivine() {
    this.gameboardComp.holdActionStep = true;
    this._wss._actionStep.next(false);
    this._wss.divine = true;
    this._wss.divineCount = 2;
  }
  actionLearn() {
    this.gameboardComp.holdActionStep = true;
    this._wss._actionStep.next(false);
    console.log('LEARN action');
  }
  actionWeave() {
    this.gameboardComp.holdActionStep = true;
    this._wss._actionStep.next(false);
    console.log('WEAVE action');
  }
  actionCast() {
    this.gameboardComp.holdActionStep = true;
    this._wss._actionStep.next(false);
    this.castSpell = true;
  }
  selectingSpell(spellCard) {
    if (this.castSpell) {
      for (const spell of this.player.spells) {
        spell.highlight = false;
      }
      spellCard.highlight = true;
      this.confirmSpell = false;
    }
  }
  castingSpell() {
    this.castSpell = false;
    const spellToCast = this.player.spells.filter( x => { return x.highlight === true; } );
    console.log(spellToCast);
    if (spellToCast.length === 0) {
      this.confirmSpell = true;
      this.castSpell = true;
    } else {
      for (const letter of spellToCast[0].elements) {
        switch (letter) {
          case 'A':
            this.gameboardComp.spell.push('air');
            break;
          case 'E':
            this.gameboardComp.spell.push('earth');
            break;
          case 'X':
            this.gameboardComp.spell.push('aether');
            break;
          case 'F':
            this.gameboardComp.spell.push('fire');
            break;
          case 'W':
            this.gameboardComp.spell.push('water');
            break;
        }
      }
    }
  }
}
