import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GET_TRANSITIONS } from '../pages/transitions/transitions';
import { environment } from '../../../../environments/environment.development';

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
    const { date, value, description, name, category, typeRef, status, recorrente, repeat, repeatTimes } = transitionFormData;

    return this.http.post(`${API_KEY}/${rota}.json`, {
      valor: value,
      data: date,
      nome: name,
      categoria: category,
      descricao: description,
      tipo: typeRef,
      recorrente,
      status,
      repete: repeat,
      repeticoes: repeat ? repeatTimes : null
    });
  }

  putTransition = (id: string, transitionFormData: any, rota: Rota) => {
    const { date, value, description, name, category, typeRef, status, recorrente, repeat, repeatTimes } = transitionFormData;
    
    return this.http.patch(`${API_KEY}/${rota}/${id}.json`, {
      valor: value,
      dataAt: date,
      nome: name,
      categoria: category,
      descricao: description,
      tipo: typeRef,
      recorrente,
      status,
      repete: repeat,
      repeticoes: repeat ? repeatTimes : null
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
