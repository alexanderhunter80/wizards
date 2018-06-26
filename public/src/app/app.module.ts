import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActionService } from './action.service';
import { WebsocketService } from './websocket.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
  	ActionService,
  	WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
