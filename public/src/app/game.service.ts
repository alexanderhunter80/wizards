import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private _http: HttpClient) { }

  getGame() {
    // our http response is an Observable, store it in a variable
    // subscribe to the Observable and provide the code we would like to do with our data from the response
    return this._http.get('/test');
  }
}
