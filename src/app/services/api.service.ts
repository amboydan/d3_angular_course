import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  
  // the below code gives a corrs warning so will have alternative
  // getEmployees(): Observable<any> {
  //   return this.http.get<any>('http://dummy.restapiexample.com/api/v1/employees')
  //   .pipe(
  //     //map is imported from rxjs.operators
  //     map((answer) => answer.data)
  //   )
  // }

  getEmployees(): Observable<any> {
    return this.http.get<any>('assets/employees.json')
    .pipe(
      //map is imported from rxjs.operators
      map((answer) => answer.data)
    )
  }
}
