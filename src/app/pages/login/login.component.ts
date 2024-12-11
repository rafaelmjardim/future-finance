import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { Router, RouterState } from '@angular/router';

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
  protected userService = inject(UserService);

  private router = inject(Router);

  ngOnInit(): void {
    this.initForm();
    this.checkLoggedRoute();
  }

  initForm = () => {
    this.form = this.formBuilder.group({
      email: [''],
      senha: ['']
    })
  }

  //Melhorar esse redirect (está muito lento)
  checkLoggedRoute = () => {
    if (this.userService.getUserStorge()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  onSigIn = (email: string, senha: string) => {
    this.authService.signIn(email, senha)
    .then( user_response => {      
      if (user_response.user) {
        user_response.user.getIdToken()
        .then(token => {
          localStorage.setItem('token', token);
        })
        .catch(error => {
          console.log('Erro ao pegar token! ', error);
        })

        const { uid, email, displayName } = user_response.user;
        const userData = {
          uid,
          email,
          displayName
        }

        this.userService.setUserStorge(userData);
        this.authService.isLogged.set(true);
        this.router.navigateByUrl('/dashboard');
      }
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
