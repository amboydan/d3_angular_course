import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart5',
  standalone: true,
  imports: [],
  templateUrl: './chart5.component.html',
  styleUrl: './chart5.component.scss'
})
export class Chart5Component implements OnInit{

  @Input() data;

  ngOnInit(): void {
    
  }
}
