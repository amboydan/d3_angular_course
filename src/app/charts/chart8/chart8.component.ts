import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

import * as d3 from 'd3';
import { DimensionsService } from '../../services/dimensions.service';
import { IMapConfig, IMapData } from '../../interfaces/chart.interfaces';
import { ObjectHelper } from '../../helpers/object.helper';

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
}
