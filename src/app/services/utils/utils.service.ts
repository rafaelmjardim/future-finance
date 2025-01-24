import { inject, Injectable, signal } from '@angular/core';
import { Transition } from '../../pages/transitions/transitions';
import moment from 'moment';
import { DataPickerService } from '../../components/data-picker/data-picker.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private dataPickerService = inject(DataPickerService);
  
  darkModeSignal = signal(false);

  public loaders = {
    showTransition: signal(false)
  }

  constructor() { }

  //Função que converte objetos do get em array de objetos.
  public convertGetFirebase = (objects: any) => {
    return Object.keys(objects).map(key => {
      return {
        ...objects[key],
        id: key
      }
    })
  }

  //Função que retorna o valor total de uma transição (acumulador: Soma de todos os valores)
  public totalTransitionAccumulator = (transitions: Transition[]) => {
    return transitions.reduce((acc, transition) => {
      return acc + transition.valor;
    }, 0);
  }
  
  public filterTransitionByDate = (transitions: Transition[]) => {
    return transitions.filter(transition => {      
      return moment(transition.data).format('MM/YYYY') == this.dataPickerService.currentDateSignal().format('MM/YYYY')
    });    
  }
}
