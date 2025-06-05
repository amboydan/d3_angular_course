import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

import * as d3 from 'd3';
import { DimensionsService } from '../../services/dimensions.service';
import { IMapConfig, IMapData } from '../../interfaces/chart.interfaces';
import { ObjectHelper } from '../../helpers/object.helper';
import * as topojson from 'topojson';

@Component({
  selector: 'app-chart8',
  standalone: true,
  imports: [],
  template: `<svg class="chart8"></svg>`,
  styleUrl: './chart8.component.scss',
  providers: [DimensionsService]
})
export class Chart8Component implements OnInit {

    host: any;
    svg: any;

    containers: any = [];
    title: any;

    projection: any;
    path: any;
    features: any;

    private _geodata: any;

    private _data: IMapData;

    private _config: IMapConfig;

    private _defaultConfig: IMapConfig = {
      margins: {
        top: 0, 
        left: 0, 
        right: 0,
        bottom: 0
      }
    }

    @Input() set geodata(values) {
      this._geodata = values;
      if (!this.svg) { return; }; // if you don't have the svg then there is no chart to update
      this.updateChart();
    }

    @Input() set data(values) {
      this._data = values;
    }

    @Input() set config(values) {
      this._config = ObjectHelper.UpdateObjectWithPartialValues(this._defaultConfig, values);
    }

    @Output() tooltip = new EventEmitter<any>();

    get geodata() {
      return this._geodata;
    }

    get data() {
      return this._data;
    }

    get config() {
      return this._config || this._defaultConfig;
    }

    constructor(element: ElementRef, public dimensions: DimensionsService) {
      this.host = d3.select(element.nativeElement);
      console.log(this);
    }

    ngOnInit(): void{
      this.setSvg();
      this.setDimensions();
      this.setElements();
      if (!this.geodata) { return; }
      this.updateChart();
    }

    setSvg() {
      // remember that the attr xmlns allows for saving the chart as svg
      this.svg = this.host.select('svg').attr('xmlns', "http://www.w3.org/2000/svg");
    }

    setDimensions() {
      const dimensions = this.svg.node().getBoundingClientRect();
      this.dimensions.setDimensions(dimensions);
      this.dimensions.setMargins(this.config.margins);
    }

    setElements() {
      this.containers.countries = this.svg.append('g').attr('class', 'countries');
      // below line is for testing purposes. 'append' where draw only selects.  did this because
      // we were adding map on top of map
      //this.containers.countries.append('path').attr('class', 'countries');
      this.containers.data = this.svg.append('g').attr('class', 'data');
      this.containers.titleContainer = this.svg.append('g').attr('class', 'title');
      this.title = this.containers.titleContainer.append('text').attr('class', 'title');
      this.containers.legend = this.svg.append('g').attr('class', 'legend');
    }

    updateChart() {
      this.positionElements();
      this.setParams(); // runs the projections --> set path and set features
      this.setLabels();
      this.setLegend();
      this.draw();
    }

    positionElements() {
      this.containers.countries
        .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
      this.containers.data
        .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
      this.containers.titleContainer
        .attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginTop})`);
      this.containers.legend
        .attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginBottom})`);
    }

    setParams() {
      this.setProjection();
      this.setPath();
      this.setFeatures();
    }

    setProjection() {
      this.projection = d3.geoEquirectangular();
      // browser: store global: temp1.projection.<method>()
      // below is for testing 'what if?'
      //this.projection = d3.geoOrthographic()
      // .scale(100)
      // .translate([this.dimensions.midWidth, this.dimensions.midHeight])
      // .center([-10, 30])
      // .rotate([0, 0, 0]);
    }

    setPath() {
      this.path = d3.geoPath(this.projection);
    }

    setFeatures() {
      this.features = topojson.feature(this.geodata, this.geodata.objects['CNTR_RG_60M_2020_4326']);
    }

    setLabels() {}
    setLegend() {}
    draw() {
      this.containers.countries.append('path')
      // for testing map
      //this.containers.countries.select('path')
        .datum(this.features)
        .attr('d', this.path);
    }

    // creating auxil methods for purposes of testing
    // setScale(scale: number) {
    //   this.projection.scale(scale);
    //   this.setPath();
    //   this.draw();
    // }
    // // again test
    // setTranslate(x: number, y: number) {
    //   this.projection.translate([x, y]);
    //   this.setPath();
    //   this.draw();
    // }
    // setCenter(x: number, y: number) {
    //   this.projection.center([x, y]);
    //   this.setPath();
    //   this.draw();
    // }

    setExtent(width, height) {
      this.projection.fitSize([width, height], this.features);
      //this.setPath();
      //this.draw();
    }

    setWidth(width) {
      this.projection.fitWidth(width, this.features);
      this.setPath();
      this.draw();
    }

    setHeighth(height) {
      this.projection.fitHeight(height, this.features);
      this.setPath();
      this.draw();
    }
}
