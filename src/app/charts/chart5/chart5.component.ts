import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart5',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart5.component.html',
  styleUrl: './chart5.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class Chart5Component implements OnInit, OnChanges{
  // data import (here from html connection)
  @Input() data;

  // main elements
  host: any;
  svg: any;
  dataContainer: any;
  xAxisContainer: any;
  yAxisContainer: any;

   // dimentions
  dimensions: DOMRect;
  innerHeight: number;
  innerWidth: number;

  // margins
  margins = {
    left: 50,
    top: 20,
    right: 40,
    bottom: 80
  }

  // axis
  xAxis: any;
  yAxis: any;
  
  // scales
  x: any;
  y: any;
  colors: any;

  // selected data
  selected = ['hospitalized', 'death', 'hospitalizedCurrently'];
  // the active will define the true and false values associated with the active lines (above).
  // this is all driving towards a plot that has select features where you hover and select
  // those parts (lines, bubble, whatever) that are selectable in some shape or form
  active = [true, true, true]; // default state

  // getters
  get lineData() {
    // return !this.data ? [] : this.data.map((d) => {
    //   return {
    //     x: this.timeParse(d.date),
    //     y: d.hospitalized
    //   }
    // })
    //if (!this.data) {return []; };

    return this.selected
      // want to filter those elements that are "true" in the array
      .filter((d, i) => this.active[i])
      .map((item) => {
        return {
          name: item,
          data: this.data.map((d: any) => ({
            x: this.timeParse(d.date),
            y: d[item]
          }))
          .filter((d) => d.y != null)
          .sort((a: any, b: any) => a.x < b.x ? -1 : 1)
        }
      })
  }

  // chart labels
  textTitle: any;
  xLabel: any;
  yLabel: any;

  // legend and title
  legendContainer: any;
  title: any;

  // time formaters
  timeParse = d3.timeParse('%Y%m%d')
  niceData = d3.timeFormat('%Y-%B'); // 2021-March

  // line generator. define it here but define it after we have the 
  // scales set up in setParams
  line: any; 

  // try to keep all the methods in the same section
  // dimentions and elements get set once "in the lifecycle" of the chart
  // and the params, labels, axis, legend, and draw will take place within
  // the updateChart method

  // onInit
  setDimensions() {
    //getBoundingClientRect() returns value relative to the viewport
    //getBBox() allows us to determine the coordinates of the smallest
    // rectangle in which the object fits. We are not using the viewport to zoom in
    // on the svg.
    this.dimensions = this.svg.node().getBoundingClientRect();
    // node() gives us the svg object
    this.innerWidth = this.dimensions.width - this.margins.left - this.margins.right;
    this.innerHeight = this.dimensions.height - this.margins.top - this.margins.bottom;
    // viewbox for "basic resizing" not great solutn. but good enough for now
    this.svg.attr('viewBox', [0, 0, this.dimensions.width, this.dimensions.height]);
  }
  setElements() {
    // axis
    this.xAxisContainer = this.svg
      .append('g')
      .attr('class', 'xAxisContainer')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top + this.innerHeight})`);
    
    this.yAxisContainer = this.svg
      .append('g')
      .attr('class', 'yAxisContainer')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

    // axis labels
    this.title = this.svg
      .append('g')
      .attr('class', 'titleContainer')
      .attr('transform', `translate(${this.margins.left + 0.5 * this.innerWidth}, ${0.7 * this.margins.top})`)
      .append('text')
      .attr('class', 'title')
      .style('text-anchor', 'middle');

    // this.yLabel = this.svg
    //   .append('g')
    //   .attr('class', 'yLabelContainer')
    //   .attr('transform', `translate(15, ${this.margins.top + 0.5 * this.innerHeight})`)
    //   .append('text')
    //   .attr('class', 'label')
    //   .attr('transform', 'rotate(-90)')
    //   .style('text-anchor', 'middle');
    
      // where data goes
      this.dataContainer = this.svg
        .append('g')
        .attr('class', 'dataContainer')
        .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

      // legend and title
      this.legendContainer = this.svg
        .append('g')
        .attr('class', 'legendContainer')
        .attr('transform', `translate(${this.margins.left}, ${this.dimensions.height - 0.5 * this.margins.bottom + 10})`);
  }

  // within chart update
  setParams() {
    // bring in the line data that has been worked up
    const data = this.lineData;

    // temporary solution
    const parsedDates = !this.data ? [] : this.data.map((d) => this.timeParse(d.date));
    
    // domains
    // double exclamation marks converts to boolean
    const xDomain = !!parsedDates ? d3.extent(parsedDates) : [0, Date.now()];

    // the maxValues is going to get the max for each series (line) we identified above
    // map into the and then max for that series
    const maxValues = data.map((series) => d3.max(series.data, (d) => d.y))
    
    const yDomain = !this.data ? [0, 100] : [0, d3.max(maxValues)];
    const colorDomain = this.selected;

    // ranges
    const xRange = [0, this.innerWidth];
    const yRange = [this.innerHeight, 0];
    const colorRange = d3.schemeCategory10;

    // set scales
    this.x = d3.scaleTime()
      .domain(xDomain)
      .range(xRange);

    this.y = d3.scaleLinear()
      .domain(yDomain)
      .range(yRange);

    this.colors = d3.scaleOrdinal()
      .domain(colorDomain)
      .range(colorRange);

    // need to redefine the lines every time we change the scales
    this.line = d3.line()
      .x((d) => this.x(d.x))
      .y((d) => this.y(d.y));
  }
  setLabels() {
    this.title.text('Covid 19 Evolution in US');
  }
  setAxis() {
    this.xAxis = d3.axisBottom(this.x)
      .ticks(d3.timeMonth.every(2))
      .tickSizeOuter(0);

    this.yAxis = d3.axisLeft(this.y)
      .ticks(8)
      .tickSizeInner(-this.innerWidth)
      .tickSizeOuter(0)
      .tickFormat(
              d3.format("~s")
            );

    this.xAxisContainer
      .transition()
      .duration(500)
      .call(this.xAxis);

    this.yAxisContainer
      .transition()
      .duration(500)
      .call(this.yAxis);

    this.yAxisContainer
      .selectAll('.tick:not(:nth-child(2)) line')
      .style('stroke', '#999')
      .style('stroke-dasharray', '2 2')
  }

  // private toggleActive(selected: string): void {
  //   const index = this.selected.indexOf(selected);
  //   this.active[index] = !this.active[index];
  // }
  private toggleActive(selected: string): void {
    const index = this.selected.indexOf(selected);
    this.active[index] = !this.active[index];
}

  // hoverLine(selected?: string) {
  //   if (selected) {
  //     this.dataContainer.selectAll('path.data')
  //       .attr('opacity', (d) => d.name === selected ? 1 : 0.3)
  //       .style('stroke-width', (d) => d.name === selected ? '3px' : '2px');
  //       console.log(selected)
  //   } else {
  //     this.dataContainer.selectAll('path.data')
  //       .style('stroke-width', '2px')
  //       .attr('opacity', 1);
  //       console.log(selected)
  //   }
    
  // }

  private hoverLine(selected?: string): void {
    const index = selected ? this.selected.indexOf(selected) : -1;
    if (selected && this.active[index]) {
        this.dataContainer
            .selectAll('path.data')
            .attr('opacity', (d: any) => d.name === selected ? 1 : 0.3)
            .style('stroke-width', (d: any) => d.name === selected ? '3px' : '2px');
    } else {
        this.dataContainer
            .selectAll('path.data')
            .style('stroke-width', '2px')
            .attr('opacity', null);
    }
}

  // setLegend() {
  //   // specific methods
  //   const generateLegendItems = (selection: any) => {
  //     selection.append('circle')
  //         .attr('class', 'legend-icon')
  //         .attr('cx', 3)
  //         .attr('cy', -4)
  //         .attr('r', 3);

  //     selection.append('text')
  //         .attr('class', 'legend-label')
  //         .attr('x', 9)
  //         .style('font-size', '0.8rem');
  //   }

  //   const updateLegendItems = (selection: any) => {
  //     selection
  //       .selectAll('circle.legend-icon')
  //       .style('fill', (d) => this.colors(d));

  //     selection
  //       .selectAll('text.legend-label')
  //       .text((d) => d);
  //   }

  //   // 1. select item containers and bind data
  //   const itemContainers = this.legendContainer
  //     .selectAll('g.legend-item')
  //     .data(this.selected);

  //   // 2. enter:
  //   //  a. add new containers
  //   //  b. add circle + text
  //   itemContainers
  //     .enter()
  //     .append('g')
  //       .attr('class', 'legend-item')
  //       .call(generateLegendItems)
  //     .merge(itemContainers)
  //       .call(updateLegendItems)
  //       .on('mouseover', (event, name: string) => this.hoverLine(name))
  //       .on('mouseleave', (event, name: string) => this.hoverLine(name))
  //       .on('click', (event: PointerEvent, name: string) => {
  //         this.toggleActive(name);
  //         this.updateChart();
  //       });
    
  //   //  3b. bind events (click + hover)
    
    
  //   // 5. remove groups not needed
  //   itemContainers
  //     .exit()
  //     .remove();

  //   // 6. Repositioning items
  //   //"remember if i want to catch the latest version of the selction I need to select them again"
  //   let totalPadding = 0;
  //   this.legendContainer.selectAll('g.legend-item')
  //     .each(function() {
  //       const g = d3.select(this);
  //       g.attr('transform', `translate(${totalPadding}, 0)`);
  //       totalPadding += g.node().getBBox().width + 10;
  //     });

  //   // 7. Repositioning legend
  //   const legendWidth = this.legendContainer.node().getBBox().width;

  //   this.legendContainer
  //     .attr('transform', `translate(${this.margins.left + 0.5 * (this.innerWidth - legendWidth)}, ${this.dimensions.height - 0.5 * this.margins.bottom + 10})`);
  // }

  private setLegend(): void {
    // Methods
    const generateLegendItems = (selection: any) => {
        selection
            .append('circle')
            .attr('class', 'legend-icon')
            .attr('cx', 3)
            .attr('cy', -4)
            .attr('r', 3);

        selection
            .append('text')
            .attr('class', 'legend-label')
            .attr('x', 9)
            .style('font-size', '0.8rem');
    };

    const updateLegendItems = (selection: any) => {
        selection
            .selectAll('circle.legend-icon')
            .style('fill', (d: any) => this.colors(d));
            selection
            .selectAll('text.legend-label')
            .text((d: any) => d);
    };

    // 1 - Select item containers and bind data
    const itemContainers = this.legendContainer.selectAll('g.legend-item').data(this.selected);

    // 2 - Enter:
    //      a: Add new containers
    //      b: Add circle & text
    //      c: Bind events (click and hover)
    //      d: Transition
    //      e: Set opacity (if active => 1 else 0.3)
    itemContainers.enter()
        .append('g')
        .attr('class', 'legend-item')
        .call(generateLegendItems)
        .merge(itemContainers)
        .call(updateLegendItems)
        .on('mouseover', (event: PointerEvent, name: string) => this.hoverLine(name))
        .on('mouseleave', () => this.hoverLine())
        .on('click', (event: PointerEvent, name: string) => {
            this.toggleActive(name);
            this.hoverLine();
            this.updateChart();
        })
        .transition()
        .duration(500)
        .style('opacity', (d: any, i: number) => this.active[i] ? 1 : 0.3);

    // 3 - Remove unneeded groups
    itemContainers.exit().remove();

    // 4 - Repositioning Items
    let totalPadding = 0;
    this.legendContainer
        .selectAll('g.legend-item')
        .each((data: any, index: number, groups: any) => {
            const g = d3.select(groups[index]);
            g.attr('transform', `translate(${totalPadding}, 0)`);
            totalPadding += g.node().getBBox().width + 10;
        });

    // 5 - Repositioning Legend
    const legendWidth = this.legendContainer.node().getBBox().width;
    const x = this.margins.left + 0.5 * (this.innerWidth - legendWidth);
    const y = this.dimensions.height - 0.5 * this.margins.bottom + 10;
    this.legendContainer.attr('transform', `translate(${x}, ${y})`);
}

  draw() {
    // binding the data
    // remember that you do not want a 'line', you want a ===> path
    const lines = this.dataContainer
      .selectAll('path.data')
      .data(this.lineData);

    // enter and merge
    lines
      .enter()
      .append('path')
      // it is important to add the class data here because the next time we draw we will need to selec 
      // all those classes.  d3 will continuously generate if we do not redraw with classes
      .attr('class', 'data')
      .style('fill', 'none')
      
      .style('stroke-width', '2')
      .merge(lines)
      // 'd' has a name and data
      .attr('d', (d) => this.line(d.data))
      .style('stroke', (d)  => this.colors(d.name))
    
      // exit
      lines
        .exit()
        .remove();
  }

//   private draw(): void {
//     // Bind data
//     const lines = this.dataContainer
//         .selectAll('path.data')
//         .data(this.lineData, (d: any) => d.name);

//     // Enter and merge
//     lines.enter()
//         .append('path')
//         .attr('class', 'data')
//         .style('fill', 'none')
//         .style('stroke-width', '2px')
//         .merge(lines)
//         .transition()
//         .duration(500)
//         .attr('d', (d: any) => this.line(d.data))
//         .style('stroke', (d: any) => this.colors(d.name));

//     // Exit
//     lines.exit().remove();
// }

  updateChart(): void {
    if(this.data) {
      this.setParams();
      this.setLabels();
      this.setAxis();
      this.setLegend();
      this.draw();
    }
   }
  

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
  }
  
  ngOnInit(): void {
    this.svg = this.host.select('svg');
    this.setDimensions();
    this.setElements();
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.svg) {return;}
    this.updateChart();
  }
}
