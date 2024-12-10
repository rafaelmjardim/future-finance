import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    NgClass, 
    AngularFireAuthModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'future-finance';
  
  isDark = signal<boolean>(false);
}
