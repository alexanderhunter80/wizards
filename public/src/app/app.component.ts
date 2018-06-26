import { Component, OnInit } from '@angular/core';
import { ActionService } from './action.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(private actServ: ActionService) {} //This all can be moved to other components to run more modular

  ngOnInit(){
  	this.actServ.messages.subscribe(msg => { //change "message" to refelct action
  		console.log(msg);
  	})
  }
  sendMessage(){
  	this.chat.sendMsg('test message');
  }
}
