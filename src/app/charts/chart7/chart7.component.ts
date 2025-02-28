import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-chart7',
  standalone: true,
  imports: [],
  template: `<svg class="chart7"></svg>`
})

export class Chart7Component implements OnInit, OnChanges{

  @Input() data;

  @Input() config;

  constructor() {}

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

}
