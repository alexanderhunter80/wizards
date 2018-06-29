import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss'],
  animations: [
    trigger('cardState', [
      state('false', style({
        transform: 'rotateY(0deg)'
      })),
      state('true', style({
        transform: 'rotateY(180deg)'
      })),
      transition('true <=> false', animate('0.5s'))
    ])
  ]
})

export class GameboardComponent implements OnInit {

  @Input() playerComp: PlayerComponent;

  @Input() enemiesComp: EnemiesComponent;

  holdActionStep: Boolean = false;
  state: any = null;
  divineCards = [];
  divineCounter = 0;
  selected = false;
  spell: any = [];
  discard: any = [];

  constructor(private _wss: WebsocketService) { }

  ngOnInit() {
    const obs = this._wss.getObservable();
    obs.subscribe((state) => {
      this.state = state;
      // Checking to see if need to ready check for game start
      this.assignCoord();
      console.log(this.state);
    });
  }

  toggleState(card) {
    if (this.spell.length > 0 && !this.playerComp.castSpell) {
    card.faceUp = (card.faceUp === false ) ? true : true;
    }
  }

  assignCoord() {
    if (this.state) {
      for (const row of this.state.gameboard.grid) {
        for (const card of row) {
          card.coord = [this.state.gameboard.grid.indexOf(row), row.indexOf(card)];
          this.showHighlight(card);
        }
      }
    }
  }
    showHighlight(card) {
      const bsCoord = JSON.stringify(card.coord);
      const bsHighlight = JSON.stringify(this.state.highlight);
      if (bsHighlight.indexOf(bsCoord) !== -1) {
        card.highlight = true;
      } else {
        card.highlight = false;
      }
    }

    divineTime(card) {
      if (this._wss.divine && this._wss.divineCount > 0) {
        // checking if card already viewed
        const bsCoord = JSON.stringify(card.coord);
        const bsHighlight = JSON.stringify(this.divineCards);
        if (bsHighlight.indexOf(bsCoord) === -1 && !card.faceUp) {
          this.divineCards.push(card.coord);
          this._wss.divineCount--;
          this.divineCounter++;
          card.highlight = true;
       } else {
         this.selected = true;
         setTimeout(() => {
          this.selected = false;
        }, 3000);
       }

      }
      if (this._wss.divine && this._wss.divineCount === 0 && !this.holdActionStep) {
        this._wss.divine = false;
        this._wss.doDivineStep(this.state.players[this.state.currentTurn], this.divineCounter, this.divineCards);
        this.divineCounter = 0;
        this.divineCards = [];
        setTimeout(() => {
          this._wss.doDivineStepEnd();
        }, 3000);
      } else if (this._wss.divine && this._wss.divineCount === 0 && this.holdActionStep) {
        this.holdActionStep = false;
        this._wss.divine = false;
        this._wss.doDivine(this.state.players[this.state.currentTurn], this.divineCounter, this.divineCards);
        this.divineCounter = 0;
        this.divineCards = [];
        setTimeout(() => {
          this._wss.doDivineEnd(this.playerComp.player);
        }, 3000);
      }
    }

    spellCheck(card) {
      if (this.spell.length > 0 && (this.spell[0] === card.elem || card.elem === 'aether') && !this.playerComp.castSpell) {
        this.spell.shift();
        this.discard.push(card.coord);
        if (this.spell.length === 0) {
          console.log('Spell cast Successful!!');
          // finding selected spell
          const spellToCast = this.player.spells.filter( x => return x.highlight === true; );
          this._wss.spellSuccess(this.playerComp.player, this.discard, spellToCast);
          // check if targeted spell
          // if (spellToCast.targeted) {
            // does spell target player?
            // if (spellToCast.targetPlayer === true) {
            //   this.targeting = true;
            //   target  = this.enemiesComp.enemies.filter( x => return x.target === true; );
            //   if (!targeting && target.length > 0) {
            //   }
            // }
          }
        }
          for (const action of spellToCast[0].effects) {
            switch (action) {
              case 'ATTACK':
                break;
              case 'CURE':
                break;
              case 'OBSCURE':
                break;
              case 'ATTACK_ALL':
                break;
              case 'SHIELD':
                break;
              case 'DRAIN':
                break;
              case 'HP_PLUS':
                break;
              case 'HP_MINUS':
                break;
              case 'AP_PLUS':
                break;
              case 'AP_MINUS':
                break;
              case 'WEAVE':
                break;
              case 'SCRY':
                break;
              case 'DIVINE':
                break;
            }
          }
          // Send end action
        }
      } else if (this.spell.length > 0 && !this.playerComp.castSpell) {
        console.log('Spell has been botched!');
        this.spell = [];
      }
    }
}
