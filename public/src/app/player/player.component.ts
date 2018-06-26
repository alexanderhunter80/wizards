import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  player = {
    'id' : 98,
    'socketid' : 45,
    'name' : 'Enemy 1',
    'spells' : [],
    'health' : 5,
    'shields' : 0,
    'aptokens' : [0, 0, 0, 0],
    'hptokens' : [1, 1, 1, 1],
    'isGhost' : false,
    'passives' : []
  };
  constructor() { }

  ngOnInit() {
  }

}
