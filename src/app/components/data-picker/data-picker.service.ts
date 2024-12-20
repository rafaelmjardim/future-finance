import { Injectable, signal } from '@angular/core';
import moment, { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataPickerService {
  public currentDateSignal = signal<Moment>(moment());

  constructor() { }
}
