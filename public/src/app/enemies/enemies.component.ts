import { Component, OnInit } from '@angular/core';
import { WebsocketService} from '../websocket.service';

@Component({
  selector: 'app-enemies',
  templateUrl: './enemies.component.html',
  styleUrls: ['./enemies.component.scss']
})
export class EnemiesComponent implements OnInit {
enemies = [];
  constructor(private wes: WebsocketService) { }
  
  ngOnInit() {
  }

}
