import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart4',
  standalone: true,
  //imports CommonModule is necessary for 
  imports: [CommonModule],
  templateUrl: './chart4.component.html',
  styleUrl: './chart4.component.scss'
})
export class Chart4Component implements OnInit{
  @Input() data;

  xValue: string;
  yValue: string;

  constructor() {}

  ngOnInit(): void {
    console.log(this);
  }

  setOption(option: string, event) {
    const value = event && event.target && event.target.value;

    switch(option) {
      case 'x':
        this.xValue = value;
        break;
      case 'y':
        this.yValue = value;
        break;
    }

    this.updateChart();
  }

  updateChart() {

  }
}
