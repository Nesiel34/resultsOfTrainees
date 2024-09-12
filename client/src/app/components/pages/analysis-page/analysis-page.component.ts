import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TraineeService } from '../../../services/trainee.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Chart, registerables } from 'chart.js'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StateService } from '../../../services/state.service';
import {
  CdkDragDrop,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';Chart.register(...registerables)


@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [MatFormFieldModule,MatInput,MatSelectModule,ReactiveFormsModule,CdkDropList, CdkDrag],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.scss'
})
export class AnalysisPageComponent implements OnInit {


  traineeService: TraineeService = inject(TraineeService);
  stateService:StateService = inject(StateService);
  traineeIdArr!:string[];
  subjectsArr!:string[];
  ids=new FormControl();
  subjects= new FormControl();
  subjectChart!:Chart;
  traineeChart!:Chart;
  chart!:Chart;
  hiddenCharts = [];
  visibleCharts = [];
  constructor(){
    effect(()=>{
      this.traineeIdArr = Array.from(new Set(this.traineeService.traineeArr().map(m=>m.id)));
    });
    effect(()=>{
      this.subjectsArr =this.getAllSubjects();
    });
    this.ids.valueChanges.pipe(takeUntilDestroyed()).subscribe(id=>{
      if(id.length===0){
        this.traineeChart.data.labels = this.getAllTraineeId();
        this.traineeChart.data.datasets[0].data = this.getAverageByTrainee(this.getAllTraineeId());
        this.chart.data.labels = [this.getAllTraineeId().join(",")];
        this.chart.data.datasets[0].data = this.getAverageForTrainee(this.getAllTraineeId());
      }
      else{
        this.traineeChart.data.labels = id;
        this.traineeChart.data.datasets[0].data = this.getAverageByTrainee(id);
        this.chart.data.labels =[id.join(",")];
        this.chart.data.datasets[0].data = this.getAverageForTrainee(id);
      }
        this.traineeChart.update();
        this.chart.update();
        this.stateService.setState("Analysis",{
          ...this.stateService.getState("Analysis"),
          id:id
        });
    });
    this.subjects.valueChanges.pipe(takeUntilDestroyed()).subscribe(subject=>{
      if(subject.length==0){
        this.subjectChart.data.labels = this.getAllSubjects();
        this.subjectChart.data.datasets[0].data = this.getAverageBySubject(this.getAllSubjects());
      }
      else {
        this.subjectChart.data.labels = subject;
        this.subjectChart.data.datasets[0].data = this.getAverageBySubject(subject);
      }
      this.subjectChart.update();
      this.stateService.setState("Analysis",{
        ...this.stateService.getState("Analysis"),
        subject:subject
      });
    });
  }


  ngOnInit(): void {
  this.subjectChart =new Chart('subjectChart', {
      type: "bar",
      data: {
        labels:this.getAllSubjects(),
        datasets: [
          {
            label: "Grades averages per subject",
            data:this.getAverageBySubject(this.getAllSubjects()),
          }
        ]
      }
    })

  this.traineeChart =  new Chart('traineeChart', {
      type: "bar",
      data: {
        labels:this.getAllTraineeId(),
        datasets: [
          {
            label: "Grades avarege for each trainee",
            data:this.getAverageByTrainee(this.getAllTraineeId()),
          }
        ]
      }
    })

  this.chart = new Chart('chart', {
      type: "bar",
      data: {
        labels: [this.getAllTraineeId().join(",")],
        datasets: [
          {
            label:"averages for trainee with chosen ID",
            data:this.getAverageForTrainee(this.getAllTraineeId())
          }
        ]
      }
    })
    const AnalysisFilter = this.stateService.getState("Analysis")
    if(AnalysisFilter){
      if(AnalysisFilter.id){
        this.ids.setValue(AnalysisFilter.id);
      }
      if(AnalysisFilter.subject){
        this.subjects.setValue(AnalysisFilter.subject);
      }
    }

  }

  getAllSubjects(){
    return Array.from(new Set(this.traineeService.traineeArr().map(m=>m.subject)));
  }

  getAllTraineeId(){
    return Array.from(new Set(this.traineeService.traineeArr().map(m=>m.id)));
  }


  getAverageBySubject(sujbectArr:string[]) {
    let avgArr = [];
    for (const subject of sujbectArr) {
      const traineeSubjectGrades = this.traineeService.traineeArr().filter(g => g.subject === subject);
      const sum = traineeSubjectGrades.reduce((acc, g) => acc + (g.grade ? g.grade : 0), 0);
      const average = sum / traineeSubjectGrades.length;
      avgArr.push(average);
    }
    return avgArr;
  }


  getAverageByTrainee(trainee:string[]) {
    let avgArr = [];
    for (const traineeId of trainee) {
      const traineeIdGrades = this.traineeService.traineeArr().filter(g => g.id === traineeId);
      const sum = traineeIdGrades.reduce((acc, g) => acc + (g.grade ? +g.grade : 0), 0);
      const average = sum / traineeIdGrades.length;
      avgArr.push(average);
    }
    return avgArr;
  }

  getAverageForTrainee(trainee:string[]){
    let avgArr = this.getAverageByTrainee(trainee);
    const sum = avgArr.reduce((acc, g) => acc + +g, 0);
    const average = sum / avgArr.length;
    return [average];
  }

  // drop(event: CdkDragDrop<never[]>) {
  //   if (event.previousContainer === event.container) {
  //     return;
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );
  //   }
  // }


}
