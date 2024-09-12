import { Component, effect, EventEmitter, inject, input, OnInit, Output, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ITrainee } from '../../interface/ITrainee.interface';
import { TraineeService } from '../../services/trainee.service';

@Component({
  selector: 'app-trainee-details',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule,MatInput,MatDatepickerModule,MatButton],
  templateUrl: './trainee-details.component.html',
  styleUrl: './trainee-details.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class TraineeDetailsComponent implements OnInit {


  @Output() closeForm = new EventEmitter<void>();
  trainee =input.required<ITrainee>();
  rowId = input.required<number>();
  traineeService:TraineeService = inject(TraineeService);
  maxDate = new Date();

  constructor(){
    effect(()=>{
        for (const [key, value] of Object.entries(this.trainee())) {
          console.log(`${key}: ${value}`);
          this.traineeForm.controls[key as keyof ITrainee].setValue(value);
        }
    });
  }

  traineeForm = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    grade: new FormControl(null, [Validators.required,Validators.min(0),Validators.max(100)]),
    email: new FormControl('',[Validators.email]),
    date: new FormControl('', Validators.required),
    address: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl(''),
    zip: new FormControl(''),
    subject: new FormControl('', Validators.required),
  });

  ngOnInit(): void {

  }

  save(){
    if(this.traineeForm.valid){
      let trainee:ITrainee ={} as ITrainee;

      for (const field in this.traineeForm.controls) {
        const control = this.traineeForm.get(field);
        (trainee[field as keyof ITrainee] as any) =control?.value;
      }
      if(this.rowId()===-1){
        this.traineeService.addTrainee(trainee);
      }
      else {
        this.traineeService.updateTrainee(trainee,this.rowId());
      }
      this.close();
    }
  }

  close(){
    this.closeForm.emit();
  }

}
