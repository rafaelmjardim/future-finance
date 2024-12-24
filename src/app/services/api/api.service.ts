import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { GET_TRANSITIONS } from '../../pages/transitions/transitions';

const API_KEY = environment.API_KEY;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  postTransition = (transitionData: any, rota: 'despesas' | 'receitas') => {
    const { date, value, description, name, typeRef } = transitionData;

    return this.http.post(`${API_KEY}/${rota}.json`, {
      valor: value,
      data: date,
      nome: name,
      descricao: description,
      tipo: typeRef
    });
  }

  getTransitions = (): Observable<GET_TRANSITIONS> => {
    return this.http.get<GET_TRANSITIONS>(`${API_KEY}.json`);   
  }
}
