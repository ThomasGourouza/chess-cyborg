import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LichessService } from 'src/app/services/lichess.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private lichessService: LichessService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.onChanges();
  }

  private initForm(): void {
    this.form = this.formBuilder.group(
      {
        token: [''],
        lichessUrl: ['', Validators.required],
        move: ['', Validators.required]
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

  public getMessage(): string {
    return this.lichessService.message;

  }

  public onSubmit(): void {
    const move = this.form.value['move'];
    this.lichessService.postMove(move);   
  }

}
