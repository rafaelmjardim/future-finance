import { MediaQueryService } from './../../services/media-query/media-query.service';
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
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-transitions',
  standalone: true,
  imports: [PageHeaderComponent, TransitionsListComponent, CardComponent, NgApexchartsModule, NgClass],
  templateUrl: './transitions.component.html',
  styleUrl: './transitions.component.scss'
})
export class TransitionsComponent implements OnInit {
  private api = inject(ApiService);
  protected mediaQueryService = inject(MediaQueryService);
  protected utilsService = inject(UtilsService);
  private sheetService = inject(SheetService);
  protected dataPickerService = inject(DataPickerService);
  
  protected pageItem = pagesItems['transacoes'];

  protected incomings: Transition[] = [];
  protected expenses: Transition[] = [];

  protected incomingsFixes: Transition[] = [];
  protected expensesFixes: Transition[] = [];

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
        const receitasResponse = this.utilsService.convertGetFirebase(transitions_response?.receitas);
        const despesasResponse = this.utilsService.convertGetFirebase(transitions_response?.despesas);
        const receitasFixasResponse = this.utilsService.convertGetFirebase(transitions_response?.receitasFixas);
        const despesasFixasResponse = this.utilsService.convertGetFirebase(transitions_response?.despesasFixas);
        
        this.incomings = this.utilsService.filterTransitionByDate(receitasResponse);
        this.expenses = this.utilsService.filterTransitionByDate(despesasResponse);

        const currentMonthDataPicker = this.dataPickerService.currentDateSignal().format("YYYY-MM");

        // Se tiver receitasFixas verifica ediçao (sobrescritas) conforme o mes
        if (receitasFixasResponse) { 
          const receitasFixasFormatted = receitasFixasResponse.map(receita => 
            receita.sobrescrita?.[currentMonthDataPicker] ? { ...receita, ...receita.sobrescrita[currentMonthDataPicker] } : receita
          );

          this.incomings = [...this.incomings, ...receitasFixasFormatted];
        }
        
        // Se tiver despesasFixas verifica ediçao (sobrescritas) conforme o mes
        if (despesasFixasResponse) {
          const despesasFixasFormatted = despesasFixasResponse.map(despesa => {
            return despesa.sobrescrita?.[currentMonthDataPicker] ? 
              {...despesa, ...despesa.sobrescrita[currentMonthDataPicker] } : despesa
          });
          
          this.expenses = [...this.expenses, ...despesasFixasFormatted];
        }

        // Seta icones conforme categoria
        this.incomings = this.setIconCategoryInTransition(this.incomings);
        this.expenses = this.setIconCategoryInTransition(this.expenses);
        this.incomingsFixes = this.setIconCategoryInTransition(this.incomingsFixes);
        this.expensesFixes = this.setIconCategoryInTransition(this.expensesFixes);

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
          // color: "#09BC8A"
          color: "#34d399"
        },
        {
          name: "Despesa",
          data: [this.totalExpenses],
          // color: "#D33535"
          color: "#dc2626"
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
