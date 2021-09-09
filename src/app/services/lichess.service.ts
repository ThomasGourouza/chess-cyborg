import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface HttpOptions {
  headers: HttpHeaders;
}

@Injectable({
  providedIn: 'root'
})
export class LichessService {

  private LICHESS_BASE_URL: string;
  private API_BOARD_GAME: string;
  private MOVE: string;
  private _token: string;

  private _gameId!: string;

  constructor(
    private http: HttpClient
  ) {
    this._token = 'lip_ioVMpN8TZLuwzh0jKySY';
    this.LICHESS_BASE_URL = 'https://lichess.org/';
    this.API_BOARD_GAME = 'api/board/game/';
    this.MOVE = '/move/';
  }

  set gameId(lichessUrl: string) {
    this._gameId = lichessUrl.split(this.LICHESS_BASE_URL)[1];
  }

  set token(token: string) {
    this._token = token;
  }

  private getHttpMoveOptions(token: string): HttpOptions {
    return {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
    };
  }

  private getLichessMoveApiUrl(move: string): string {
    return this.LICHESS_BASE_URL + this.API_BOARD_GAME + this._gameId + this.MOVE + move;
  }

  postMove(move: string): Observable<any> {
    const url = this.getLichessMoveApiUrl(move);
    const httpOptions = this.getHttpMoveOptions(this._token);
    return this.http.post(url, null, httpOptions);
  }

}
