import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import { IPieConfig, IPieData } from '../../interfaces/chart.interfaces';
import { PieHelper } from '../../helpers/pie.helper';
import { startWith } from 'rxjs';
import ObjectHelper from '../../helpers/object.helper';

@Component({
  selector: 'app-chart6',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart6.component.html',
  styleUrl: './chart6.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class Chart6Component implements OnInit, OnChanges{

  host: any;
  svg: any;

  // containers
  dataContainer: any;
  legendContainer: any;

  title: any;

  // functions
  arc: any;
  pie: any;
  arcTween: any;

  // scales
  colors: any;

  // state
  hiddenIds = new Set(); // only need the id and don't need to store extra

  @Input() data: IPieData;

  @Input() set config(values){
    // if you only want to change certain values of the config file then below.  However, Object.assign only
    // creates a shallow copy of the object.  the embeded arc properties will not show up
    this._config = ObjectHelper.UpdateObjectWithPartialValues<IPieConfig>(this._defaultConfig, values);
  };

  get config() {
    return this._config || this._defaultConfig;
  };

  /**the config file gets turned into an @Input because we want the chart to be reusable.  If you duplicate the 
   * chart and leave this config variable and then change the variable all of the instances of the chart will change.
   */
  private _config: IPieConfig;
  private _defaultConfig: IPieConfig = {
    innerRadiusCoef: 0.6,
    hiddenOpacity: 0.3,
    legendItem: {
      symbolSize: 10,
      height: 20,
      fontSize: 12,
      textSeparator: 15
    },
    transition: 800,
    arcs: {
      stroke: '#fff',// white stroke
      strokeWidth: 2,
      radius: 6,
      padAngle: .015
    },
    margins: {
      left:10,
      top: 40,
      right: 50,
      bottom: 10
    }
  };

  dimensions: DOMRect;

  innerWidth: number;
  innerHeight: number;
  radius: number;
  innerRadius = 0;

  // take oportunity to use a "getter".  We have already defined our margins
  // in the config file.  Pull from there when margins is refered to.
  get margins() {
    return this.config.margins;
  }

  get ids() {
    return this.data.data.map((d) => d.id);
  }

  get pieData() {
    // only want the data if it belongs to not hidden.  doesn't belong to hidden id's set
    return this.pie(this.data.data.filter((elem) => !this.hiddenIds.has(elem.id)));
  }

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
    //console.log(this);
  }

  ngOnInit(): void {
    this.svg = this.host.select('svg');
    // remember to set dimensions first because set elements needs the dimentions
    this.setDimensions();
    this.setElements();
    this.updateChart();

    //console.log(this);
    //console.log(d3);
  }

  ngOnChanges (changes: SimpleChanges) {
    if (!this.svg) {return ;}
    this.updateChart();
  }

  setDimensions() {
    this.dimensions = this.svg.node().getBoundingClientRect();
    this.innerWidth = this.dimensions.width - this.margins.left - this.margins.right;
    this.innerHeight = this.dimensions.height - this.margins.top - this.margins.bottom;

    // have to calculate the inner radius 
    this.radius = 0.5 * Math.min(this.innerWidth, this.innerHeight);
    this.innerRadius = this.config.innerRadiusCoef * this.radius;

    this.svg.attr('viewBox', [0, 0, this.dimensions.width, this.dimensions.height]);
  }

  setElements() {
    // when building setElements you will need to set the data container,
    // legend container and the title (posibly more when you think of them)
    this.dataContainer = this.svg
      .append('g')
      .attr('class', 'dataContainer')
      .attr('transform', `translate(${this.margins.left + 0.5 * this.innerWidth}, ${this.margins.top + 0.5 * this.innerHeight})`);

    this.legendContainer = this.svg
      .append('g')
      .attr('class', 'legendContainer')
      .attr('transform', `translate(${this.innerWidth - 0.5 * this.margins.right}, ${this.margins.top + 0.5 * this.innerHeight})`);;

    this.title = this.svg
      .append('g')
      .attr('class', 'titleContainer')
      .append('text')
      .attr('class', 'title')
      .attr('transform', `translate(${0.5 * this.dimensions.width}, ${0.5 * this.margins.top})`)
      .style('text-anchor', 'middle');
  }

  setParams() {
    // set parameters for the pie chart will need an arc generator, pie generator, and a color scale
    // d3 pie generator is an intermediate step to d3 arc (pie => arc) to generate the angles
    // MAKE USE of the d3 library github.com/d3/d3-shape. Degrees are in RADIANS (2 PIE  = 360 deg).
    
    // arc generator
    this.arc = d3.arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.radius)
      .padAngle(this.config.arcs.padAngle)
      .cornerRadius(this.config.arcs.radius);
    
    // pie generator
    this.pie = d3.pie()
      .value((d: any) => d.value)
      .sort((a, b) => d3.ascending(a.id, b.id));

    // color scale
    this.colors = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(this.ids as any);

    const chart = this;

    this.arcTween = function(d: any) {
      //console.log(this);
      const current = d;
      const parent: any = this
      const previous = parent._previous; // if the previous state is available
      const interpolate = d3.interpolate(previous, current);
      this._previous = current;
      return function(t: number) {
        return chart.arc(interpolate(t));
      }
    }
  }

  setLabels() {
    this.title.text(this.data.title);
  }

  setLegend() {
    const data = this.data.data;

    // add legend item containers
    this.legendContainer.selectAll('g.legend-item')
      .data(data)
      .join('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * this.config.legendItem.height})`)
        // set as disabled if the id belongs to the hidden ids
        .style('opacity', (d) => this.hiddenIds.has(d.id) ? this.config.hiddenOpacity : null)
        .on('mouseenter', (event, d) => this.setHighlight(d.id))
        .on('mouseleave', (event, d) => this.resetHighlight())
        .on('click', (event, d) => this.toggleHighlight(d.id));

    // add symbols
    this.legendContainer.selectAll('g.legend-item')
      .selectAll('rect')
      .data((d) => [d]) // need to return as an array
      .join('rect')
        .attr('width', this.config.legendItem.symbolSize)
        .attr('height', this.config.legendItem.symbolSize)
        .style('fill', (d) => this.colors(d.id));
       
    // add labels
    this.legendContainer.selectAll('g.legend-item')
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .style('font-size', this.config.legendItem.fontSize + 'px')
      .attr('x', this.config.legendItem.textSeparator)
      .attr('y', this.config.legendItem.symbolSize)
      .text((d) => d.label);
      
    // reposition legend
    const dimensions = this.legendContainer.node().getBBox();

    this.legendContainer
      .attr('transform', `translate(${this.dimensions.width - this.margins.right}, ${this.margins.top + 0.5 * this.innerHeight - 0.5 * dimensions.height})`)
  }

  draw() {
    const chart = this;
    const data = this.pieData;

    const  previousData = this.dataContainer
      .selectAll('path.data')
      .data();

    const extendedPreviousData = PieHelper.ExtendPreviousDataWithEnter(previousData, data);
    const extendedCurrentData = PieHelper.ExtendCurrentDataWithExit(previousData, data);
    
    const enterArcTween = PieHelper.ArcTweenFactory(extendedPreviousData, true, this.arc);

    const exitArcTween = PieHelper.ArcTweenFactory(extendedCurrentData, false, this.arc);

    // Remember the update pattern: bind the data, enter / update, exit / remove
    // 1. Bind the data
    // const arcs = this.dataContainer
    //   .selectAll('path.data')
    //   // each arc is a path with class data and then we bind to the data
    //   .data(data);

    // example: the below is the equivalent of the 'merge' in the Enter / Update section
    // arcs.attr('d', this.arc)
    //  .style('fill', (d) => this.colors(d.data.id));

    // 2. Enter / Update: the below is the "FULL" update pattern. At bottom is the JOIN method
    // arcs.enter()
    //   .append('path')
    //   .attr('class', 'data')
    //   // when you change the data you want to add the new values and remove the old
    //   .merge(arcs)
    //   .attr('d', this.arc)
    //   .style('fill', (d) => this.colors(d.data.id));

    // // 3. Exit / Remove: remove all those arcs that are no longer present
    // arcs.exit().remove();

    // create a 'hook'
    // const chart = this;

    this.dataContainer  
      .selectAll('path.data')
      .data(data, d => d.data.id)
      .join(
        enter => enter.append('path'),
        update => update,
        exit => exit.transition()
          .duration(1000)
          .attrTween('d', exitArcTween)
          .remove()
        )
        // you must enter the path classes again or else additional paths will be added without
        // removeing the previous.  
        .attr('class', 'data')
        .style('fill', (d) => this.colors(d.data.id))
        .style('stroke', this.config.arcs.stroke)
        .style('stroke-width', this.config.arcs.strokeWidth)
        .on('mouseenter', (event, d) => this.setHighlight(d.data.id))
        .on('mouseleave', (event, d) => this.resetHighlight())
        // github.com/d3/d3-transition: understand the strange transition
        // we need to creat a custom interporlator because currently it is a string
        // For us, we need to interpolate the start and end angle (d3-interpolate). 
        .transition()
        .duration(1000)
        // no longer using this because have the interpolator actions
        // .attr('d', this.arc);
        .attrTween('d', enterArcTween);
  }

  setHighlight(id) {
    this.dataContainer.selectAll('path.data')
    .style('opacity', (d) => d.data.id == id ? null : this.config.hiddenOpacity);

    this.legendContainer.selectAll('g.legend-item')
      .style('opacity', (d) => d.id === id ? null : this.config.hiddenOpacity);
  }

  resetHighlight() {
    this.dataContainer.selectAll('path.data')
    .style('opacity', null);

    this.legendContainer.selectAll('g.legend-item')
      .style('opacity', null);
  }

  toggleHighlight(id: any): void {
    this.hiddenIds.has(id) ? this.hiddenIds.delete(id) : this.hiddenIds.add(id);
    this.updateChart();
  }

  updateChart() {
    this.setParams();
    this.setLabels();
    this.setLegend();
    this.draw();
  }

}
