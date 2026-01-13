import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { GET_TRANSITIONS, Rota } from '../interfaces/interfaces';

const API_KEY = environment.API_KEY;

@Injectable({
  providedIn: 'root',
})
export class TransactionApi {
  private readonly _http = inject(HttpClient);

  getTransactions = (): Observable<GET_TRANSITIONS> => {
    return this._http.get<GET_TRANSITIONS>(`${API_KEY}.json`);
  };

  postTransaction = (transactionFormData: any, rota: Rota) => {
    return this._http.post(`${API_KEY}/${rota}.json`, {
      valor: transactionFormData.value,
      data: transactionFormData.date,
      nome: transactionFormData.name,
      categoria: transactionFormData.category,
      descricao: transactionFormData.description,
      tipo: transactionFormData.typeRef,
      recorrente: transactionFormData.recorrente,
      status: transactionFormData.status,
      repete: transactionFormData.repeat,
      repeticoes: transactionFormData.repeat ? transactionFormData.repeatTimes : null,
    });
  };

  putTransaction = (id: string, transactionFormData: any, rota: Rota) => {
    return this._http.patch(`${API_KEY}/${rota}/${id}.json`, {
      valor: transactionFormData.value,
      data: transactionFormData.date,
      nome: transactionFormData.name,
      categoria: transactionFormData.category,
      descricao: transactionFormData.description,
      tipo: transactionFormData.typeRef,
      recorrent: transactionFormData.recorrente,
      status: transactionFormData.status,
      repete: transactionFormData.repeat,
      repeticoes: transactionFormData.repeat ? transactionFormData.repeatTimes : null,
    });
  };

  putTransactionSobrecrita = (id: string, transactionFormData: any, rota: Rota) => {
    const payload = {
      valor: transactionFormData.value,
      dataAt: transactionFormData.date,
      nome: transactionFormData.name,
      categoria: transactionFormData.category,
      descricao: transactionFormData.description,
      tipo: transactionFormData.typeRef,
      status: transactionFormData.status,
    };

    return this._http.patch(
      `${API_KEY}/${rota}/${id}/sobrescrita/${transactionFormData.date}.json`,
      payload
    );
  };

  putTransactionRecorrenteRules = (id: string, transactionFormData: any, rota: Rota) => {
    const payload = {
      valor: transactionFormData.value,
      nome: transactionFormData.name,
      categoria: transactionFormData.category,
      descricao: transactionFormData.description,
      tipo: transactionFormData.typeRef,
      status: transactionFormData.status,
      startMonth: transactionFormData.date,
      endMonth: null,
    };

    return this._http.patch(`${API_KEY}/${rota}/${id}/recorrenteRules.json`, payload);
  };

  deleteTransactionSobrescrita = (id: string, dateRecorrent: any, rota: Rota) => {
    return this._http.patch(`${API_KEY}/${rota}/${id}/sobrescrita/${dateRecorrent}.json`, {
      deletado: true,
    });
  };

  deleteTransaction = (id: string, rota: Rota) => {
    return this._http.delete(`${API_KEY}/${rota}/${id}.json`);
  };

  deleteAllTransactionsSobrescritas = (id: string, rota: Rota) => {
    return this._http.delete(`${API_KEY}/${rota}/${id}/sobrescrita.json`);
  };
}
