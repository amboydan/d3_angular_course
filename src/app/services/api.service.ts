import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) { }

  
  getParsedData(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text'})
      .pipe(
        retry(3),
        map((csv) => d3.csvParse(csv))
      );
  }

  getJson(url: string): Observable<any> {
    return this.http.get<any>(url)
      .pipe(
        retry(3)
        // do not need to map this data because if we do it will create only columns in the set
        // map((answer) => answer.data)
      );
  }
  
  // the below code gives a corrs warning so will have alternative
  // getEmployees(): Observable<any> {
  //   return this.http.get<any>('http://dummy.restapiexample.com/api/v1/employees')
  //   .pipe(
  //     retry(3),
  //     //map is imported from rxjs.operators
  //     map((answer) => answer.data)
  //   )
  // }

  getEmployees(): Observable<any> {
    return this.http.get<any>('assets/employees.json')
    .pipe(
      retry(3),
      //map is imported from rxjs.operators
      map((answer) => answer.data)
    )
  }

  // the below code gives a corrs warning so will have alternative
  getIris(): Observable<any> {
    const url = 'https://raw.githubusercontent.com/d3taviz/dashboardOne/scatterplot-init/src/assets/iris.csv'
    return this.getParsedData(url);
  }

  // the below code gives a corrs warning so will have alternative
  getCovidData(): Observable<any> {
    const url = 'https://api.covidtracking.com/v1/us/daily.json'
    //getParsedDate is not necessary below because we are already recieving a json file
    return this.getJson(url);
  }

  getBrowsersData(): Observable<any> {
    const url = 'assets/browsers.json';
    return this.getJson(url);
    // return this.http.get<any>('assets/browsers.json')
    // .pipe(
    //   retry(3),
      //map is imported from rxjs.operators
      //map((answer) => answer.data)
    //)
  }

    // get the population data from the assets folder
    getPopulationData(): Observable<any> {
      const url = 'assets/population2.csv'
      return this.getParsedData(url);
    }
}
