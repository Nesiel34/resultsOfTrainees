import { DecimalPipe } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TraineeService } from '../../../services/trainee.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInput } from '@angular/material/input';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-monitor-page',
  standalone: true,
  imports: [MatCheckboxModule,MatTableModule,MatFormFieldModule,MatInput,MatSelectModule,DecimalPipe,ReactiveFormsModule],
  templateUrl: './monitor-page.component.html',
  styleUrl: './monitor-page.component.scss'
})
export class MonitorPageComponent implements OnInit {

  constructor(){
    effect(()=>{
      this.traineeId = Array.from(new Set(this.traineeService.traineeArr().map(m=>m.id)));
      for(const trainee of this.traineeId){
          this.getAverageByStudentId(trainee);
      }
      this.dataSource.data = [...this.gradesArray];
    });
    this.form = new FormGroup({
      ids:new FormControl(null),
      names:new FormControl(""),
      passed:new FormControl(true),
      failed:new FormControl(true)
    });
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(s=>{
      this.stateService.setState("Monitor",s);
      this.dataSource.filter = JSON.stringify(s);
    });
  }



  traineeService:TraineeService = inject(TraineeService);
  stateService:StateService = inject(StateService);
  traineeId!:string[];
  columnsTable:{header:string;key:string;isDecimal?:boolean}[] = [
    {
      key:"id",
      header:"ID"
    },
    {
      key:"name",
      header:"Name"
    },
    {
      key:"average",
      header:"Average",
      isDecimal:true
    },
    {
      key:"exams",
      header:"Exams"
    }
  ]
  displayedColumns:string[] = this.columnsTable.map(m=>m.key);
  dataSource = new MatTableDataSource<{id:string,name:string;average:number,exams:number}>();
  gradesArray:{id:string,name:string;average:number,exams:number}[] = [];

  form!:FormGroup;


  ngOnInit(): void {
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      console.log(searchString.ids);
      const passed = searchString.failed || searchString.passed &&data.average>65;
      const failed = searchString.passed || searchString.failed && data.average<=65;
      const names = data.name.toLowerCase().includes(searchString.names.toLowerCase());
      const ids = !searchString.ids?.length || searchString.ids.some((id:string)=>id == data.id);
      return passed && failed && names && ids;
    }

    const monitorFilter=this.stateService.getState("Monitor");
    if(this.stateService.getState("Monitor")){
      this.form.setValue(monitorFilter);
    }
  }

  getAverageByStudentId(studentId: string) {
    const studentGrades = this.traineeService.traineeArr().filter(g => g.id === studentId);

    if (studentGrades.length === 0) {
      return;
    }

    const sum = studentGrades.reduce((acc, g) => acc + (g.grade?+g.grade:0), 0);
    const average = sum / studentGrades.length;
    this.gradesArray.push({
      id:studentId,
      name:studentGrades[0].name,
      average:average,
      exams:studentGrades.length
    });
  }

}
