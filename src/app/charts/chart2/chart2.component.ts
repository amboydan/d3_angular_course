import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart2.component.html',
  styleUrl: './chart2.component.scss'
})
export class Chart2Component implements OnInit, OnChanges {

  // data = [125, 120, 70, 75, 160, 120, 180];
  // this data is now placed in the app.component.ts file
  @Input() data;
  xlabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  rectWidth = 50;

  max: number;
  dimensions: DOMRect;
  outerPadding = 20;
  bandwidth = 0;
  padding = 0;
  bandwidthCoef = 0.8; // 80%
  left = 10; right = 20; bottom = 16; top = 15;
  innerWidth: number;
  innerHeight: number;

  constructor(private element: ElementRef) {
    
  }

  ngOnInit() {
    const svg = this.element.nativeElement.getElementsByTagName('svg')[0];
    this.dimensions = svg.getBoundingClientRect();
    this.innerWidth = this.dimensions.width - this.left - this.right;
    this.innerHeight = this.dimensions.height - this.top - this.bottom;

    this.setParams();
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    this.setParams();
  }

  setParams() {
    const data = this.data || [100];
    this.rectWidth = (this.innerWidth - 2 * this.outerPadding) / data.length;
    this.bandwidth = this.bandwidthCoef * this.rectWidth;
    this.padding = (1 - this.bandwidthCoef) * this.rectWidth
    //
    this.max = 1.1 * Math.max(...data.map((item) => item.employee_salary));
  }
}
