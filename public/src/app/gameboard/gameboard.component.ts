import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { WebsocketService } from '../websocket.service';
import { PlayerComponent } from '../player/player.component';
import { EnemiesComponent } from '../enemies/enemies.component';

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

  player: any = null;
  state: any = null;
  divineCards = [];
  weaveCards = [];
  divineCounter = 0;
  selected = false;
  spell: any = [];
  discard: any = [];
  castSuccess = false;
  castBotched = false;
  gameState: any = null;

  constructor(private _wss: WebsocketService) { }

  ngOnInit() {
    const obs = this._wss.getObservable();
    obs.subscribe((state) => {
      this.state = state;
      // Checking to see if need to ready check for game start
      if (this.state) {
        this.assignCoord();
        this.getCurrentPlayer();
      }
    });

    const gsObs = this._wss.getGameState();
    gsObs.subscribe((gs) => {
      console.log('game state updated');
      this.gameState = gs;
    });
  }

  toggleState(card) {
    if (this.spell.length > 0 && this.gameState.mode === 'castAction') {
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
      if (this._wss.getDivineCount() > 0) {
        // checking if card already viewed
        const bsCoord = JSON.stringify(card.coord);
        const bsHighlight = JSON.stringify(this.divineCards);
        if (bsHighlight.indexOf(bsCoord) === -1 && !card.faceUp) {
          this.divineCards.push(card.coord);
          this._wss.divineCard();
          this.divineCounter++;
          card.highlight = true;
       } else {
         this.selected = true;
         setTimeout(() => {
          this.selected = false;
        }, 5000);
       }

      }
      if (this.gameState.mode === 'divineStep' && this._wss.getDivineCount() === 0 ) {
        this._wss.doDivineStep(this.player, this.divineCounter, this.divineCards);
        this.divineCounter = 0;
        this.divineCards = [];
        setTimeout(() => {
          this._wss.doDivineStepEnd();
        }, 3000);
      } else if (this.gameState.mode === 'divineAction' && this._wss.getDivineCount() === 0 ) {
        this._wss.doDivine(this.player, this.divineCounter, this.divineCards);
        this.divineCounter = 0;
        this.divineCards = [];
        setTimeout(() => {
          this._wss.doDivineEnd(this.player);
        }, 3000);
      }
    }

    spellCheck(card) {
      if (this.spell.length > 0 && (this.spell[0] === card.elem || card.elem === 'aether') && this.gameState.mode === 'spellElemSelect') {
        this.spell.shift();
        this.discard.push(card.coord);
        if (this.spell.length === 0) {
          console.log('Spell cast Successful!!');
          this.castSuccess = true;
        setTimeout(() => {
          this.castSuccess = false;
        }, 3000);
          // finding selected spell
          const spellToCast = this.playerComp.getSpellToCast();
          this._wss.spellSuccess(this.player, this.discard, spellToCast[0]);
          }
      } else if (this.spell.length > 0 && this.gameState.mode === 'spellElemSelect') {
          console.log('Spell has been botched!');
          this.castBotched = true;
        setTimeout(() => {
          this.castBotched = false;
        }, 3000);
        const spellToCast = this.playerComp.getSpellToCast();
        this._wss.spellFailure(this.player, this.discard, spellToCast[0]);
        this.spell = [];
      }
    }

    doWeave(card) {
      if (this.gameState.mode === 'weaveAction' && this._wss.getWeaveCount() > 0) {
        // checking if card already selected
        const bsCoord = JSON.stringify(card.coord);
        const bsHighlight = JSON.stringify(this.weaveCards);
        if (bsHighlight.indexOf(bsCoord) === -1 && !card.faceUp) { // fresh card selected
          this.weaveCards.push(card.coord);
          this._wss.weave();
          card.highlight = true;
       } else { // card has been previously selected(notifying user)
         this.selected = true;
         setTimeout(() => {
          this.selected = false;
        }, 3000);
       }
      }
      if (this.gameState.mode === 'weaveAction' && this._wss.getWeaveCount() === 0) {
        this._wss.doWeave(this.player, this.weaveCards[0], this.weaveCards[1]);
        this.weaveCards = [];
      }
    }

    getCurrentPlayer() {
      console.log(this.state);
      for (const person of this.state.players) {
        if (this._wss.playerid === person.socketid) {
          this.player = person;
          break;
        }
      }
    }
}
