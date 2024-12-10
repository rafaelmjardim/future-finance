import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  public userData!: User;


  setUserStorge = (userData: any) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  getUserStorge = () => {
    const userStorge = localStorage.getItem('userData');

    return userStorge ? JSON.parse(userStorge) : null;
  }

  removeUserStorge = () => {
    localStorage.removeItem('userData');
  }
}
