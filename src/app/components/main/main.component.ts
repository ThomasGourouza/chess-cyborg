import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LichessService } from 'src/app/services/lichess.service';
import { interval } from 'rxjs/internal/observable/interval';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public form!: FormGroup;
  private index: number
  private moves: Array<string>;

  constructor(
    private formBuilder: FormBuilder,
    private lichessService: LichessService
  ) { 
    this.index = 0;
    this.moves = ['e2e4', 'b1c3', 'g1f3', 'g2g3', 'f1g2', 'e1g1'];
  }

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
    const token = this.form.get('token');
    const lichessUrl = this.form.get('lichessUrl');
    if (!!token) {
      token.valueChanges.subscribe((token) => {
        console.log(token);
        this.lichessService.token = token;
      });
    }
    if (!!lichessUrl) {
      lichessUrl.valueChanges.subscribe((lichessUrl) => {
        this.lichessService.gameId = lichessUrl;
      });
    }
  }

  private spamMoves(): void {
    const move = this.moves[this.index];
    this.lichessService.postMove(move).toPromise()
    .then(() => {
      this.index++;
    }).catch(() => {
      console.log('wait');
    });
  }

  public onSubmit(): void {
    const counter = interval(500);
    const subscription = counter.subscribe(() => {
      if (this.index < this.moves.length) {
        this.spamMoves();
      } else {
        subscription.unsubscribe();
      }
    });
  }

}
