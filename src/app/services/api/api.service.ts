import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

const API_KEY = environment.API_KEY;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  token = typeof window === 'undefined' || !window.localStorage ? null : localStorage.getItem('token'); //Melhor isso

  postTransition = (userID: string, transitionData: any) => {
    const { date, value, description, name, typeRef } = transitionData;

    return this.http.post(`${API_KEY}/${userID}/${typeRef}.json?auth=${this.token}`, {
      valor: value,
      data: date,
      nome: name,
      descricao: description
    });
  }

  getReceitas = (userID: string) => {
    return this.http.get(`${API_KEY}/${userID}/receitas.json?auth=${this.token}`);    
  }

  getDespesas = (userID: string) => {
    return this.http.get(`${API_KEY}/${userID}/despesas.json?auth=${this.token}`);    
  }
}
