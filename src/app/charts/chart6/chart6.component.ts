import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { IPieData } from '../../interfaces/chart.interfaces';

@Component({
  selector: 'app-chart6',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart6.component.html',
  styleUrl: './chart6.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class Chart6Component implements OnInit{

  host: any;

  @Input() data: IPieData;

  config: any;

  dimensions: DOMRect;

  innerWidth: number;
  innerHeight: number;
  radius: number;
  innerRadius = 0;

  margins: {
    top: 0, 
    right: 0,
    bottom: 0,
    left: 0
  };

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
    console.log(this);
  }

  ngOnInit(): void {
    
  }

}
