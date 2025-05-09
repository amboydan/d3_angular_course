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
    <g class="tooltipContainer">
      <rect class="svg-tooltip_background"></rect>
      <g class="svg-tooltip">
        <text class="svg-tooltip_title"></text>
        <text class="svg-tooltip_symbol"></text>
        <text class="svg-tooltip_value">
          <tspan class="svg-tooltip_value--key"></tspan>
          <tspan class="svg-tooltip_value--value"></tspan>
        </text>
      </g>
    </g>
    <style>
      .chart7 { font-size: 12px; }
      .chart7 text.title { font-weight: bold;}
      .chart7 rect { fill: unset; }
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
  data: [],
  stackOrder: []
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

stackedData: any;

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
    this.tooltipContainer = this.svg.select('g.tooltipContainer')
      .raise();
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

  setLegend(): void {
    const data = this.data.stackOrder;

    const width = 35;
    const height = 12;
    const fontSize = 10;

    const color = (elem) => this.scales.color(data.indexOf(elem));

    const generateLegendItem = (selection) => {
      selection.append('rect')
      .attr('class', 'legend-icon')
      .attr('width', width)
      .attr('height', height)
      .style('fill', (d) => color(d));

      selection.append('text')
        .attr('class', 'legend-label')
        .attr('x', 0.5 * width)
        .attr('y', height + fontSize + 5)
        .style('font-size', fontSize + 'px')
        .style('text-anchor', 'middle')
        .text((d) => d);
    }

    const updateLegendItem = (selection) => {
      selection.selectAll('rect.legend-icon')
      .style('fill', (d) => d.color);

      selection.append('text')
        .text((d) => d);
    }

    // set item containers
    this.legendContainer.selectAll('g.legend-item')
      .data(data, d => d)
      .join(
        enter => enter.append('g')
          .call(generateLegendItem),
        update => update
          .call(updateLegendItem)
      )
      .attr('class', 'legend-item')

    // reposition elements
    // a. reposition legend items
    let padding = 0;

    this.legendContainer.selectAll('g.legend-item')
      .each(function() {
        const g = d3.select(this);
        g.attr('transform', `translate(${padding}, 0)`);

        padding += g.node().getBBox().width; // if using strict mode need to use BBox
      })
    // b. reposition the legend (want in middle of chart)
    const legendWidth = this.legendContainer.node().getBBox().width;

    const axisHeight = this.xAxisContainer.node().getBBox().height;
    this.legendContainer  .attr('transform', `translate(${this.dimensions.midWidth - 0.5 * legendWidth}, ${this.dimensions.marginBottom + axisHeight + 10})`)
  }

  draw(): void {
    this.setStackedData();
    this.drawRectangles();
  }

  setStackedData(): void {
    const data = this.data.data;
    const groupedData = d3.groups(data, d => d.domain + '__' + d.group);
    
    const keys = this.data.stackOrder; //d3.groups(data, d => d.stack).map((d) => d[0]);
    console.log(groupedData, keys);
    const stack = d3.stack()
      .keys(keys)
      .value((element, key) => element[1].find(d => d.stack === key).value);

    this.stackedData = stack(groupedData);

    const aux = this.stackedData
      .flatMap((v) => v.map((elem) => {
        //console.log(v, elem);
        const data = elem.data[1].find((d) => d.stack === v.key);
        return {
          index: v.index,
          key: v.key,
          min: elem[0],
          max: elem[1],
          ...data
          }
        })
      );
      console.log(aux);
    }

  drawRectangles(): void {
    const data = this.stackedData;
    const colors = d3.schemeCategory10;

    this.dataContainer.selectAll('g.series')
    .data(data, d => d.key)
    .join('g')
    .attr('class', 'series')
    .style('fill', (d, i) => this.scales.color(i))
    .selectAll('rect.data')
    .data(d => d, d => d.data.year)
    .join('rect')
    .attr('class', 'data')
    .attr('x', d => {
      const [domain, group] = d.data[0].split('__');
      return this.scales.x(domain) + this.scales.group(group);
    })
    .attr('width', this.scales.group.bandwidth())
    .attr('y', (d) => this.scales.y(d[1]))
    .attr('height', (d) => Math.abs(this.scales.y(d[0]) - this.scales.y(d[1])))
    .attr('stroke', 'white')
    .on('mouseenter', this.tooltip);
  }

  updateChart() {
    this.setParams(); 
    this.setLabels();
    this.setAxis();
    this.setLegend(); 
    this.draw();
  }

  // tooltip
  tooltip(event: MouseEvent, d: any): void {
    console.log(arguments);
    // title 

    // set value 

    // set background

    // resize

    // set position

  }
  // highlight
  data1 = [
    {
        year: 2002,
        apples: 3840,
        bananas: 1920,
        cherries: 960,
        dates: 400,
    },
    {
        year: 2003,
        apples: 1600,
        bananas: 1440,
        cherries: 960,
        dates: 400,
    },
    {
        year: 2004,
        apples: 640,
        bananas: 960,
        cherries: 640,
        dates: 400,
    },
    {
        year: 2005,
        apples: 320,
        bananas: 480,
        cherries: 640,
        dates: 400,
    },
];
}
