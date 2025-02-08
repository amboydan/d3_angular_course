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

  // selected data
  selected = ['hospitalized', 'death', 'hospitalizedCurrently'];

  // getters
  get lineData() {
    // return !this.data ? [] : this.data.map((d) => {
    //   return {
    //     x: this.timeParse(d.date),
    //     y: d.hospitalized
    //   }
    // })
    if (!this.data) {return []; };

    return this.selected.map((item) => {
      return {
        name: item,
        data: this.data.map((d) => ({
          x: this.timeParse(d.date),
          y: d[item]
        }))
        .filter((d) => d.y != null)
        .sort((a, b) => a.x < b.x ? -1 : 1)
      }
    })
  }

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

  // line generator. define it here but define it after we have the 
  // scales set up in setParams
  line: any; 

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
    // bring in the line data that has been worked up
    const data = this.lineData;

    // temporary solution
    const parsedDates = !this.data ? [] : this.data.map((d) => this.timeParse(d.date));
    
    // domains
    // double exclamation marks converts to boolean
    const xDomain = !!parsedDates ? d3.extent(parsedDates) : [0, Date.now()];

    // the maxValues is going to get the max for each series (line) we identified above
    // map into the and then max for that series
    const maxValues = data.map((series) => d3.max(series.data, (d) => d.y))
    
    const yDomain = !this.data ? [0, 100] : [0, d3.max(maxValues)];
    const colorDomain = this.selected;

    // ranges
    const xRange = [0, this.innerWidth];
    const yRange = [this.innerHeight, 0];
    const colorRange = d3.schemeCategory10;

    // set scales
    this.x = d3.scaleTime()
      .domain(xDomain)
      .range(xRange);

    this.y = d3.scaleLinear()
      .domain(yDomain)
      .range(yRange);

    this.colors = d3.scaleOrdinal()
      .domain(colorDomain)
      .range(colorRange);

    // need to redefine the lines every time we change the scales
    this.line = d3.line()
      .x((d) => this.x(d.x))
      .y((d) => this.y(d.y));
  }
  setLabels() {

  }
  setAxis() {
    this.xAxis = d3.axisBottom(this.x)
      .ticks(d3.timeMonth.every(2))
      .tickSizeOuter(0);

    this.yAxis = d3.axisLeft(this.y)
      .ticks(8)
      .tickSizeInner(-this.innerWidth)
      .tickSizeOuter(0)
      .tickFormat(
              d3.format("~s")
            );

    this.xAxisContainer
      .transition()
      .duration(500)
      .call(this.xAxis);

    this.yAxisContainer
      .transition()
      .duration(500)
      .call(this.yAxis);

    this.yAxisContainer
      .selectAll('.tick:not(:nth-child(2)) line')
      .style('stroke', '#999')
      .style('stroke-dasharray', '2 2')
  }

  setLegend() {

  }

  draw() {
    // binding the data
    // remember that you do not want a 'line', you want a ===> path
    const lines = this.dataContainer.selectAll('path .data')
      .data(this.lineData);

    // enter and merge
    lines
      .enter()
      .append('path')
      // it is important to add the class data here because the next time we draw we will need to selec 
      // all those classes.  d3 will continuously generate if we do not redraw with classes
      .attr('class', 'data')
      .style('fill', 'none')
      .style('stroke', (d)  => this.colors(d.name))
      .style('stroke-width', '2')
      .merge(lines)
      // 'd' has a name and data
      .attr('d', (d) => this.line(d.data));
    
    // exit
    lines
      .exit()
      .remove();
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
