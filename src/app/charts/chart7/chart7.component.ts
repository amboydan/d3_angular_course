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
      .chart { font-size: 12px; }
      .chart7 text.title { font-weight: bold;}
    </style>
  </svg>`
})

export class Chart7Component implements OnInit, OnChanges{

  host: any;
  svg: any;

@Input() data;
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
    this.svg = this.host.select('svg');

    this.setDimensions();
    this.setElements();
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.svg) { return; }

    this.updateChart();
  }

  setDimensions(): void {}
  setElements(): void {}
  setParams(): void {}
  setLabels(): void {}
  setAxis(): void {}
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
