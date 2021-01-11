import * as d3 from 'd3';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { PieChartDataPoint } from '../models/pie-chart-data-point';

/*
See https://www.d3-graph-gallery.com/graph/donut_label.html
*/

@Component({
  selector: 'app-pie-chart2',
  templateUrl: './pie-chart2.component.html',
  styleUrls: ['./pie-chart2.component.scss']
})
export class PieChart2Component implements OnInit {
  @Input() data: PieChartDataPoint[];
  @Input() width: number = 800;
  @Input() height: number = 800;
  @Input() margin: number = 200;
  @Input() chartTitle: string;
  @Input() showImage: boolean = false;

  constructor(private container: ElementRef) { }

  ngOnInit(): void {
    if (this.data) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    d3.select(this.container.nativeElement).select('.chart').select('svg').remove();

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    let radius = Math.min(this.width, this.height) / 2 - this.margin;
    let innerRadius = radius * 0.5;

    let svg = d3.select(this.container.nativeElement).select('.chart')
      .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
      .append("g")
        .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

    // set the color scale
    let labelArray: string[] = this.data.map(x => x.label);
    let color = d3.scaleOrdinal()
      .domain(labelArray)
      .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    let pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(function(d) {return d.value; })
    let data_ready = pie(this.data)

    // The arc generator
    let arc = d3.arc()
      .innerRadius(innerRadius)         // This is the size of the donut hole
      .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    let outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Build the title text in the donut centre
    if (!this.showImage) {
      d3.select(this.container.nativeElement).select('.chart').select('svg').select('g').select('text').remove();

      d3.select(this.container.nativeElement).select('.chart').select('svg').select('g')
        .append('text')
        .text((x) => {
          const maxLength = 21;
          const title = this.chartTitle.length < maxLength ? this.chartTitle : this.chartTitle.substring(0, maxLength) + "...";
          return title;
        })
        .style("text-anchor", "middle")
        .style('font-family', 'verdana')
        .style('font-size', '1.1rem')
        .append("title")          // add the tooltip text
        .text(this.chartTitle);
    } else {
      d3.select(this.container.nativeElement).select('.chart').select('svg').select('g').select('image').remove();

      d3.select(this.container.nativeElement).select('.chart').select('svg').select('g')
        .call(() => console.log('adding image'))
        .append('image')
        .attr('href', 'assets/Gibson-Logo.png')
        .attr('width', '100px')
        .attr("transform", "translate(-50, -20)");
    };

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('g')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d){ return(color(d.data.label)) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
      .append("title")          // add the tooltip text
      .text(function(d) { return d.data.value });


    // Add the polylines between chart and labels:
    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
          let posA = arc.centroid(d) // line insertion in the slice
          let posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
          let posC = outerArc.centroid(d); // Label position = almost the same as posB
          let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC]
        })

    // Add the polylines between chart and labels:
    svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
        .text( function(d) { return d.data.label } )
        .attr('font-size', '0.7rem')
        .attr('transform', function(d) {
            let pos = outerArc.centroid(d);
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function(d) {
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        });

  }


}
