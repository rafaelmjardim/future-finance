import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  //Função que converte objetos do get em array de objetos.
  convertGetFirebase = (objects: any) => {
    return Object.keys(objects).map(key => {
      return {
        ...objects[key],
        id: key
      }
    })
  }
}
