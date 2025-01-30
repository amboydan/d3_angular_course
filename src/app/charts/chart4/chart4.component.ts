import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-chart4',
  standalone: true,
  //imports CommonModule is necessary for 
  imports: [CommonModule],
  templateUrl: './chart4.component.html',
  styleUrl: './chart4.component.scss'
})
export class Chart4Component implements OnInit, OnChanges{
  host: any;
  svg: any;
  dataContainer: any;
  xAxisContainer: any;
  yAxisContainer: any;

  textLabel: any;
  xLabel: any;
  yLabel: any;

  @Input() data;

  rectWidth = 30;
  padding = 5;
  dimensions: DOMRect;
  innerHeight: number;
  innerWidth: number;
  xAxis: any;
  yAxis: any;
  //left = 60; right = 20; bottom = 80; top = 30;
  
  margins = {
    left: 40,
    top: 20,
    right: 20,
    bottom: 40
  }

  xValue: string;
  yValue: string;

  x: any;
  y: any;

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
    console.log(this);
  }

  get scatterData() {
    // prior to setting the drop downs there is no data
    // so if x and y are not then return empty array
    if(!this.xValue || !this.yValue) { return []; }

    return this.data.map((elem) => {
      return {
        // + because they are returning strings
        x: +elem[this.xValue],
        y: +elem[this.yValue]
      }
    })
    /* return this.data.map((elem) => ({
            x: 0,
            y: 0,
          };
        }) this will also work*/
  }

  ngOnInit(): void {
    //only want to set the svg once.  when the chart is ready
    this.svg = this.host.select('svg');

    this.setDimensions();
    this.setElements();
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // the below is because we can not update the chart if it doesn't exist yet
    if(!this.svg) { return };
    this.updateChart();
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
    this.setParams();
    this.setLabels();
    this.setAxis();
    this.draw();
   }
  
  setDimensions() {
    //getBoundingClientRect() returns value relative to the viewport
    //getBBox() allows us to determine the coordinates of the smallest
    // rectangle in which the object fits. We are not using the viewport to zoom in
    // on the svg.
    this.dimensions = this.svg.node().getBoundingClientRect();
    // node() gives us the svg object
    this.innerWidth = this.dimensions.width - this.margins.left - this.margins.right;
    this.innerHeight = this.dimensions.height - this.margins.top - this.margins.bottom;
    // viewbox for "basic resizing" not great solutn. but good enough for now
    this.svg.attr('viewBox', [0, 0, this.dimensions.width, this.dimensions.height]);
  }

  setElements() {
    this.dataContainer = this.svg
      .append('g')
      .attr('class', 'dataContainer')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

    this.xAxisContainer = this.svg
      .append('g')
      .attr('class', 'xAxisContainer')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.bottom + this.innerHeight})`);
    
    this.yAxisContainer = this.svg
      .append('g')
      .attr('class', 'yAxisContainer')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

    this.xLabel = this.svg
      .append('g')
      .attr('class', 'xLabelContainer')
      .attr('transform', `translate(${this.margins.left + 0.5 * this.innerWidth}, ${this.dimensions.height - 5})`)
      .append('text')
      .attr('class', 'label')
      .style('text-anchor', 'middle');

    this.yLabel = this.svg
      .append('g')
      .attr('class', 'yLabelContainer')
      .attr('transform', `translate(15, ${this.margins.top + 0.5 * this.innerHeight})`)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle');

  }

  setParams() {
    const maxXValue = d3.max(this.data, (d) => +d[this.xValue]) || 1;
    const maxYValue = d3.max(this.data, (d) => +d[this.yValue]) || 1;
    
    this.x = d3.scaleLinear()
      .domain([0, maxXValue])
      .range([0, this.innerWidth])

    this.y = d3.scaleLinear()
      .domain([0, maxYValue])
      .range([this.innerHeight, 0])
  }
  setLabels() {
    this.xLabel.text(this.xValue);
    this.yLabel.text(this.yValue);
  }
  setAxis() {}
  draw() {}

}
