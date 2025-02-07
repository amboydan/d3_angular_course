import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart5',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart5.component.html',
  styleUrl: './chart5.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class Chart5Component implements OnInit, OnChanges{
  // data import (here from html connection)
  @Input() data;

  // main elements
  host: any;
  svg: any;
  dataContainer: any;
  xAxisContainer: any;
  yAxisContainer: any;

   // dimentions
  dimensions: DOMRect;
  innerHeight: number;
  innerWidth: number;

  // margins
  margins = {
    left: 50,
    top: 20,
    right: 40,
    bottom: 80
  }

  // axis
  xAxis: any;
  yAxis: any;
  
  // scales
  x: any;
  y: any;
  colors: any;

  // chart labels
  textTitle: any;
  xLabel: any;
  yLabel: any;

  // legend and title
  legendContainer: any;
  title: any;

  // time formaters
  timeParse = d3.timeParse('%Y%m%d')
  niceData = d3.timeFormat('%Y-%B'); // 2021-March

  // try to keep all the methods in the same section
  // dimentions and elements get set once "in the lifecycle" of the chart
  // and the params, labels, axis, legend, and draw will take place within
  // the updateChart method

  // onInit
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
    // axis
    this.xAxisContainer = this.svg
      .append('g')
      .attr('class', 'xAxisContainer')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top + this.innerHeight})`);
    
    this.yAxisContainer = this.svg
      .append('g')
      .attr('class', 'yAxisContainer')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

    // axis labels
    this.title = this.svg
      .append('g')
      .attr('class', 'titleContainer')
      .attr('transform', `translate(${this.margins.left + 0.5 * this.innerWidth}, ${0.5 * this.margins.top})`)
      .append('text')
      .attr('class', 'title')
      .style('text-anchor', 'middle');

    // this.yLabel = this.svg
    //   .append('g')
    //   .attr('class', 'yLabelContainer')
    //   .attr('transform', `translate(15, ${this.margins.top + 0.5 * this.innerHeight})`)
    //   .append('text')
    //   .attr('class', 'label')
    //   .attr('transform', 'rotate(-90)')
    //   .style('text-anchor', 'middle');
    
      // where data goes
      this.dataContainer = this.svg
        .append('g')
        .attr('class', 'dataContainer')
        .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

      // legend and title
      this.legendContainer = this.svg
        .append('g')
        .attr('class', 'legendContainer')
        .attr('transform', `translate(${this.margins.left}, ${this.dimensions.height - 0.5 * this.margins.bottom + 10})`);
  }

  // within chart update
  setParams() {
    // domains

    // ranges

    // set scales
  }
  setLabels() {

  }
  setAxis() {
    // this.xAxis = d3.axisBottom(this.x)
    //   .tickSizeOuter(0);

    // this.yAxis = d3.axisLeft(this.y)
    //   .ticks(5)
    //   .tickSizeInner(-this.innerWidth)
    //   .tickSizeOuter(0);

    // this.xAxisContainer
    //   .transition()
    //   .duration(500)
    //   .call(this.xAxis);

    // this.yAxisContainer
    //   .transition()
    //   .duration(500)
    //   .call(this.yAxis);

    // this.yAxisContainer
    //   .selectAll('.tick:not(:nth-child(2)) line')
    //   .style('stroke', '#ddd')
    //   .style('stroke-dasharray', '2 2')
  }

  setLegend() {

  }

  draw() {

  }

  updateChart() {
    this.setParams();
    this.setLabels();
    this.setAxis();
    this.setLegend();
    this.draw();
   }

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
  }
  
  ngOnInit(): void {
    this.svg = this.host.select('svg');
    this.setDimensions();
    this.setElements();
    this.updateChart();
    console.log(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.svg) {return;}
    this.updateChart();
  }
}
