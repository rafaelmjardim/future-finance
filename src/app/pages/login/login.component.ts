import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { Router, RouterState } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, FormsModule, ReactiveFormsModule, LoaderComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  isDark = signal<boolean>(false);

  protected formError: boolean = false;
  protected formEmpty: boolean = false;
  protected form = new FormGroup({
    email: new FormControl('', Validators.email),
    senha: new FormControl('', Validators.required)
  });

  // protected formBuilder = inject(FormBuilder);
  // protected formErrors!: {email: any, senha: any}

  protected authService = inject(AuthService);
  protected userService = inject(UserService);

  private router = inject(Router);

  protected showLoader = false;

  ngOnInit(): void {
    this.checkLoggedRoute();
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
        this.router.navigateByUrl('/dashboard');
      }
    }).catch(error => {
      this.formError = true;
      this.showLoader = false;
      this.form.controls.email.setValue('');
      this.form.controls.senha.setValue('');

      console.log('error', error);
    })
  }

  submitLogin = () => {    
    const { email, senha } = this.form.value;
    
    if (email && senha && !this.showLoader) {
      this.showLoader = true;
      this.onSigIn(email, senha);
    } else {
      this.formEmpty = true;
    }

    // this.formErrors = {
    //   email: this.form.controls.email.errors,
    //   senha: this.form.controls.senha.errors
    // }
  }
}
