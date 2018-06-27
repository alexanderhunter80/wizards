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
  board = [];
  constructor(private _wss: WebsocketService) { }

  ngOnInit() {
    this.getGameboard();
    console.log('_wss');
    console.log(this._wss);
  }

  toggleState(card) {
    card.faceUp = (card.faceUp === false ) ? true : false;
  }

  getGameboard() {
    this.board = this._wss.state.gameboard.grid;
  }




}
