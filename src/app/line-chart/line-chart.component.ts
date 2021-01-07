import * as d3 from 'd3';
import {cloneDeep} from 'lodash';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],

})
export class LineChartComponent implements OnChanges {
  @Input() inputData: any[];
  @Input() width: number;
  @Input() height: number;
  @Input() exponent: number = 1;
  @Input() drawCirclePoints: boolean = true;
  @Input() drawLegend: boolean = true;

  private data: any[];
  private margin: number = 50;
  private colors = d3.schemeCategory10;

  constructor(private container: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.data = cloneDeep(this.inputData);
    this.parseTimeData();

    this.clearExistingSvg();
    this.renderChart();
  }

  private renderChart(): void {
      let mainDataGroup = this.buildMainDataGroup();

      // set up the X and Y scales:
      let x = this.buildXScaleFunc();
      let y = this.buildYScaleFunc();

      let propertyNames: string[] = this.getPropertyNames();

      // plot the data lines:
      for (let i = 0; i < propertyNames.length; i++) {
          this.plotVariable(mainDataGroup, x, y, propertyNames[i], this.colors[i]);
      }

      // build the X axis:
      this.buildXAxis(mainDataGroup, x);

      // build the Y axis:
      this.buildYAxis(mainDataGroup, y);

      this.drawGridlines(mainDataGroup, x, y);

      if (this.drawCirclePoints) {
        this.circlePoints(propertyNames, mainDataGroup, x, y);
      }

      if (this.drawLegend) {
        this.buildLegend(propertyNames, mainDataGroup);
      }

      this.rotateLabels();
  }

  private clearExistingSvg(): void {
    d3.select(this.container.nativeElement).select('.chart').select('svg').remove();
  }

  private buildMainDataGroup() {
    let dataGroup = d3.select(this.container.nativeElement).select('.chart').append('svg')
    .attr("width", this.width + this.margin)
    .attr("height", this.height + 2 * this.margin)
    .append("g")
    .attr("transform", "translate(" + this.margin + ", " + this.margin + ")");

    return dataGroup;
  }

  private parseTimeData(): void {
    let parseTime: (input: string) => Date = d3.timeParse("%m/%d/%Y");

    this.data.forEach(function (d) {
        d.date = parseTime(d.date);
    });
  }

  private buildXScaleFunc(): any {
    let x = d3.scaleTime()
    .domain(d3.extent(this.data, function (d) { return d.date; }))
    .range([0, this.width]);

    return x;
  }

  private buildYScaleFunc(): any {
    let y = d3.scalePow()
    .domain(d3.extent(this.data, function (d) { return d.value1 }))
    .range([this.height, 0])
    .exponent(this.exponent).nice()
    ;

    return y;
  }

  private getPropertyNames(): string[] {
    let propertyNames: string[] = [];

    for (let name in this.data[0]) {
        if (name == "date") {
            continue;
        }
        propertyNames.push(name);
    }

    return propertyNames;
  }

  private buildXAxis(dataGroup, xScaleFunc): void {
    let xAxisGroup = dataGroup
      .append("g")
      .attr("class", "xAxisGroup")
      .attr("transform", "translate(0," + this.height + ")");

    let xAxis = d3.axisBottom(xScaleFunc)
        .tickFormat(d3.timeFormat("%Y-%m-%d"))
        .tickSize(10);

    xAxis(xAxisGroup);
  }

  private buildYAxis(dataGroup, yScaleFunc): void {
    let yAxisGroup = dataGroup
      .append("g")
      .attr("class", "yAxisGroup");

    let yAxis = d3.axisLeft(yScaleFunc)
        .tickFormat(d => yScaleFunc.tickFormat(62, d3.format(",d"))(d)
        );

    yAxis(yAxisGroup);
  }

  private plotVariable(dataGroup, xScaleFunc, yScaleFunc, propertyName, color): void {
    let line1 = d3.line()
        .x(d => xScaleFunc(d.date))
        .y(d => yScaleFunc(d[propertyName]))
        .curve(d3.curveMonotoneX)
        ;

    dataGroup.append("path")
        .data([this.data])
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("d", line1)
  }

  private drawGridlines(dataGroup, xScaleFunc, yScaleFunc): void {
    let yGridlines = d3.axisLeft(yScaleFunc)
        .ticks(30)
        .tickFormat("")
        .tickSize(-this.width)

    let gridY = dataGroup.append("g")
        .attr("class", "grid")
        .call(yGridlines)
        ;

    gridY.call(yGridlines);
    // yGridlines(gridy);

    let xGridlines = d3.axisBottom(xScaleFunc)
        .ticks(30)
        .tickFormat("")
        .tickSize(this.height)

    let gridX = dataGroup.append("g")
        .attr("class", "grid")
        .call(xGridlines)
        ;

    gridX.call(xGridlines);
  }

  private circlePoints(propertyNames, dataGroup, xScaleFunc, yScaleFunc): void {
    this.data.forEach(function (point) {
        for (let i = 0; i < propertyNames.length; i++) {
            dataGroup
                .append("circle")
                .attr("fill", d3.schemeCategory10[i])
                .attr("r", 7)
                .attr("cx", xScaleFunc(point.date))
                .attr("cy", yScaleFunc(point[propertyNames[i]]))
                .append("title")
                .text("Date: " + d3.timeFormat("%Y-%m-%d")(point.date) + "\n" + propertyNames[i] + ": " + point[propertyNames[i]]);
        }
    });
  }

  private buildLegend(propertyNames, dataGroup): void {
    let legendElements = [];

    let legend = dataGroup
        .append("g")

    let elementHeight: number = 50;
    let elementWidth: number = 100;

    let xOrigin: number = 800;
    let yOrigin: number = 500 - elementHeight * propertyNames.length;

    let xMargin: number = 5;
    let yMargin: number = 20;

    let width: number = 200;
    let height: number = propertyNames.length * elementHeight + 2 * yMargin;

    legend
        .append("rect")
        .attr("x", xOrigin)
        .attr("y", yOrigin)
        .attr("fill", "white")
        .attr("width", width)
        .attr("height", height)
        .attr("stroke", "gray");

    for (let i = 0; i < propertyNames.length; i++) {
        let elementColor = this.colors[i];
        let element =
            {
                color: elementColor,
                title: propertyNames[i]
            }

        legendElements.push(element);
    }

    let currentY = yOrigin + yMargin;

    legendElements.forEach(function (x) {
        legend.append("rect")
            .attr("fill", x.color)
            .attr("x", xOrigin + xMargin)
            .attr("y", currentY)
            .attr("width", elementWidth)
            .attr("height", elementHeight)
            .append("title")
            .text(x.title);

        let title: string = x.title.length < 8 ? x.title : x.title.substring(0, 8) + "...";

        legend.append("text")
            .text(title)
            .attr("font-size", "14pt")
            .attr("fill", x.color)
            .attr("x", xOrigin + xMargin)
            .attr("y", currentY)
            .attr("dx", elementWidth + xMargin)
            .attr("dy", yMargin);

        currentY += elementHeight;
    });
  }

  private rotateLabels(): void {
    d3.selectAll(".xAxisGroup .tick text")
    .attr("transform", "rotate(-15)");
  }
}
