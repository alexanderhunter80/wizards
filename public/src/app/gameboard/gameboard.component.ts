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

  state: any = null;
  gameState: any = null;
  cardsToSend = [];
  counter = 0;
  spellElems: any = [];
  discard: any = [];
  selected = false;
  castSuccess = false;
  castBotched = false;

  constructor(private _wss: WebsocketService) { }

  ngOnInit() {
    const obs = this._wss.getObservable();
    obs.subscribe((state) => {
      this.state = state;
      // Checking to see if need to ready check for game start
      if (this.state) {
        this.assignCoord();
        this.gameEndCheck();
      }
    });

    const gsObs = this._wss.getGameState();
    gsObs.subscribe((gs) => {
      console.log('game state updated');
      this.gameState = gs;
    });
  }

  toggleState(card) {
    if (this.gameState.mode === 'spellElemSelect') {
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

  gameEndCheck() {
    if (this.state.gameOver) {
        this._wss._gameState.next({'mode' : 'GAMEOVER', 'value' : -1});
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
    if ((this.gameState.mode === 'divineStep' || this.gameState.mode === 'divineAction') && this._wss.getCounter() > 0) {
      // checking if card already viewed
      const bsCoord = JSON.stringify(card.coord);
      const bsHighlight = JSON.stringify(this.cardsToSend);
      if (bsHighlight.indexOf(bsCoord) === -1 && !card.faceUp) {
        this.cardsToSend.push(card.coord);
        this._wss.reduceCounter();
        this.counter++;
        card.highlight = true;
      } else {
          this.selected = true;
          setTimeout(() => {
            this.selected = false;
          }, 5000);
        }

    }
    if (this.gameState.mode === 'divineStep' && this._wss.getCounter() === 0 ) {
        this._wss.doDivineStep(this.counter, this.cardsToSend);
        this.counter = 0;
        this.cardsToSend = [];
        setTimeout(() => {
          this._wss.doDivineStepEnd();
        }, 3000);
    } else if (this.gameState.mode === 'divineAction' && this._wss.getCounter() === 0 ) {
          this._wss.doDivine(this.counter, this.cardsToSend);
          this.counter = 0;
          this.cardsToSend = [];
          setTimeout(() => {
            this._wss.doDivineEnd();
          }, 3000);
      }
  }

  spellCheck(card) {
      if (this.spellElems.length > 0 && (this.spellElems[0] === card.elem || card.elem === 'aether') && this.gameState.mode === 'spellElemSelect') { // card chosen is correct
        // checking if card already selected
        const bsCoord = JSON.stringify(card.coord);
        const bsHighlight = JSON.stringify(this.discard);
        if (bsHighlight.indexOf(bsCoord) === -1) { // fresh card selected
            this.discard.push(card.coord);
            this.spellElems.shift();
            card.highlight = true;
        } else { // card has been previously selected(notifying user)
              this.selected = true;
              setTimeout(() => {
                  this.selected = false;
                }, 3000);
          }
        // Checking if spell selection is completed      
        if (this.spellElems.length === 0) { //
            console.log('Spell cast Successful!!');
            this.castSuccess = true;
            setTimeout(() => {
              this.castSuccess = false;
              // finding selected spell
              const spellToCast = this.playerComp.getSpellToCast();
              this._wss.spellSuccess(this.discard, spellToCast[0]);
              this.discard = [];
            }, 3000);
        }
      } else if (this.spellElems.length > 0 && this.gameState.mode === 'spellElemSelect') { // card chosen is wrong
        // checking if card already selected
        const bsCoord = JSON.stringify(card.coord);
        const bsHighlight = JSON.stringify(this.discard);
        if (bsHighlight.indexOf(bsCoord) === -1) { // fresh card selected
          console.log('Spell has been botched!');
          this.castBotched = true;
          setTimeout(() => {
              this.castBotched = false;
              const spellToCast = this.playerComp.getSpellToCast();
              this._wss.spellFailure(this.discard, spellToCast[0]);
              this.spellElems = [];
              this.discard = [];
          }, 3000);
        
        } else { // card has been previously selected(notifying user)
              this.selected = true;
              setTimeout(() => {
                  this.selected = false;
                }, 3000);
          }  
      }
  }

    weaveTime(card) {
      if (this.gameState.mode === 'weaveAction' && this._wss.getCounter() > 0) {
          this.cardCheck(card);
      }
      if (this.gameState.mode === 'weaveAction' && this._wss.getCounter() === 0) {
          this._wss.doWeave(this.cardsToSend[0], this.cardsToSend[1]);
          this.cardsToSend = [];
          this.counter = 0;
      }
    }

    scryTime(card) {
      if (this.gameState.mode === 'scryAction' && this._wss.getCounter() > 0) {
          this.cardCheck(card);
      }
      if (this.gameState.mode === 'scryAction' && this._wss.getCounter() === 0) {
          this._wss.doScry(this.counter, this.cardsToSend);
          this.cardsToSend = [];
          this.counter = 0;
      }
    }

    obscureTime(card) {
      if (this.gameState.mode === 'obscureAction' && this._wss.getCounter() > 0) {
          this.cardCheck(card, false);
      }
      if (this.gameState.mode === 'obscureAction' && this._wss.getCounter() === 0) {
          this._wss.doObscure(this.counter, this.cardsToSend);
          this.cardsToSend = [];
          this.counter = 0;
      }
    }

    cardCheck(card, fd = true) {
      // checking if card already selected
          const bsCoord = JSON.stringify(card.coord);
          const bsHighlight = JSON.stringify(this.cardsToSend);
          if (bsHighlight.indexOf(bsCoord) === -1 && ((fd) ? !card.faceUp : card.faceUp)) { // fresh card selected
              this.cardsToSend.push(card.coord);
              this._wss.reduceCounter();
              this.counter++;
              card.highlight = true;
          } else { // card has been previously selected(notifying user)
                this.selected = true;
                setTimeout(() => {
                    this.selected = false;
                  }, 3000);
            }
    }
}
