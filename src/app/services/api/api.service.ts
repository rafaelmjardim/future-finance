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

  getTransitions = (): Observable<GET_TRANSITIONS> => {
    return this.http.get<GET_TRANSITIONS>(`${API_KEY}.json`);   
  }

  postTransition = (transitionFormData: any, rota: 'despesas' | 'receitas') => {
    const { date, value, description, name, category, typeRef } = transitionFormData;

    return this.http.post(`${API_KEY}/${rota}.json`, {
      valor: value,
      data: date,
      nome: name,
      categoria: category,
      descricao: description,
      tipo: typeRef
    });
  }

  putTransition = (id: string, transitionFormData: any, rota: 'despesas' | 'receitas') => {
    const { date, value, description, name, category, typeRef } = transitionFormData;
    
    return this.http.put(`${API_KEY}/${rota}/${id}.json`, {
      valor: value,
      data: date,
      nome: name,
      categoria: category,
      descricao: description,
      tipo: typeRef
    })
  }  

  deleteTransition = (id: string, rota: 'despesas' | 'receitas') => {
    return this.http.delete(`${API_KEY}/${rota}/${id}.json`)
  }
  
}
