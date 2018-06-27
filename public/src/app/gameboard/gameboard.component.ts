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
  constructor(private _wss: WebsocketService) { }

  ngOnInit() {
    let obs = this._wss.getObservable();
    obs.subscribe((state)=>{
      this.state = state;
    });
  }

  toggleState(card) {
    card.faceUp = (card.faceUp === false ) ? true : false;
  }

  getGameboard() {

  }




}
