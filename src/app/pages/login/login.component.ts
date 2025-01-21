import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { Router, RouterState } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ButtonComponent } from '../../components/button/button.component';
import { NgIcon } from '@ng-icons/core';
import { MediaQueryService } from '../../services/media-query/media-query.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, FormsModule, ReactiveFormsModule, NgIcon, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  isRegistration = false;
  isDiferentePassword = false;

  protected formError: boolean = false;
  protected formEmpty: boolean = false;
  protected form = new FormGroup({
    email: new FormControl('', Validators.email),
    senha: new FormControl('', Validators.required)
  });
  protected registerForm = new FormGroup({
    nome: new FormControl('', Validators.email),
    email: new FormControl('', Validators.email),
    senha: new FormControl('', Validators.required),
    confirmacaoSenha: new FormControl('', Validators.required)
  });

  // protected formBuilder = inject(FormBuilder);
  // protected formErrors!: {email: any, senha: any}

  protected authService = inject(AuthService);
  protected userService = inject(UserService);
  protected mediaQueryService = inject(MediaQueryService);

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

  private onSigIn = (email: string, senha: string) => {
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

        this.setUserStorgeAndNavigate(user_response.user);
      }
    }).catch(error => {
      this.formError = true;
      this.showLoader = false;
      this.form.controls.email.setValue('');
      this.form.controls.senha.setValue('');

      console.log('error', error);
    })
  }

  private onRegistration = () => {
    const { nome, email, senha} = this.registerForm.value;

    if (nome && email && senha) {
      this.authService.register(nome, email, senha)
      .then(user_response => {
        if (user_response.user) {

          console.log('user', user_response.user);
          
          user_response.user.getIdToken()
          .then(token => {
            localStorage.setItem('token', token);
          });

         this.setUserStorgeAndNavigate(user_response.user);
        }
      })
      .catch(error => {
        this.showLoader = false;
      })
    }
  }

  private setUserStorgeAndNavigate = (user: any) => {
    const { uid, email, displayName } = user;
      const userData = {
        uid,
        email,
        displayName
      }

      this.userService.setUserStorge(userData);
      this.router.navigateByUrl('/dashboard');
  }

  protected submitLogin = () => {    
    const { email, senha } = this.form.value;
    this.isDiferentePassword = false;

    if (this.isRegistration) {
      const { senha,  confirmacaoSenha } = this.registerForm.value;

      if (senha !== confirmacaoSenha) {
        this.isDiferentePassword = true;
        return
      } 
      this.showLoader = true;
      this.onRegistration();
    }
    
    if (email && senha && !this.showLoader && !this.isRegistration) {
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

  protected changeLoginForm = () => {
    this.isRegistration = !this.isRegistration;
  }
}
