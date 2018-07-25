import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit {

  player: any;
  state: any;
  gameState: any;
  keepCards = [];
  keepCounter = 0;
  selected = false;

  constructor(private _wss: WebsocketService) { }

  ngOnInit() {
    this.player = null;
    const obs = this._wss.getObservable();
    obs.subscribe((state) => {
      console.log('state observable was updated');
      this.state = state;
      if (this.state) {
        this.getPlayer();
      }
    });

    const gsObs = this._wss.getGameState();
    gsObs.subscribe((gs) => {
      console.log('game state updated');
      this.gameState = gs;
    });
  }

  getPlayer() {
    for (const person of this.state.players) {
      if (this._wss.playerid === person.socketid) {
        this.player = person;
        break;
      }
    }
  }

  learnSpell(spellCard) {
    if (this.gameState.mode === 'learnAction' && this.keepCounter < this.state.learnHelper.keep) {
      console.log(this.keepCards);
      // checking if card already viewed
        if (this.keepCards.indexOf(this.state.learnHelper.cardsDrawn.indexOf(spellCard)) === -1) {
          this.keepCards.push(this.state.learnHelper.cardsDrawn.indexOf(spellCard));
          this.keepCounter++;
          spellCard.highlight = true;
       } else {
         this.selected = true;
         setTimeout(() => {
          this.selected = false;
        }, 5000);
       }
    }
    if (this.gameState.mode === 'learnAction' && this.keepCounter === this.state.learnHelper.keep) {
      console.log(this.keepCards);
      this._wss.learn(this.player, this.keepCards);
      this.keepCounter = 0;
      this.keepCards = [];
    }
  }

}
