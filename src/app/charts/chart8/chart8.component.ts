import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-chart8',
  standalone: true,
  imports: [],
  template: `<svg class="chart8"></svg>`,
  styleUrl: './chart8.component.scss'
})
export class Chart8Component {

    host: any;
    svg: any;

    private _geodata: any;

    private _data: any;

    private _config: any;

    @Input() set geodata(values) {
      this._geodata = values;
    }

    @Input() set data(values) {
      this._data = values;
    }

    @Input() set config(values) {
      this._config = values;
    }

    constructor(element: ElementRef) {
      this.host = d3.select(element.nativeElement);
      console.log(this);
    }

    @Output() tooltip = new EventEmitter<any>();

    get geodata() {
      return this._geodata;
    }

    get data() {
      return this._data;
    }

    get config() {
      return this._config;
    }

    ngOnInit(): void{

    }

    setSvg() {
      this.svg = this.host.select('svg');
    }
}
