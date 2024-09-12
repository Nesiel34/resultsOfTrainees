import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, effect, inject, OnInit, signal, Signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TraineeDetailsComponent } from '../../trainee-details/trainee-details.component';
import { ITrainee } from '../../../interface/ITrainee.interface';
import { TraineeService } from '../../../services/trainee.service';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [MatTableModule,DatePipe,MatPaginator,ReactiveFormsModule,MatButton,MatFormFieldModule,MatCardModule,MatInput,TraineeDetailsComponent],
  templateUrl: './data-page.component.html',
  styleUrl: './data-page.component.scss'
})
export class DataPageComponent implements OnInit,AfterViewInit {


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filter = new FormControl();
  showDetails:boolean = false;
  traineeService:TraineeService = inject(TraineeService);
  stateService:StateService = inject(StateService);



  constructor(){
    this.filter.valueChanges.pipe(takeUntilDestroyed()).subscribe((filter)=>{
        this.dataSource.filterPredicate =function(data, filter: string): boolean {
          if(filter.includes(":")){
            const filterSplit = filter.split(":");
            if(filterSplit.length>=2){
          if(typeof (filterSplit[0].toLowerCase() as keyof ITrainee)==="string"){
            return (data[filterSplit[0].toLowerCase() as keyof ITrainee]as string).includes(filterSplit[1]);
          }
        }
         }
      return false;
      };
      this.dataSource.filter = filter;
      this.stateService.setState("data",filter)
     });
    effect(()=>{
      this.dataSource.data = this.traineeService.traineeArr();
    })
  }

  columnsTable:{key:string,header:string,isDate?:boolean}[] = [
    {
      key:"id",
      header:"ID"
    },
    {
      key:"name",
      header:"Name"
    },
    {
      key:"date",
      header:"Date",
      isDate:true
    },
    {
      key:"grade",
      header:"Grade"
    },
    {
      key:"subject",
      header:"Subject",
    }
  ]
  displayedColumns:string[] = this.columnsTable.map(m=>m.key);
  dataSource = new MatTableDataSource<ITrainee>();
  currentTrainee= signal<ITrainee>({} as ITrainee);
  rowId = signal<number>({} as number);

  ngOnInit(): void {
    const dataFilter = this.stateService.getState("data");
    if(dataFilter){
      this.filter.setValue(dataFilter);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  chooseTrainee(row:ITrainee,rowid:number){
    if(this.rowId()!=rowid){
      this.currentTrainee.set(row);
      this.rowId.set(rowid);
      this.showDetails =true;
    }
    else {
      this.currentTrainee.set(this.initTrainee());
      this.rowId.set(-1);
      this.showDetails = false;
    }
  }

  addTrainee(){
    this.showDetails = true;
    this.rowId.set(-1);
    this.currentTrainee.set(this.initTrainee());
  }

  remove(){
    this.traineeService.removeTrainee(this.rowId());
    this.close();
  }

  close(){
    this.showDetails = false;
    this.currentTrainee.set(this.initTrainee());
    this.rowId.set(-1);
  }

  initTrainee(){
    const trainee:ITrainee = {
      address:"",
      city:"",
      country:"",
      date:null,
      email:"",
      grade:null,
      id:"",
      name:"",
      subject:"",
      zip:"",
    }
    return trainee
  }


}
