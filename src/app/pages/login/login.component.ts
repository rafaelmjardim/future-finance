import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  isDark = signal<boolean>(false);

  protected form!: FormGroup;
  protected formBuilder = inject(FormBuilder);
  protected authService = inject(AuthService);

  ngOnInit(): void {
      this.form = this.formBuilder.group({
        email: [''],
        senha: ['']
      })
  }

  onSigIn = (email: string, senha: string) => {
    this.authService.signIn(email, senha)
    .then( res => {
      console.log('login realizado', res);
    }).catch(error => {
      console.log('error', error);
    })
  }

  submitLogin = () => {
    const email = this.form.controls['email'].value;
    const senha = this.form.controls['senha'].value;    
    this.onSigIn(email, senha);
  }

}
