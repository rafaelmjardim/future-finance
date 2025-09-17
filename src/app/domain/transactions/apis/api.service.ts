import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GET_TRANSITIONS } from '../pages/transactions/transactions';
import { environment } from '../../../../environments/environment.development';

export type Rota =
  | 'despesas'
  | 'receitas'
  | 'despesasFixas'
  | 'receitasFixas'
  | 'despesasSobrescritas'
  | 'receitasSobrescritas';

const API_KEY = environment.API_KEY;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  getTransictions = (): Observable<GET_TRANSITIONS> => {
    return this.http.get<GET_TRANSITIONS>(`${API_KEY}.json`);
  };

  postTransiction = (transactionFormData: any, rota: Rota) => {
    const {
      date,
      value,
      description,
      name,
      category,
      typeRef,
      status,
      recorrente,
      repeat,
      repeatTimes,
    } = transactionFormData;

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
      repeticoes: repeat ? repeatTimes : null,
    });
  };

  putTransiction = (id: string, transactionFormData: any, rota: Rota) => {
    const {
      date,
      value,
      description,
      name,
      category,
      typeRef,
      status,
      recorrente,
      repeat,
      repeatTimes,
    } = transactionFormData;

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
      repeticoes: repeat ? repeatTimes : null,
    });
  };

  putTransictionSobrecrita = (id: string, transactionFormData: any, rota: Rota) => {
    const { date, value, description } = transactionFormData;

    return this.http.patch(`${API_KEY}/${rota}/${id}/sobrescrita/${date}.json`, {
      valor: value,
      descricao: description,
    });
  };

  deleteTransiction = (id: string, rota: Rota) => {
    return this.http.delete(`${API_KEY}/${rota}/${id}.json`);
  };

  deleteAllTransictionsSobrescritas = (id: string, rota: Rota) => {
    return this.http.delete(`${API_KEY}/${rota}/${id}/sobrescrita.json`);
  };
}
