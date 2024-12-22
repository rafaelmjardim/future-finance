import { UtilsService } from './../../services/utils/utils.service';
import { User } from '../../services/user/user';
import { UserService } from './../../services/user/user.service';
import { Component, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../components/pageheader/page-header.component';
import { pagesItems } from '../../constants/menu';
import { ApiService } from '../../services/api/api.service';
import { CardComponent } from '../../components/card/card.component';
import { ChartOptions } from '../transitions/transitions';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService)
  private utilsService = inject(UtilsService);
  private userService = inject(UserService);

  protected user: User = this.userService.getUserStorge();
  protected pageItem = pagesItems['dashboard'];
  protected totalIncomings!: number;
  protected totalExpenses!: number;
  protected chartOptions!: Partial<ChartOptions>;
  
  ngOnInit(): void {
    this.getTransitions();
    this.initChart();
  } 

  private getTransitions = () => {
    this.apiService.getTransitions(this.user.uid).subscribe({
      next: (transitions_res) => {
        const { receitas, despesas } = transitions_res;

        const incomings = this.utilsService.convertGetFirebase(receitas);
        const expenses = this.utilsService.convertGetFirebase(despesas);
        this.totalExpenses = this.utilsService.totalTransitionAccumulator(expenses);
        this.totalIncomings = this.utilsService.totalTransitionAccumulator(incomings);
      }
    })
  }

  private initChart = () => {
    this.chartOptions = {
      series: [
        {
          name: "Saldo Previsto",
          data: this.generateForecastData()
        }
      ],
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: this.getNextFourMonths(),
        title: {
          text: "Meses"
        }
      },
      yaxis: {
        title: {
          text: "Saldo (R$)"
        }
      },
      tooltip: {
        x: {
          format: "MM/yyyy"
        }
      },
      fill: {
        opacity: 0.5
      },
      title: {
        text: "Previsão de Saldos para os Próximos 4 Meses",
        align: "center"
      }
    };
  }

  getNextFourMonths(): string[] {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 4; i++) {
      const nextDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      months.push(
        nextDate.toLocaleString("default", { month: "long", year: "numeric" })
      );
    }
    return months;
  }

  // Gera dados de saldo para os próximos meses
  generateForecastData(): number[] {
    // Substitua por sua lógica de cálculo real
    return [1200, 1500, 1800, 2000];
  }
}
