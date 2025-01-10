import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from "ng-apexcharts"

export type GET_TRANSITIONS = {
  receitas: Transition[]
  despesas: Transition[]
}

export type Transition = {
    id: string
    nome: string
    categoria: string
    data: string
    valor: number
    descricao: string
    icon?: string
    status?: boolean
    tipo: string
}

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