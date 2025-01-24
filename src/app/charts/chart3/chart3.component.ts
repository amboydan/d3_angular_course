import { Component, ElementRef, OnInit, ViewEncapsulation, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-chart3',
  standalone: true,
  imports: [],
  template: `<svg></svg>`,
  styleUrl: './chart3.component.scss',
  encapsulation: ViewEncapsulation.None // because of this the css will be applied to all styles
})
export class Chart3Component implements OnInit, OnChanges{
  host: any;
  svg: any;
  dataContainer: any;
  xAxisContainer: any;
  yAxisContainer: any;


  @Input() data;

  rectWidth = 30;
  padding = 5;
  dimensions: DOMRect;
  innerHeight;
  innerWidth;
  xAxis: any;
  yAxis: any;
  left = 60; right = 20; bottom = 80; top = 15;

  x = d3.scaleBand().paddingInner(0.2).paddingOuter(0.2);
  y = d3.scaleLinear();

  dataIsFiltered = false;

  get barsData() {
    return this.dataIsFiltered ? this.data.filter((d, i) => i >= 12) : this.data;
  };

  constructor( element: ElementRef) {
    this.host = d3.select(element.nativeElement);
    console.log(this);
  }

  ngOnInit(): void {
    this.svg = this.host.select('svg')
    .on('click', () => {
      this.dataChanged();
    });

    this.setDimensions();
    this.setElements();
  }

  dataChanged() {
    this.dataIsFiltered = !this.dataIsFiltered;
    this.updateChart();
    console.log(this.barsData);
  };

  // add another method
  setElements() {
    this.xAxisContainer = this.svg.append('g').attr('class', 'xAxisContainer').
    attr('transform', `translate(${this.left}, ${this.top + this.innerHeight})`);
    
    this.yAxisContainer = this.svg.append('g').attr('class', 'yAxisContainer').
    attr('transform', `translate(${this.left}, ${this.top})`);

    this.dataContainer = this.svg.append('g').attr('class', 'dataContainer').
    attr('transform', `translate(${this.left}, ${this.top})`);
    
  };

  setDimensions() {
    this.dimensions = this.svg.node().getBoundingClientRect();
    this.innerWidth = this.dimensions.width - this.left - this.right;
    this.innerHeight = this.dimensions.height - this.top - this.bottom;
  };

  ngOnChanges(changes: SimpleChanges) {
    if(!this.svg) return;
    this.updateChart();
  }

  updateChart() {
    this.setParams();
    // important to run the set parameters first, then axis and before the draw
    this.setAxis()
    this.setLabels()
    this.draw();
  }

  setLabels() {
    this.svg.append('g').attr('class', 'yAxisLabel')
    .attr('transform', `translate(15, ${this.top + 0.5 * this.innerHeight})`)
    .append('text').attr('class', 'label').text('Employee Salary')
    // remember when rotating text that it will rotate around the ORIGIN
    .attr('transform', `rotate(-90)`)
    .style('text-anchor', 'middle');
    
    this.xAxisContainer.selectAll('.tick text')
      .text((d) => this.getEmployeeName(d))
      .attr('transform', 'translate(-9,2)rotate(-45)')
      .style('text-anchor', 'end');
  }
  setAxis() {
    this.xAxis = d3.axisBottom(this.x);
    this.xAxisContainer.call(this.xAxis);

    this.yAxis = d3.axisLeft(this.y)
      //.tickSizeOuter(0)
      .tickSizeInner(-this.innerWidth)
      .tickPadding(10)
      .tickFormat(
        //d3.format("$,")
        //remove the insignificant zeros
        d3.format("$~s")
      );
    this.yAxisContainer.call(this.yAxis);

    this.yAxisContainer.selectAll('.tick line')
      .style('stroke', '#ddd');
    
    
  }

  getEmployeeName = (id) => this.data.find((d) => d.id === id).employee_name;

  setParams() {
    const ids = this.barsData.map((d) => d.id);
    this.x.domain(ids).range([0, this.innerWidth]);
    const max_salary = 1.3 * Math.max(...this.data.map((item) => item.employee_salary));
    this.y.domain([0, max_salary]).range([this.innerHeight, 0]);
  };

  draw() {
    const bars = this.dataContainer.selectAll('rect')
      .data(this.barsData);

      // First we bind the data (classical but merge takes care of this)
      // bars
      // .attr('x', (d) => this.x(d.id))
      // .attr('width', this.x.bandwidth())
      // .attr('y', (d) => this.y(d.employee_salary))
      // .attr('height', (d) => this.innerHeight - this.y(d.employee_salary));

      // Then we enter new data as it is needed
      bars.enter().append('rect')
      .merge(bars)
      .attr('x', (d) => this.x(d.id))
      .attr('width', this.x.bandwidth())
      .attr('y', (d) => this.y(d.employee_salary))
      .attr('height', (d) => this.innerHeight - this.y(d.employee_salary));

      // Then we remove data not needed
      bars.exit().remove();
     
  }
}
