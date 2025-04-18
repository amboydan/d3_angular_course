import { Component, ElementRef, input, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { StackHelper } from '../../helpers/stack.helper';
import * as d3 from 'd3';
import { IGroupStackConfig, IGroupStackData } from '../../interfaces/chart.interfaces';
import ObjectHelper from '../../helpers/object.helper';
import { ChartDimensions } from '../../helpers/chart.dimentions.helper';
import { MinValidator } from '@angular/forms';


@Component({
  selector: 'app-chart7',
  standalone: true,
  imports: [],
  template: `<svg class="chart7">
    <style>
      .chart7 { font-size: 12px; }
      .chart7 text.title { font-weight: bold;}
    </style>
  </svg>`
})

export class Chart7Component implements OnInit, OnChanges{

  host: any;
  svg: any;

  dimensions: ChartDimensions;

  // axis
  xAxis: any;
  yAxis: any;

  // containers
  xAxisContainer: any;
  yAxisContainer: any;
  dataContainer: any;
  legendContainer: any;
  tooltipContainer: any;

  // labels
  title: any;
  yLabel: any;

  // scales
  scales: any = {};

 private _defaultData: IGroupStackData = {
  title: '',
  yLabel: '',
  unit: '',
  data: []
 } 

 private _data: IGroupStackData;

@Input() set data(values) {
  this._data = ObjectHelper.UpdateObjectWithPartialValues(this._defaultData, values);
};

get data() {
  if (!this._data) { this._data = this._defaultData; }
  
  return this._data;
}

@Input() set config(values) {
  this._config = ObjectHelper.UpdateObjectWithPartialValues(this._defaultConfig, values);
}

get config() {
  if (!this._config) {
    this.config = this._defaultConfig;
  }

  return this._config;
}

private _config: IGroupStackConfig;
  
private _defaultConfig: IGroupStackConfig = {
      hiddenOpacity: 0.3,
      transition: 300,
      margins: {
        top: 40,
        right: 20,
        bottom: 60,
        left: 50
      }
}

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
    console.log(this);
  }

  ngOnInit(): void {
    this.svg = this.host.select('svg')
      .attr('xmlns', "http://www.w3.org/2000/svg");

    this.setDimensions();
    this.setElements();
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.svg) { return; }

    this.updateChart();
  }

  setDimensions(): void {
    this.dimensions = new ChartDimensions(this.svg.node().getBoundingClientRect(), this.config.margins);
  }

  setElements(): void {
    this.xAxisContainer = this.svg.append('g').attr('class', 'xAxisContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginBottom})`);

    this.yAxisContainer = this.svg.append('g').attr('class', 'yAxisContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);

    this.dataContainer = this.svg.append('g').attr('class', 'dataContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);

    this.legendContainer = this.svg.append('g').attr('class', 'legendContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginBottom + 30})`);

    this.title = this.svg.append('g').attr('class', 'titleContainer')
      .attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginTop})`)
      .append('text').attr('class', 'title')
      .style('text-anchor', 'middle');

    this.yLabel = this.svg.append('g').attr('class', 'yLabelContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft - 30}, ${this.dimensions.midHeight})`)
      .append('text').attr('class', 'yLabel')
      .style('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)');

    //tooltip

  }

  setParams(): void {
    // xScale
    this.setXScale();
    // yScale
    this.setYScale();
    // groupScale
    this.setGroupScale();
    // colorScale
    this.setColorScale();
  }

  setXScale(): void {
    const data = this.data.data;
    
    const domain = Array.from(new Set(data.map((d) => d.domain ))).sort(d3.ascending);
    const range = [0, this.dimensions.innerWidth];

    this.scales.x = d3.scaleBand().domain(domain).range(range);
  }

  setYScale(): void {
    const data = this.data.data;

    const minVal = Math.min(0, d3.min(data, d => d.value));
    const maxVal = d3.max(d3.flatRollup(data, v => d3.sum(v, d => d.value), d => d.domain, d => d.group), d => d[2]);
    
    const domain = [minVal, maxVal];
    const range = [this.dimensions.innerHeight, 0];

    this.scales.y = d3.scaleLinear().domain(domain).range(range);
  }

  setGroupScale(): void {
    const data = this.data.data;

    const domain = Array.from(new Set(data.map((d) => d.group))).sort(d3.ascending);
    const range = [0, this.scales.x.bandwidth()];
    
    this.scales.group = d3.scaleBand().domain(domain).range(range);
  }

  setColorScale(): void {
    const data = this.data.data;
    const stacks = Array.from(new Set(data.map((d) => d.stack)));
    const domain = [stacks.length, 0]; // stacks index

    this.scales.color = d3.scaleSequential(d3.interpolateSpectral).domain(domain);
  }

  setLabels(): void {
    this.title.text(this.data?.title);
    this.yLabel.text(this.data?.yLabel);
  }

  setAxis(): void {
    this.setXAxis();
    this.setYAxis();    
  }

  setXAxis(): void {
    this.xAxis = d3.axisBottom(this.scales.x)
      .tickSizeOuter(0);
    this.xAxisContainer.call(this.xAxis);
  }

  setYAxis(): void {
    this.yAxis = d3.axisLeft(this.scales.y)
      .ticks(5)
      .tickSizeOuter(0)
      .tickSizeInner(-this.dimensions.innerWidth);
    
    this.yAxisContainer.call(this.yAxis);

    this.yAxisContainer.selectAll('.tick line')
      .style('opacity', 0.3)
      .style('stroke-dasharray', '3 3');
  }

  setLegend(): void {}
  draw(): void {}

  updateChart() {
    this.setParams(); 
    this.setLabels();
    this.setAxis();
    this.setLegend(); 
    this.draw();
  }

  // tooltip

  // highlight

}
