import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexPlotOptions, ApexTitleSubtitle, ApexXAxis, ApexYAxis, NgApexchartsModule, ApexTheme, ApexStroke, ApexTooltip, ApexLegend, ApexGrid } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  stroke: ApexStroke,
  tooltip: ApexTooltip
  legend: ApexLegend
  grid: ApexGrid
};

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent implements OnInit{
  protected chartOptions!: Partial<ChartOptions>;
  ngOnInit(): void {
    this.chartOptions = {
      series: [
        {
          name: "Receita",
          data: [2000],
          color: "#6e9c90"
        },
        {
          name: "Despesa",
          data: [1200],
          color: "#D33535"
        }
      ],
      chart: {
        height: 350,
        type: "bar",
      },
      xaxis: {
        categories: ['Janeiro'],
        title: {
          text: 'Meses',
        },
      },
      yaxis: {
        title: {
          text: 'Valores (R$)',
        },
      },
    }
  }
}
