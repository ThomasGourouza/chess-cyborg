import { Injectable } from '@angular/core';
import { FigureName } from '../models/figure-name';
export interface Figure {
  name: FigureName;
  column: string;
  row: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayMoveService {

  private _board: Array<Figure>;
  private _columns: Array<string>;
  private _rows: Array<string>;
  private _wrongMoves: Array<string>;

  constructor() {
    this._board = [];
    this._columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    this._rows = ['1', '2', '3', '4', '5', '6', '7', '8'];
    this._wrongMoves = [];
  }

  get board(): Array<Figure> {
    return this._board;
  }
  get wrongMoves(): Array<string> {
    return this._wrongMoves;
  }
  public addWrongMove(move: string): void {
    this._wrongMoves.push(move);
  }
  public resetWrongMoves(): void {
    this._wrongMoves = [];
  }

  public setFigureOnBoard(move: string) {
    const moveArray = move.split('');
    const colFrom = moveArray[0];
    const rowFrom = moveArray[1];
    const colTo = moveArray[2];
    const rowTo = moveArray[3];
    const figureName = this._board.find((figure) => this.getFilterCondition(figure, colFrom, rowFrom))?.name;
    if (!!figureName) {
      this._board = this._board.filter((figure) => !this.getFilterCondition(figure, colFrom, rowFrom));
      this._board.push({
        name: figureName,
        column: colTo,
        row: rowTo
      });
    }
  }

  private getFilterCondition(figure: Figure, column: string, row: string): boolean {
    return figure.column === column && figure.row === row;
  }

  public initBoard(isWhite: boolean): void {
    this.resetWrongMoves();
    this._board = [];
    const pawnsRow = isWhite ? '2' : '7';
    const figuresRow = isWhite ? '1' : '8';
    this._columns.forEach((col) => {
      this._board.push({
        name: FigureName.P,
        column: col,
        row: pawnsRow
      });
    });
    ['a', 'h'].forEach((col) => {
      this._board.push({
        name: FigureName.R,
        column: col,
        row: figuresRow
      });
    });
    ['b', 'g'].forEach((col) => {
      this._board.push({
        name: FigureName.N,
        column: col,
        row: figuresRow
      });
    });
    ['c', 'f'].forEach((col) => {
      this._board.push({
        name: FigureName.B,
        column: col,
        row: figuresRow
      });
    });
    this._board.push({
      name: FigureName.Q,
      column: 'd',
      row: figuresRow
    });
    this._board.push({
      name: FigureName.K,
      column: 'e',
      row: figuresRow
    });
  }

  public getMove(isWhite: boolean): string {
    const randomFigure: Figure = this.getRandomItem(this._board);
    const col = randomFigure.column;
    const row = randomFigure.row;
    let toList: Array<string> = [];
    switch (randomFigure.name) {
      case FigureName.P: {
        toList = this.getMoveToForPawn(col, row, isWhite);
        break;
      }
      case FigureName.B: {
        toList = this.getMoveToForBishop(col, row);
        break;
      }
      case FigureName.N: {
        toList = this.getMoveToForKnight(col, row);
        break;
      }
      case FigureName.R: {
        toList = this.getMoveToForRook(col, row);
        break;
      }
      case FigureName.Q: {
        toList = this.getMoveToForQueen(col, row);
        break;
      }
      case FigureName.K: {
        toList = this.getMoveToForKing(col, row);
        break;
      }
      default: {
        break;
      }
    }
    const to = this.getRandomItem(toList);
    return col + row + to;
  }

  private getRandomIndex(max: number): number {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max));
  }

  private getRandomItem(array: Array<any>): any {
    const randomIndex = this.getRandomIndex(array.length);
    return array[randomIndex];
  }

  private getMoveToForPawn(col: string, row: string, isWhite: boolean): Array<string> {
    const oneForward = isWhite ? 1 : -1;
    const twoForward = isWhite ? 2 : -2;
    const moves: Array<string> = [];
    if ((row === '2' && isWhite) || (row === '7' && !isWhite)) {
      const getRow2 = this.get(this._rows, row, twoForward);
      if (getRow2 !== 'null') {
        moves.push(col + getRow2);
      }
    }
    const getRow1 = this.get(this._rows, row, oneForward);
    const getCol1 = this.get(this._columns, col, 1);
    const getColMinus1 = this.get(this._columns, col, -1);
    if (getRow1 !== 'null') {
      moves.push(col + getRow1);
      if (getCol1 !== 'null') {
        moves.push(getCol1 + getRow1);
      }
      if (getColMinus1 !== 'null') {
        moves.push(getColMinus1 + getRow1);
      }
    }
    return moves;
  }

  private getMoveToForBishop(col: string, row: string): Array<string> {
    const moves: Array<string> = [];
    for (let i = -7; i < 8; i++) {
      if (i !== 0) {
        const getCol = this.get(this._columns, col, i);
        if (getCol != 'null') {
          const getRow = this.get(this._rows, row, i);
          if (getRow != 'null') {
            moves.push(getCol + getRow);
          }
          const getRowMinus = this.get(this._rows, row, i);
          if (getRowMinus != 'null') {
            moves.push(getCol + getRowMinus);
          }
        }
      }
    }
    return moves;
  }

  private getMoveToForKnight(col: string, row: string): Array<string> {
    const moves: Array<string> = [];
    const getRow2 = this.get(this._rows, row, 2);
    const getRowMinus2 = this.get(this._rows, row, -2);
    [getRow2, getRowMinus2].forEach((r) => {
      if (r !== 'null') {
        const getCol1 = this.get(this._columns, col, 1);
        const getColMinus1 = this.get(this._columns, col, -1);
        [getCol1, getColMinus1]
          .forEach((c) => {
            if (c !== 'null') {
              moves.push(c + r);
            }
          });
      }
    });
    const getCol2 = this.get(this._columns, col, 2);
    const getColMinus2 = this.get(this._columns, col, -2);
    [getCol2, getColMinus2].forEach((c) => {
      if (c !== 'null') {
        const getRow1 = this.get(this._rows, row, 1);
        const getRowMinus1 = this.get(this._rows, row, -1);
        [getRow1, getRowMinus1]
          .forEach((r) => {
            if (r !== 'null') {
              moves.push(c + r);
            }
          });
      }
    });
    return moves;
  }

  private getMoveToForRook(col: string, row: string): Array<string> {
    const moves: Array<string> = [];
    this._rows
      .filter((r) => r !== row)
      .forEach((r) => {
        moves.push(col + r);
      });
    this._columns
      .filter((c) => c !== col)
      .forEach((c) => {
        moves.push(c + row);
      });
    return moves;
  }

  private getMoveToForQueen(col: string, row: string): Array<string> {
    return this.getMoveToForRook(col, row).concat(this.getMoveToForBishop(col, row));
  }

  private getMoveToForKing(col: string, row: string): Array<string> {
    const moves: Array<string> = [];
    const getRow1 = this.get(this._rows, row, 1);
    const getRowMinus1 = this.get(this._rows, row, -1);
    [row, getRow1, getRowMinus1]
      .forEach((r) => {
        if (r !== 'null') {
          const getCol1 = this.get(this._columns, col, 1);
          const getColMinus1 = this.get(this._columns, col, -1);
          [col, getCol1, getColMinus1]
            .forEach((c) => {
              if (c !== 'null' && (c !== col || r !== row)) {
                moves.push(c + r);
              }
            });
        }
      });
    return moves;
  }

  private get(array: Array<string>, value: string, number: number): string {
    let j = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === value) {
        j = i;
      }
    }
    if ((j + number) >= 0 && (j + number) < array.length) {
      return array[j + number];
    }
    return 'null';
  }

}
