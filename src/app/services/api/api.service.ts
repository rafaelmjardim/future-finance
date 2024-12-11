import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

const API_KEY = environment.API_KEY;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  postDespesa = (userID: string) => {
    return this.http.post(`${API_KEY}/${userID}/expends.json`, {
      title: 'Despesa de teste'
    });
  }

  getDespesas = (userID: string) => {
    return this.http.get(`${API_KEY}/${userID}/expends.json`)
  }

  postReceita = () => {
    // return this.http.post()
  }

  getReceitas = () => {
    // return this.http.get()
  }
}
