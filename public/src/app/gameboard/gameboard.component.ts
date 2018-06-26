import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { GameService } from '../game.service';

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
  constructor(private game: GameService) { }

  ngOnInit() {
    this.getGameboard(); 
  }
 
  toggleState(card) {
    card.faceUp = (card.faceUp === false ) ? true : false;
  }

  getGameboard() {
    const observable = this.game.getGame();
    observable.subscribe(data => this.board = data['gameboard']['grid']);
  }


}
