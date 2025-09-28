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

  getTransactions = (): Observable<GET_TRANSITIONS> => {
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
    const payload = {
      valor: transactionFormData.value,
      DataAt: transactionFormData.date,
      nome: transactionFormData.name,
      categoria: transactionFormData.category,
      descricao: transactionFormData.description,
      tipo: transactionFormData.typeRef,
      status: transactionFormData.status,
    };

    return this.http.patch(
      `${API_KEY}/${rota}/${id}/sobrescrita/${transactionFormData.date}.json`,
      payload
    );
  };

  deleteTransictionSobrescrita = (id: string, dateRecorrent: any, rota: Rota) => {
    return this.http.patch(`${API_KEY}/${rota}/${id}/sobrescrita/${dateRecorrent}.json`, {
      deletado: true,
    });
  };

  deleteTransiction = (id: string, rota: Rota) => {
    return this.http.delete(`${API_KEY}/${rota}/${id}.json`);
  };

  deleteAllTransactionsSobrescritas = (id: string, rota: Rota) => {
    return this.http.delete(`${API_KEY}/${rota}/${id}/sobrescrita.json`);
  };
}
