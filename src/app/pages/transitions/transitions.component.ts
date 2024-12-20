import { TransitionsListComponent } from './transitions-list/transitions-list.component';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ApiService } from '../../services/api/api.service';
import { UtilsService } from '../../services/utils/utils.service';
import { User } from '../../services/user/user';
import { PageHeaderComponent } from '../../components/pageheader/page-header.component';
import { pagesItems } from '../../constants/menu';
import { Transition } from './transitions';
import { HttpErrorResponse } from '@angular/common/http';
import { CardComponent } from '../../components/card/card.component';
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
  colors: string[]
  tooltip: ApexTooltip
  legend: ApexLegend
  grid: ApexGrid
};

@Component({
  selector: 'app-transitions',
  standalone: true,
  imports: [PageHeaderComponent, TransitionsListComponent, CardComponent, NgApexchartsModule],
  templateUrl: './transitions.component.html',
  styleUrl: './transitions.component.scss'
})
export class TransitionsComponent implements OnInit {
  private userService = inject(UserService);
  private api = inject(ApiService);
  private utilsService = inject(UtilsService);
  
  protected user: User = this.userService.getUserStorge();

  protected pageItem = pagesItems['transacoes'];

  protected incomings: Transition[] = [];
  protected expenses: Transition[] = [];

  protected chartOptions!: Partial<ChartOptions>;

  ngOnInit(): void {
    this.getReceitas()
    this.getDespesas();

    this.chartOptions = {
      series: [
        {
          name: "Receita",
          data: [2000, 2400, 1500],
        },
        {
          name: "Despesa",
          data: [1200, 1800, 900],
        }
      ],
      colors: ['#6e9c90', '#D33535'],
      chart: {
        height: 350,
        type: "bar"
      },
      xaxis: {
        categories: ['Janeiro', 'Fevereiro', 'Março'],
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

  getReceitas = () => {
    if (!this.user) {
      return
    }

    this.api.getReceitas(this.user.uid).subscribe({
      next: (receitas_response) => {
        this.incomings = this.utilsService.convertGetFirebase(receitas_response);
      },
      error: (receitas_error: HttpErrorResponse) => {
        console.log('Erro ao carregar receitas', receitas_error);
      },
    })
  }

  getDespesas = () => {
    if (!this.user) {
      return
    }

    this.api.getDespesas(this.user.uid).subscribe({
      next: (despesas_response) => {
        this.expenses = this.utilsService.convertGetFirebase(despesas_response);
      },
      error: (despesas_error: HttpErrorResponse) => {
        console.log('Erro ao carregar despesas', despesas_error);
      },
    })
  }
}
