import { inject, Injectable } from '@angular/core';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userData!: User;

  setUserStorge = (userData: any) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  getUserStorge = () => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }
    
    const userStorge = localStorage.getItem('userData');

    return userStorge ? JSON.parse(userStorge) : null;
  }

  removeUserStorge = () => {
    localStorage.removeItem('userData');
  }
}
