import * as d3 from 'd3';
import { Component, Input, OnInit } from '@angular/core';
import { PieChartDataPoint } from '../models/pie-chart-data-point';

/*
NOTE: this pie chart is not as feature complete as pie chart 2 but may be useful as an additional reference.
*/
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @Input() data: PieChartDataPoint[];
  @Input() width: number = 800;
  @Input() height: number = 800;
  @Input() innerRadiusRatio: number = .2;

  constructor() { }

  ngOnInit(): void {
    this.data = [
      { value: 80, label: "% which looks like Pacman" },
      { value: 20, label: "% which doesn't" }
    ];

    this.renderChart();
  }

  public get radius(): number {
    return this.width / 2;
  }


  private renderChart(): void {
    let pieArc = d3.arc()
      .outerRadius(this.radius)        // the radius of the pie chart
      .innerRadius(this.radius * this.innerRadiusRatio);  // useful if we want to create a doughnut

    let labelArc = d3.arc()
        .outerRadius(this.radius)
        .innerRadius(0);

    let pie = d3.pie()
        .value(x => x.value);

    let svg = d3.select("body").append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ") rotate(0)");

    let g = svg.selectAll("g")
        .data(pie(this.data))
        .enter()
        .append("g")

    g.append("path")
        .attr("d", pieArc)
        .style("fill", x => x.data.value == 80 ? "yellow" : "black")

    g.append("text")
        .attr("transform", x => "translate(" + labelArc.centroid(x) + ") ")
        .attr("fill", "red")
        .text(function (d) { return d.data.label; });
  }


}
