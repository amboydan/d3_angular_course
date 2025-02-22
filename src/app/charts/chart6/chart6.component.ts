import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import { IPieConfig, IPieData } from '../../interfaces/chart.interfaces';

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
  dataContainer: any;
  legendContainer: any;
  title: any;

  arc: any;
  pie: any;
  colors: any;
  arcTween: any;

  @Input() data: IPieData;

  config: IPieConfig = {
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
      padAngle: 0
    },
    margins: {
      left:10,
      top: 40,
      right: 130,
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
    return this.pie(this.data.data)
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

    console.log(this);
    console.log(d3);
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
    
    // pie generator
    this.pie = d3.pie()
      .value((d) => d.value)

    // color scale
    this.colors = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(this.ids)

    const chart = this;

    this.arcTween = function(d) {
      console.log(this);
      const current = d;
      const previous = this._previous; // if the previous state is available
      const interpolate = d3.interpolate(previous, current);
      this._previous = current;
      return function(t) {
        return chart.arc(interpolate(t));
      }
    }
  }

  setLabels() {
    this.title.text(this.data.title);
  }

  setLegend() {}

  draw() {
    const data = this.pieData;
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
      .join('path')
        // you must enter the path classes again or else additional paths will be added without
        // removeing the previous.  
        .attr('class', 'data')
        .style('fill', (d) => this.colors(d.data.id))
        // github.com/d3/d3-transition: understand the strange transition
        // we need to creat a custom interporlator because currently it is a string
        // For us, we need to interpolate the start and end angle (d3-interpolate). 
        .transition()
        .duration(1000)
        // no longer using this because have the interpolator actions
        // .attr('d', this.arc);
        .attrTween('d', this.arcTween);
  }

  highlight() {}

  updateChart() {
    this.setParams();
    this.setLabels();
    this.setLegend();
    this.draw();
  }

}
