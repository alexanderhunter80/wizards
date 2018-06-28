import { Component, OnInit } from '@angular/core';
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

  state: any = null;
  divineCards = [];
  divineCounter = 0;

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
    card.faceUp = (card.faceUp === false ) ? true : false;
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
      console.log(card.coord);
      console.log(this.state.highlight);
      const bsCoord = JSON.stringify(card.coord);
      const bsHighlight = JSON.stringify(this.state.highlight);
      if (bsHighlight.indexOf(bsCoord) !== -1) {
        console.log('found true');
        card.highlight = true;
      } else {
        console.log('found false');
        card.highlight = false;
      }
    }

    divineTime(card) {
      if (this._wss.divine && this._wss.divineCount > 0) {
        // checking if card already viewed
        const bsCoord = JSON.stringify(card.coord);
        const bsHighlight = JSON.stringify(this.divineCards);
        if (bsHighlight.indexOf(bsCoord) === -1) {
          this.divineCards.push(card.coord);
          this._wss.divineCount--;
          this.divineCounter++;
          card.highlight = true;
       } else {
         console.log('Card already selected');
       }

      }
      if (this._wss.divine && this._wss.divineCount === 0) {
        this._wss.divine = false;
        this._wss.doDivine(this.state.players[this.state.currentTurn], this.divineCounter, this.divineCards);
        this.divineCounter = 0;
        this.divineCards = [];
      }
    }
}
