import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
//import { elementAt } from 'rxjs';

@Component({
  selector: 'app-chart4',
  standalone: true,
  //imports CommonModule is necessary for 
  imports: [CommonModule],
  templateUrl: './chart4.component.html',
  styleUrl: './chart4.component.scss',
  encapsulation: ViewEncapsulation.None
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

  rectWidth = 20;
  padding = 5;

  // dimentions
  dimensions: DOMRect;
  innerHeight: number;
  innerWidth: number;

  // axis
  xAxis: any;
  yAxis: any;
  
  margins = {
    left: 40,
    top: 20,
    right: 30,
    bottom: 40
  }

  // user options
  xValue: string;
  yValue: string;

  // scales
  x: any;
  y: any;
  colors: any;

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
        y: +elem[this.yValue],
        species: elem.Species
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
    this.xAxisContainer = this.svg
      .append('g')
      .attr('class', 'xAxisContainer')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top + this.innerHeight})`);
    
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

      this.dataContainer = this.svg
        .append('g')
        .attr('class', 'dataContainer')
        .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);
  }

  setParams() {
    const maxXValue = this.xValue ? d3.max(this.data, (d) => +d[this.xValue]) : 1;
    const maxYValue = this.yValue ? d3.max(this.data, (d) => +d[this.yValue]) : 1;
    const uniqueSpecies = new Set((this.data || []).map((d) => d.Species));

    this.x = d3.scaleLinear()
      .domain([0, maxXValue])
      .range([0, this.innerWidth])

    this.y = d3.scaleLinear()
      .domain([0, maxYValue])
      .range([this.innerHeight, 0])

    this.colors = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(uniqueSpecies);
  }

  setLabels() {
    this.xLabel.text(this.xValue);
    this.yLabel.text(this.yValue);
  }

  setAxis() {
    this.xAxis = d3.axisBottom(this.x)
      .tickSizeOuter(0);
    this.yAxis = d3.axisLeft(this.y)
      .ticks(5)
      .tickSizeInner(-this.innerWidth)
      .tickSizeOuter(0);

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
      .style('stroke', '#ddd')
      .style('stroke-dasharray', '2 2')
  }

  draw() {
    // bind the data
    const scatter = this.dataContainer
      .selectAll('circle.data')
      .data(this.scatterData);

    // enter and merge
    scatter.enter()
      .append('circle')
      .attr('class', 'data')
      .attr('r', 4)
      .style('fill', (d) => this.colors(d.species))
      .style('stroke', 'black')
      .style('stroke-width', 1)
      .style('opacity', 0.4)
      .merge(scatter)
      .attr('cx', (d) => this.x(+d.x))
      .attr('cy', (d) => this.y(+d.y));

    // exit
    scatter
      .exit()
      .remove();
  }

}
