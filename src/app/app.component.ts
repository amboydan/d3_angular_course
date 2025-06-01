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
import { Chart8Component } from './charts/chart8/chart8.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Chart1Component, Chart2Component, 
    CommonModule, Chart3Component, Chart4Component,
    Chart5Component, Chart6Component, Chart7Component,
    Chart8Component],
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

  stackOptions = [
    {
      label: 'Year (grouped)',
      value: 'year/gender/age_group/'
    },
    {
      label: 'Year (no-grouped - stacked)',
      value: 'year//age_group/'
    },
    {
      label: 'Year (grouped - no stack)',
      value: 'year/age_group//'
    },
    {
      label: 'Year (no grouped - no stack)',
      value: 'year///'
    },
    {
      label: 'Countries 2012',
      value: 'country/gender/age_group/2012'
    },
    {
      label: 'Country 2006',
      value: 'country/gender/age_group/2006'
    },
    {
      label: 'Country (no group - stacked)',
      value: 'country//age_group/2012'
    }
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    //called after the constructor, initializing input properties, and the first call to ng...
    //Add 'Implements OnInit' to the class.
    
    this.data2$ = this.api.getEmployees();
    this.iris$ = this.api.getIris();
    this.covidData$ = this.api.getCovidData();
    this.browsers$ = this.api.getBrowsersData();
    this.population$ = this.api.getPopulationData();
    // this.population$.subscribe(data => {
    //   this.population = data;
    //   const stacks = StackHelper.SetStacks(this.population, 'year', 'gender', 'age_group', 'value');

    // });

    this.browsers$.subscribe((data) => {
      this.browser = data;
      this.setPieData('now'); 
    })

    
    this.population$.subscribe((data) => {
      this.population = data;
      this.setStackedData('year/gender/age_group/');
    })

    setTimeout(
      () => {
        this.data1 = [...this.data1, 95]; }
      ,5000
    )
  }

   setPieData(event) {
    const valueAttr = typeof event === 'string' ? event : event.target.value;
    // utilizing the helper function for MORE GENERIC USE OR "REUSE"
    // change from this => this.pieData = this.convertBrowserToPieData(valueAttr);
    // to this =>
    this.pieData = PieHelper.convert(this.browser, "Browser market share", valueAttr, 'name', 'name');
    // look at the helper pop up to remember what goes where in the function convert
  }

   setStackedData(event) {
    const valueAttr = typeof event === 'string' ? event : event.target.value;
    const [domain, group, stack, year] = valueAttr.split('/');

    const population = year == '' ? this.population : this.population.filter((d) => d.year === year);

    const data = StackHelper.SetStacks(population, domain, group, stack, 'value', (val) => val/1e6);
      
    this.stackedData = {
      title: ' Population by Year, Gender, age group (in millions)',
      yLabel: 'Population (millions)',
      unit: 'million',
      data,
      stackOrder: ['<3', '4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '>=40']
    };
  }

}
