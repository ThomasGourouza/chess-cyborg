import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
export interface httpOptions {
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

  private _message: string;
  private _gameId!: string;

  constructor(
    private http: HttpClient
  ) {
    this._token = 'lip_ioVMpN8TZLuwzh0jKySY';
    this.LICHESS_BASE_URL = 'https://lichess.org/';
    this.API_BOARD_GAME = 'api/board/game/';
    this.MOVE = '/move/';
    this._message = '';
  }

  set gameId(lichessUrl: string) {
    this._gameId = lichessUrl.split(this.LICHESS_BASE_URL)[1];
  }

  get message(): string {
    return this._message;
  }

  set token(token: string) {
    this._token = token;
  }

  private getHttpOptions(token: string): httpOptions {
    return {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
    };
  }

  private getLichessApiUrl(move: string): string {
    return this.LICHESS_BASE_URL + this.API_BOARD_GAME + this._gameId + this.MOVE + move;
  }

  postMove(move: string): void {
    const url = this.getLichessApiUrl(move);
    const httpOptions = this.getHttpOptions(this._token);
    this.http.post(url, null, httpOptions).toPromise()
      .then(() => {
        this._message = "ok";
      }).catch(() => {
        this._message = "ko";
      });
  }
}
