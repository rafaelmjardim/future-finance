import { TransitionsListComponent } from './transitions-list/transitions-list.component';
import { Component, effect, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { UtilsService } from '../../services/utils/utils.service';
import { PageHeaderComponent } from '../../components/pageheader/page-header.component';
import { pagesItems } from '../../constants/menu';
import { ChartOptions, Transition } from './transitions';
import { CardComponent } from '../../components/card/card.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SheetService } from '../../components/sheet/sheet.service';
import { DataPickerService } from '../../components/data-picker/data-picker.service';

@Component({
  selector: 'app-transitions',
  standalone: true,
  imports: [PageHeaderComponent, TransitionsListComponent, CardComponent, NgApexchartsModule],
  templateUrl: './transitions.component.html',
  styleUrl: './transitions.component.scss'
})
export class TransitionsComponent implements OnInit {
  private api = inject(ApiService);
  protected utilsService = inject(UtilsService);
  private sheetService = inject(SheetService);
  protected dataPickerService = inject(DataPickerService);
  
  protected pageItem = pagesItems['transacoes'];

  protected incomings: Transition[] = [];
  protected expenses: Transition[] = [];

  protected totalIncomings!: number;
  protected totalExpenses!: number;

  protected chartOptions!: Partial<ChartOptions>;
  
  constructor() {
    effect(() => {
      if (this.sheetService.reloadTransitionsSignal()) {
        this.getTransitions();
        //Verificar, talvez tenha que setar para false o reload pois não vá reconhecer segunda transação seguida (signal não atualiza mesmo valor caso n tenha mudança)
      }

     this.dataPickerService.currentDateSignal();
     this.getTransitions(); //Get duplicado, resolver depois
    })
  }

  ngOnInit(): void {
    this.utilsService.loaders.showTransition.set(false);
    this.getTransitions();
  }

  getTransitions = () => {
    this.api.getTransitions().subscribe({
      next: (transitions_response) => {
        const receitasResponse = this.utilsService.convertGetFirebase(transitions_response.receitas);
        const despesasResponse = this.utilsService.convertGetFirebase(transitions_response.despesas);

        
        this.incomings = this.utilsService.filterTransitionByDate(receitasResponse);
        this.expenses = this.utilsService.filterTransitionByDate(despesasResponse);

        // Seta icones conforme categoria
        this.incomings = this.setIconCategoryInTransition(this.incomings);
        this.expenses = this.setIconCategoryInTransition(this.expenses);

        this.totalIncomings = this.utilsService.totalTransitionAccumulator(this.incomings);
        this.totalExpenses = this.utilsService.totalTransitionAccumulator(this.expenses);
        
        this.utilsService.loaders.showTransition.set(true);
        this.initChart();
      }
    })
  }

  setIconCategoryInTransition = (transitions: Transition[]) => {
    const transitionsFormatted = transitions.map(transition => {
      return {
        ...transition, 
        icon: transition.tipo === 'despesa' ? this.setIconByCetegory(transition.categoria) : 'lucideDollarSign'
      }
    })

    return transitionsFormatted;
  }

  setIconByCetegory = (categoryKey: string) => {
    const icons: { [ket: string]: string } = {
      'cartao': 'ionCardOutline',
      'veiculo': 'ionCarOutline',
      'pagamento': 'ionBarcodeOutline',
      'compras': 'ionPricetagOutline',
      'alimentacao': 'ionFastFoodOutline',
    }

    return icons[categoryKey] ?? 'ionPricetagOutline';
  }

  initChart = () => {
    this.chartOptions = {
      series: [
        {
          name: "Receita",
          data: [this.totalIncomings],
          color: "#09BC8A"
        },
        {
          name: "Despesa",
          data: [this.totalExpenses],
          color: "#D33535"
        }
      ],
      chart: {
        height: 350,
        type: "bar",
      },
      xaxis: {
        categories: ['Janeiro'],
        // title: {
        //   text: 'Meses',
        // },
      },
      yaxis: {
        // title: {
        //   text: 'Valores (R$)',
        // },
      },
    }
  }
}
