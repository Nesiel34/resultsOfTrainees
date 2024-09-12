import { Injectable, signal } from '@angular/core';
import { ITrainee } from '../interface/ITrainee.interface';

@Injectable({
  providedIn: 'root'
})
export class TraineeService {

  constructor() {
    const trainee:ITrainee = {
      id:"200941185",
      name:"nesiel",
      date:new Date(),
      subject:"computer science",
      grade:97
    };
    this.addTrainee(trainee);
  }

  traineeArr = signal<ITrainee[]>([] as ITrainee[]);


  addTrainee(trainee:ITrainee){
    this.traineeArr.update(values => {
      return [...values, trainee];
   });
  }

  updateTrainee(trainee:ITrainee,rowId:number){
    this.traineeArr.update(values => {
      values[rowId] = trainee;
      return [...values];
   });
  }

  removeTrainee(rowId:number){
    this.traineeArr.update(values => {
      values.splice(rowId,1);
      return [...values];
   });
  }
}
