import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, input, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

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

  @Input() data;

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
    console.log(this);
  }

  ngOnInit(): void {
    
  }

}
