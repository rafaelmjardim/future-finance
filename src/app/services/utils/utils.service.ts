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
    if (!objects) return [];
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
  
  public filterTransitionByDate = (transitions: Transition[], transitionType?: "FIXE") => {
    return transitions.filter(transition => {      
      const transitionDate = moment(transition.data).format('MM/YYYY');
      const transitioYear = moment(transition.data).format('YYYY');
      const currentMonthDataPicker = this.dataPickerService.currentDateSignal().format('MM/YYYY');
      const currentYearDataPicker = this.dataPickerService.currentDateSignal().format('YYYY');      

      if (transitionType === "FIXE") {
        return transitionDate <= currentMonthDataPicker && transitioYear === currentYearDataPicker;
      }
      return transitionDate == currentMonthDataPicker;
    });    
  }

  // Se tiver transitionFixes verifica ediçao (sobrescritas) conforme o mes
  public checkAndSetTransitionsFixes = (transitionsFixes: Transition[], transitions: Transition[], currentMonthDataPicker: any) => {
    const transitionsFixesFormatted = transitionsFixes.map(transition => {
      return transition.sobrescrita?.[currentMonthDataPicker] ?
      {...transition, ...transition.sobrescrita[currentMonthDataPicker]} : transition
    });

    return transitions = [...transitions, ...transitionsFixesFormatted];
  }
}
