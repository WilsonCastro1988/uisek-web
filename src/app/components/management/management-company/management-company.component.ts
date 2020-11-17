import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { MdbTableDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-management-company',
  templateUrl: './management-company.component.html',
  styleUrls: ['./management-company.component.css']
})
export class ManagementCompanyComponent implements OnInit {

  @ViewChild(MdbTableDirective, { static: true })
  mdbTableCompany: MdbTableDirective;
  allCompanies: any = [];
  allMaterias: any = [];
  
  editField: string;
  searchText2 = '';
  previousCompany: string;
  headElementsCompanies = [
    'ID',
    'Nombre',
    'Paralelo',
    'Dias',
    'Carrera',
    'Seleccionar'
  ];
  constructor(public authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.getAllMaterias()
      .subscribe(resp => {
        this.allCompanies = resp;
        this.mdbTableCompany.setDataSource(this.allCompanies);
        this.previousCompany = this.mdbTableCompany.getDataSource();

      });

      
  }

  @HostListener('input') oninput() {


    this.buscarCompanias();

  }

  buscarCompanias() {
    const prev = this.mdbTableCompany.getDataSource();

    if (!this.searchText2) {
      this.mdbTableCompany.setDataSource(this.previousCompany);
      this.allCompanies = this.mdbTableCompany.getDataSource();
    }

    if (this.searchText2) {
      this.allCompanies = this.mdbTableCompany.searchLocalDataBy(this.searchText2);
      this.mdbTableCompany.setDataSource(prev);
    }
  }


  aniadirmaterias(idList: any, userId: any) {
    this.allMaterias.add(idList, 1);
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }



}
