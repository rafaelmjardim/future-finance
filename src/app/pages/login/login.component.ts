import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  ngOnInit(): void {
      this.form = this.formBuilder.group({
        email: [''],
        senha: ['']
      })
  }

  submitLogin = () => {
    const email = this.form.controls['email'].value;
    const senha = this.form.controls['senha'].value;

    console.log('Email:', email, 'Senha:', senha);
  }

}
