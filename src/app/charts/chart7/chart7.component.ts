import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { StackHelper } from '../../helpers/stack.helper';
import * as d3 from 'd3';
import { IGroupStackConfig } from '../../interfaces/chart.interfaces';
import ObjectHelper from '../../helpers/object.helper';
import { ChartDimensions } from '../../helpers/chart.dimentions.helper';


@Component({
  selector: 'app-chart7',
  standalone: true,
  imports: [],
  template: `<svg class="chart7"></svg>`
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
    this.svg = this.host.select('svg');

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
      .attr('transform', `translate(${this.dimensions.marginLeft - 30}, ${this.dimensions.marginTop})`)
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

  setXScale(): void {}

  setYScale(): void {}

  setGroupScale(): void {}

  setColorScale(): void {}



  setLabels(): void {}
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
