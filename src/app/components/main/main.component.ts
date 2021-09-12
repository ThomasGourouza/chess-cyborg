import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LichessService } from 'src/app/services/lichess.service';
import { interval } from 'rxjs/internal/observable/interval';
import { PlayMoveService } from 'src/app/services/play-move.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

  public form!: FormGroup;
  public subscription!: Subscription;
  public isStarted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private lichessService: LichessService,
    private playMoveService: PlayMoveService
  ) {
    this.isStarted = false;
  }

  ngOnInit(): void {
    this.initForm();
    this.onChanges();
  }

  private initForm(): void {
    this.form = this.formBuilder.group(
      {
        token: [''],
        isWhite: ['', Validators.required],
        lichessUrl: ['', Validators.required]
      }
    );
  }

  private onChanges(): void {
    const tokenForm = this.form.get('token');
    const lichessUrlForm = this.form.get('lichessUrl');
    if (!!tokenForm) {
      tokenForm.valueChanges.subscribe((token) => {
        this.lichessService.token = token;
      });
    }
    if (!!lichessUrlForm) {
      lichessUrlForm.valueChanges.subscribe((lichessUrl) => {
        this.lichessService.gameId = lichessUrl;
      });
    }
  }

  private playmove(isWhite: boolean): void {
    if (this.playMoveService.board.length > 0) {
      let move: string;
      do {
        move = this.playMoveService.getMove(isWhite);
      } while (this.playMoveService.wrongMoves.includes(move));
      this.lichessService.postMove(move).toPromise()
        .then(() => {
          this.playMoveService.setFigureOnBoard(move);
          this.playMoveService.resetWrongMoves();
        }).catch(() => {
          this.playMoveService.addWrongMove(move);
        });
    }
  }

  public onSubmit(): void {
    this.isStarted = true;
    const isWhite = (this.form.value['isWhite'] === 'true');
    this.playMoveService.initBoard(isWhite);
    this.subscription = interval(1000).subscribe((second) => {
      this.playmove(isWhite);     
      if (second%10 === 0) {
        this.playMoveService.resetWrongMoves();
      }
    });
  }

  public onStop(): void {
    this.isStarted = false;
    this.subscription.unsubscribe();
  }

}
