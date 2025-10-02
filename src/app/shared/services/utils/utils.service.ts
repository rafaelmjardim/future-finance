import { inject, Injectable, signal } from '@angular/core';
import { DataPickerService } from '../../components/data-picker/data-picker.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  darkModeSignal = signal(false);

  //Função que converte objetos do get em array de objetos.
  public convertGetFirebase = (objects: any) => {
    if (!objects) return [];
    return Object.keys(objects).map((key) => {
      return {
        ...objects[key],
        id: key,
      };
    });
  };
}
