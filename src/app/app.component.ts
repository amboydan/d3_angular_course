import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chart1Component } from "./charts/chart1/chart1.component";
import { Chart2Component } from './charts/chart2/chart2.component';
import { Chart3Component } from './charts/chart3/chart3.component';
import { Chart4Component } from './charts/chart4/chart4.component';
import { Chart5Component } from './charts/chart5/chart5.component';
import { ApiService } from './services/api.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Chart1Component, Chart2Component, 
    CommonModule, Chart3Component, Chart4Component,
    Chart5Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'dashboardOne';

  data1 = [50, 200, 10, 80, 160, 19, 180];
  //dollar sign denotes dealing with an Observable
  data2$: Observable<any[]>;

  iris$: Observable<any>;

  covidData$: Observable<any>;

  browsers$: Observable<any>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    //called after the constructor, initializing input properties, and the first call to ng...
    //Add 'Implements OnInit' to the class.
    
    this.data2$ = this.api.getEmployees();
    this.iris$ = this.api.getIris();
    this.covidData$ = this.api.getCovidData();
    this.browsers$ = this.api.getBrowsersData();

    // can get the response from an api call through a subscription
    //this.data2$.subscribe(c => console.log(c));
     this.browsers$.subscribe(c => console.log(c));
    // this.covidData$.subscribe(res => console.log(res));
    // console.log(this.data2$.subscribe(res => console.log(res)));
    setTimeout(
      () => {
        this.data1 = [...this.data1, 95]; }
      ,5000
    )
  }
}
