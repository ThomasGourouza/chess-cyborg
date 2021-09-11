import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LichessService } from 'src/app/services/lichess.service';
import { interval } from 'rxjs/internal/observable/interval';
import { PlayMoveService } from 'src/app/services/play-move.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

  public form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private lichessService: LichessService,
    private playMoveService: PlayMoveService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.onChanges();
  }

  private initForm(): void {
    this.form = this.formBuilder.group(
      {
        token: [''],
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

  private playmove(): void {
    let move: string;
    do {
      move = this.playMoveService.getMove();
    } while (this.playMoveService.wrongMoves.includes(move));
    this.lichessService.postMove(move).toPromise()
      .then(() => {
        this.playMoveService.setFigureOnBoard(move);
        this.playMoveService.resetWrongMoves();
      }).catch(() => {
        this.playMoveService.addWrongMove(move);
        console.log(this.playMoveService.wrongMoves);
      });
  }

  public onSubmit(): void {
    interval(1000).subscribe(() => {
      this.playmove();
    });
  }

}
