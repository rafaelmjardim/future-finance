import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { GET_TRANSITIONS, Transition } from '../../pages/transitions/transitions';

export type Rota = 'despesas' | 'receitas' | 'despesasFixas' | 'receitasFixas' | 'despesasSobrescritas' | 'receitasSobrescritas';

const API_KEY = environment.API_KEY;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  getTransitions = (): Observable<GET_TRANSITIONS> => {
    return this.http.get<GET_TRANSITIONS>(`${API_KEY}.json`);   
  }

  postTransition = (transitionFormData: any, rota: Rota) => {
    const { date, value, description, name, category, typeRef, status, recorrente } = transitionFormData;

    return this.http.post(`${API_KEY}/${rota}.json`, {
      valor: value,
      data: date,
      nome: name,
      categoria: category,
      descricao: description,
      tipo: typeRef,
      recorrente,
      status
    });
  }

  putTransition = (id: string, transitionFormData: any, rota: Rota) => {
    const { date, value, description, name, category, typeRef, status, recorrente } = transitionFormData;
    
    return this.http.patch(`${API_KEY}/${rota}/${id}.json`, {
      valor: value,
      dataAt: date,
      nome: name,
      categoria: category,
      descricao: description,
      tipo: typeRef,
      recorrente,
      status,
    })
  }

  putTransitionSobrecrita = (id: string, transitionFormData: any, rota: Rota) => {
    const { date, value, description } = transitionFormData;

    return this.http.patch(`${API_KEY}/${rota}/${id}/sobrescrita/${date}.json`, {
      valor: value,
      descricao: description
    })
  } 

  deleteTransition = (id: string, rota: Rota) => {
    return this.http.delete(`${API_KEY}/${rota}/${id}.json`)
  }

  deleteAllTransitionsSobrescritas = (id: string, rota: Rota) => {
    return this.http.delete(`${API_KEY}/${rota}/${id}/sobrescrita.json`)
  }
  
}
