import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { StackHelper } from '../../helpers/stack.helper';
import * as d3 from 'd3';
import { IGroupStackConfig } from '../../interfaces/chart.interfaces';
import ObjectHelper from '../../helpers/object.helper';
import { ChartDimensions } from '../../helpers/chart.dimentions.helper';
import { MinValidator } from '@angular/forms';


@Component({
  selector: 'app-chart7',
  standalone: true,
  imports: [],
  template: `<svg class="chart7">
    <style>
      .chart { font-size: 12px; }
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

  @Input() data;

  @Input() set config(values) {
    this._config = ObjectHelper.UpdateObjectWithPartialValues(this._defaultConfig, values);
  };

  get config(): IGroupStackConfig {
    if (!this._config) {
        this.config = this._defaultConfig;
    }
    
    return this._config;
  }
  
  private _config: IGroupStackConfig = null as any;

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
      // if you go to the en.wikipedia.org/wiki/Scalable_Vector_Graphics
      // standard you find that the below attribute must be present for 
      // the browser to recognize it as an svg.  this addition makes 
      // copying the svg html in 'inspect' usable in other places
      .attr('xmlns', 'http://www.w3.org/000/svg');

    this.setDimensions();
    this.setElements();
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.svg) { return; }

    this.updateChart();
  }

  setDimensions(): void{
    // on every new chart this is the command that we need to define.
    this.dimensions = new ChartDimensions(this.svg.node().getBoundingClientRect(), this.config.margins)
  }
  setElements(): void {
    this.xAxisContainer = this.svg.append('g')
      .attr('class', 'xAxisContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginBottom})`)
    
    this.yAxisContainer = this.svg.append('g')
      .attr('class', 'yAxisContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`)

    this.dataContainer = this.svg.append('g')
      .attr('class', 'dataContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`)

    this.legendContainer = this.svg.append('g')
      .attr('class', 'legendContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginBottom + 30})`)

    this.title = this.svg.append('g')
      .attr('class', 'titleContainer')
      .attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginTop})`)
      .append('text')
      .attr('class', 'title')
      .style('text-anchor', 'middle');

    this.yLabel = this.svg.append('g')
      .attr('class', 'yLabelContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft - 30}, ${this.dimensions.midHeight})`)
      .append('text')
      .attr('class', 'yLabel')
      .style('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)');

    // tooltip

  }

  setParams(): void {
    // xScale
    this.setXScale();
    // yScale
    this.setYScale();
    // groupscale
    this.setGroupScale();
    //colorscale
    this.setColorScale();
  }

  setXScale(): void {
    const data = (this.data?.data || []);
    // group ids
    // first time we ran this we had an error because the data was not ready yet
    // need to make sure the data exists before running
    // quick fix is "if no data then return empty array". data? means this argument optional
    //this.data?.data || []
    const domain = Array.from(new Set(data.map((d) => d.domain))).sort(d3.ascending);
    const range = [0, this.dimensions.innerWidth];

    this.scales.x = d3.scaleBand()
      .domain(domain)
      .range(range)

  }

  setYScale(): void {
    const data = (this.data?.data || []);
    const minVal = Math.min(0, d3.min(data, d => d.value));
    // need to have the data grouped by domain and group and for each one of the 
    // groups need to calculate the sum of the values inside
    // const maxVal = d3.flatRollup(data, v => d3.sum(v, d => d.value), d => d.domain, d => d.group);
    // the above gives the max of each column but we are setting the scales and need the max
    // of all the groups (year/gender)
    const maxVal = d3.max(d3.flatRollup(data, v => d3.sum(v, d => d.value), d => d.domain, d => d.group), d => d[2]);
    // console.log(maxVal);
    
    const domain = [minVal, maxVal];
    const range = [this.dimensions.innerHeight, 0];

    this.scales.y = d3.scaleLinear().domain(domain).range(range);
  }

  setGroupScale(): void {
    const data = (this.data?.data || []);

    const domain = Array.from(new Set(data.map((d) => d.group))).sort(d3.ascending);
    const range = [0, this.scales.x.bandwidth()];

    this.scales.group = d3.scaleBand().domain(domain).range(range);
  }

  setColorScale(): void {
    const data = (this.data?.data || []);
    const stacks = Array.from(new Set(data.map((d) => d.stack)));
    const domain = [stacks.length - 1, 0];
    // on github d3-scale-chromatic are designed to work with scaleOrdinal and discrete
    // diverging scales have two diff flavors. interpolate (almost infin # of colors)
    // interpolateSpectral... need to know how many diff cats you have.  to use this you 
    // have to have d3.scaleSequential
    this.scales.color = d3.scaleSequential(d3.interpolateSpectral).domain(domain);
      // domain will be determined based on the stacks

  }



  setLabels(): void {
    this.title.text(this.data?.title);
    this.yLabel.text(this.data?.yLabel);
  }
  setAxis(): void {}
  setLegend(): void {}
  draw(): void {}

  updateChart(): void {
    this.setParams()
    this.setLabels()
    this.setAxis()
    this.setLegend()
    this.draw()
  }

  // tooltip

  // highlight

}
