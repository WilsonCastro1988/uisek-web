import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { EmailService } from '../../../Services/email.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})



export class RegisterComponent implements OnInit {
  companyForm: FormGroup;
  submitted = false;
  usuario: any;
  perfilUsuario: any;

  username = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  telefono = new FormControl('', Validators.required);
  matcher = new MyErrorStateMatcher();

  constructor(
    private title: Title,
    private seo: SeoService,
    private authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private emailService: EmailService
  ) {
  }

  ngOnInit() {
    let t: string = "uisek - Registros";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Uisek - Registros",
      description: "uisek Universidad",
      slug: "registros"
    });

    this.companyForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^-?[0-9][^\.]*$/)]],
    }
      , {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

  pasarDatosFormUsuario() {

    const newChild = this.companyForm.value;
    console.log('Compania a registrar: ' + JSON.stringify(newChild));
    this.usuario = {
      idUsuario: 0,
      activo: "SI",
      cedula: "0401397948",
      clave: newChild.password,
      email: newChild.email,
      fechaCreacion: "2020-11-16",
      foto: null,
      nombreUsuario: newChild.username,
      nombreapellido: "WILSON CASTRO",
      usercambio: "N/A",
      cuenta: {
        idCuenta: 1,
        direccionCuenta: "ECUADOR",
        emailCuenta: "wilson.castro@gmail.com",
        nombreCuenta: "UISEK-ECUADOR",
        rucCuenta: "0401397948",
        telefonoCuenta: "0998571410",
        activoCuenta: true,
        tipoCuenta: {
          idTipo: 1,
          nombreTipo: "BASIC",
          activoTipoCuenta: true,
          paquete: {
            idPaquete: 1,
            numeroAplicacion: 1,
            numeroMatriculas: 1,
            numeroMenus: 1,
            numeroCursos: 1,
            numeroPerfilUsuario: 1,
            numeroPerfiles: 1,
            numeroPermisos: 1,
            numeroUsuarios: 1,
            numeroCarreras: 1
          }
        }
      }
    }
  }

  registrarPerfilUsuario(idUser) {
    this.perfilUsuario = {
      perfilHasUsuarioPK: {
        perfilIdPerfil: 1,
        usuarioIdUsuario: idUser
      },
      activoPerfilHasUsuario: true
    }


    this.authService.savePerfilUsuario(this.perfilUsuario)
      .subscribe(
        res => {
          this.router.navigate(['/company']);
        },
        (err) => {
          this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
          //console.log(JSON.stringify(err));
        });
    
  }

  registrarEmpresa() {
    this.submitted = true;
    // stop the process here if form is invalid
    if (this.companyForm.invalid) {
      console.log('error form invalid');
      return;
    }

    this.pasarDatosFormUsuario();

    this.authService.signup2(this.usuario)
      .subscribe(
        res => {
          localStorage.setItem('token', res.idUsuario);
          this.registrarPerfilUsuario(res.idUsuario);
          this.ngxSmartModalService.create('confirm', 'Cuenta creada exitosamente').open();
          this.router.navigate(['/company']);
        },
        (err) => {
          this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
          //console.log(JSON.stringify(err));
        });
  }

  /*  Función para permitir solo numeros */
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


}
