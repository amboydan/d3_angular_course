import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RouterOutlet } from '@angular/router';
import { Chart1Component } from "./charts/chart1/chart1.component";
import { Chart2Component } from './charts/chart2/chart2.component';
import { Chart3Component } from './charts/chart3/chart3.component';
import { Chart4Component } from './charts/chart4/chart4.component';
import { Chart5Component } from './charts/chart5/chart5.component';
import { Chart6Component } from './charts/chart6/chart6.component';
import { Chart7Component } from './charts/chart7/chart7.component';
//
import { ApiService } from './services/api.service';
//
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//
import { IPieData, IPieConfig, IGroupStackData, IGroupStackDataElem, IGroupStackConfig } from './interfaces/chart.interfaces';
//
import { PieHelper } from './helpers/pie.helper';
import { StackHelper } from './helpers/stack.helper';
//
import * as d3 from 'd3';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Chart1Component, Chart2Component, 
    CommonModule, Chart3Component, Chart4Component,
    Chart5Component, Chart6Component, Chart7Component],
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
  browser: any;


  // remembering that IPieData was defined in the interfaces folder chart.interfaces.ts
  pieData: IPieData = {
    title: '',
    data: []
  };

  pieConfig = {};

  pieConfig2 = {
    innerRadiusCoef: 0
  };
  
  population$: Observable<any>;
  population: any;

  stackedData: IGroupStackData;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    //called after the constructor, initializing input properties, and the first call to ng...
    //Add 'Implements OnInit' to the class.
    
    this.data2$ = this.api.getEmployees();
    this.iris$ = this.api.getIris();
    this.covidData$ = this.api.getCovidData();
    this.browsers$ = this.api.getBrowsersData();
    this.population$ = this.api.getPopulationData();

    this.browsers$.subscribe((data) => {
      this.browser = data;
      this.setPieData('now'); // this will return an error if you do not fix setPieData if then below
      // console.log(this.pieData);
    })
    // can get the response from an api call through a subscription
    // this.data2$.subscribe(c => console.log(c));
    // this.browsers$.subscribe(c => console.log(c));
    // this.covidData$.subscribe(res => console.log(res));
    // console.log(this.data2$.subscribe(res => console.log(res)));
    
    this.population$.subscribe((data) => {
      this.population = data;
      const stacks = StackHelper.SetStacks(data, 'year', 'gender', 'age_group', 'value', (val) => val/1e6);
      
      this.stackedData = {
        title: ' Population by Year, Gender, age group (in millions)',
        yLabel: 'Population (millions)',
        unit: 'million',
        data: stacks
      }
    })

    setTimeout(
      () => {
        this.data1 = [...this.data1, 95]; }
      ,5000
    )
  }

  // THE BELOW IS NOW BEING TAKEN CARE OF WITH THE HELPER FUNCTION (MORE GENERIC FOR "REUSE")
  // convertBrowserToPieData(valueAttr: string) {
  //   const data = this.browser.map((elem: any) => ({
  //     id: elem.name,
  //     label: elem.name,
  //     value: elem[valueAttr] // this process is very important! we define browser
  //     // and then we define pieData up top.  this.browser will equal the full data set 
  //     // and the pieData will equal the browser data that is determined by which value we
  //     // are toggleing (before or after).  
  //   }));

  //   return {
  //     title: "Browser market share",
  //     data
  //   }
  // }

  setPieData(event) {
    const valueAttr = typeof event === 'string' ? event : event.target.value;
    // utilizing the helper function for MORE GENERIC USE OR "REUSE"
    // change from this => this.pieData = this.convertBrowserToPieData(valueAttr);
    // to this =>
    this.pieData = PieHelper.convert(this.browser, "Browser market share", valueAttr, 'name', 'name');
    // look at the helper pop up to remember what goes where in the function convert
  }

}
