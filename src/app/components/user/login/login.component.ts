import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';
import { NgxSmartModalService } from 'ngx-smart-modal';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  matcher = new MyErrorStateMatcher();

  perfilSelect: any;
  perfiles: any;

  constructor(public ngxSmartModalService: NgxSmartModalService,
    private title: Title,
    private seo: SeoService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.createLoginForm();
    this.cargarPerfiles();
  }

  ngOnInit() {
    let t: string = "Uisek - Login";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Uisek - Login",
      description: "Uisek Inscripciones",
      slug: "login"
    });
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      password: ['', Validators.required],
      email: ['', [Validators.required,]],
      perfil: ['', Validators.required],
    });
  }

  verPerfiles(nombrePerfil) {

    if (nombrePerfil === "ESTUDIANTE") {
      console.log('PERFIL' + nombrePerfil)
      localStorage.setItem('admin', nombrePerfil);
      this.router.navigate(['/management']);
    } else {
      this.ngxSmartModalService.create('error',
        'Datos De Perfil, verifíquelos porfavor !').open();
    }

  }

  cargarPerfiles() {

    this.authService.getAllPerfiles()
      .subscribe(
        res => {
          this.perfiles = res;
        },
        err => {
          this.ngxSmartModalService.create('error',
            'Perfiles, imposible cargar').open();
          console.log('ERROR' + JSON.stringify(err))
        }
      );
  }



  loginUser() {
    this.isSubmitted = true;
    //alert('SUCCESS!!');
    if (this.loginForm.invalid) {
      return;
    }
    const user = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
      perfil: this.loginForm.get('perfil').value,
    };
    this.authService.login2(user.email, user.password, user.perfil)
      .subscribe(
        res => {
          let usuario: any = res;

          if (res !== null) {
            localStorage.setItem('token', res.idUsuario);
            this.ngxSmartModalService.create('success',
              'Datos Correctos, usuario EXITENTE !' + res.nombreUsuario).open();

              console.log("PERFIL INICIAL: "+user.perfil);
            this.verPerfiles(user.perfil);
          } else {
            this.ngxSmartModalService.create('error',
              'Datos Incorrectos, verifíquelos porfavor !').open();
          }
        },
        err => {
          this.ngxSmartModalService.create('error',
            'Usuario o Clave Incorrectas, imposible logearse').open();
          console.log('ERROR' + JSON.stringify(err))
        }
      );
  }


}
