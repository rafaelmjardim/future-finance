export type Rota = 'despesas' | 'receitas';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTheme,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export type GET_TRANSITIONS = {
  receitas: Transaction[];
  despesas: Transaction[];
};

export type Transaction = {
  id: string;
  sobrescrita?: any;
  recorrenteRules?: any;
  nome: string;
  categoria: string;
  data: string;
  dataAt?: string;
  valor: number;
  descricao: string;
  icon?: string;
  status?: boolean;
  recorrente: boolean;
  repete: boolean;
  repeticoes: number;
  currentRepeat: number;
  tipo: string;
  startMonth?: string;
  endMonth?: string;
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  grid: ApexGrid;
  theme: ApexTheme;
};

export type ChartOptionsCategory = {
  series: any;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
};
