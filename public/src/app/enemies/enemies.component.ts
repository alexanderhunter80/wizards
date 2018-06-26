import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enemies',
  templateUrl: './enemies.component.html',
  styleUrls: ['./enemies.component.scss']
})
export class EnemiesComponent implements OnInit {
  enemies = [];

  constructor() { }

  ngOnInit() {
    this.enemies.push({
      'id' : 98,
      'socketid' : 45,
      'name' : 'Enemy 1',
      'spells' : [],
      'health' : 5,
      'shields' : 3,
      'aptokens' : [0, 0, 0, 0],
      'hptokens' : [1, 1, 1, 1],
      'isGhost' : false,
      'passives' : []
    },
    {
      'id' : 27,
      'socketid' : 42,
      'name' : 'Enemy 2',
      'spells' : [],
      'health' : 5,
      'shields' : 0,
      'aptokens' : [],
      'hptokens' : [],
      'isGhost' : false,
      'passives' : []
    },
    {
      'id' : 73,
      'socketid' : 55,
      'name' : 'Enemy 3',
      'spells' : [],
      'health' : 5,
      'shields' : 0,
      'aptokens' : [],
      'hptokens' : [],
      'isGhost' : false,
      'passives' : []}
    );
  }

}
