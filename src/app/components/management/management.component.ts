import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';



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
  };
}
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})

export class ManagementComponent implements OnInit {

  panelOpenState = false;

  /**URL IMAGENES FIREBASE **/
  obsAvatar: Observable<string>;

  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  elements: any = [];
  previous: any = [];
  headElements = ['ID',
    'MATERIA',
    'PARALELO',
    'HORARIO',
    'DIAS',];

  idsTipousuario: any = [];


  @ViewChild(MdbTableDirective, { static: true })
  mdbTable: MdbTableDirective;


  userInfo: any;
  allUsers: any[] = [];
  editField: string;
  numberOfUsers: number;
  idUserToUpdatePass: number;
  passtoUpdate: string;
  searchText = '';
  previousUser: string;
  mayorEdad: string;
  validatingForm: FormGroup;
  headElementsUsers = [
    'ID',
    'MATERIA',
    'PARALELO',
    'HORARIO',
    'DIAS'
  ];


  /*******INSCRIPCIONES */
  materias: any;
  allFacultades: any = [];
  facultadSelect: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private title: Title,
    private seo: SeoService,
    private storage: AngularFireStorage,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
  ) {

    this.authService.getAllFacultades()
      .subscribe(resp => {
        this.allFacultades = resp;
      });



    this.authService.getAllMaterias()
      .subscribe(res => {
        this.materias = res;


        this.mdbTable.setDataSource(this.materias);
        this.elements = this.mdbTable.getDataSource();
        this.previous = this.mdbTable.getDataSource();
      });
  }
  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    let t: string = "Uisek - Administrador";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Uisek - Administrador",
      description: "Uisek Inscripción",
      slug: "administrador"
    });

    this.iniciarFormCambioPass();

    this.authService.findByToken()
      .subscribe(res => {
        this.userInfo = res;
      }, (err) => {
        this.userInfo = null;
      });
  }










  /**Iniciar FORM CAMBIO PASS */
  iniciarFormCambioPass() {
    this.validatingForm = this.formBuilder.group({
      modalFormRegisterEmail: new FormControl('', Validators.email),
      modalFormRegisterPassword: new FormControl('', Validators.required),
      modalFormRegisterRepeatPassword: new FormControl('', Validators.required)
    }
      , {
        validator: MustMatch('modalFormRegisterPassword', 'modalFormRegisterRepeatPassword')
      });
  }

  /***BUSQUEDA EN LISTAS */
  @HostListener('input') oninput() {
    this.buscarUsuarios();
  }

  filtroBuscar() {
    console.log('IDS: ' + this.facultadSelect.nombreFacultad);
    if (this.idsTipousuario.length > 0) {
      this.authService.findUsuariosByTipo(this.idsTipousuario)
        .subscribe(res => {
          this.allUsers = res;
          // this.mdbTableUsers.setDataSource(this.allUsers);
          //this.previousUser = this.mdbTableUsers.getDataSource();
          this.numberOfUsers = this.allUsers.length;
          //this.llenaListasVacias();

          this.mdbTable.setDataSource(this.allUsers);
          this.elements = this.mdbTable.getDataSource();
          this.previous = this.mdbTable.getDataSource();

        });
    } else {
      this.ngxSmartModalService.create('buscar', 'No se han encontrado resultados').open();
    }
  }

  buscarUsuarios() {

    const prev1 = this.mdbTable.getDataSource();
    if (!this.searchText) {

      this.mdbTable.setDataSource(this.previous);
      this.allUsers = this.mdbTable.getDataSource();
    }
    if (this.searchText) {

      this.allUsers = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev1);
    }
  }

  /**Update PasswordUsuario */
  pasarUsuarioUpdatePassword(user) {
    this.validatingForm.controls.modalFormRegisterEmail.setValue(user.email);
    this.idUserToUpdatePass = user.idUser;
  }
  actualizarPassword() {
    if (this.validatingForm.invalid) {
      this.ngxSmartModalService.create('Password', 'Contraseñas no coinciden').open();
      return;
    }
    this.passtoUpdate = this.validatingForm.get('modalFormRegisterPassword').value;
    this.authService.editUserPassword(this.passtoUpdate, this.idUserToUpdatePass)
      .subscribe(
        res => {
          this.ngxSmartModalService.create('Password', 'Clave Actualizada Exitosamente').open();
        }
      );
  }


 



  

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }


  /***GETTERS */
  get modalFormRegisterEmail() {
    return this.validatingForm.get('modalFormRegisterEmail');
  }

  get modalFormRegisterPassword() {
    return this.validatingForm.get('modalFormRegisterPassword');
  }

  get modalFormRegisterRepeatPassword() {
    return this.validatingForm.get('modalFormRegisterRepeatPassword');
  }

}