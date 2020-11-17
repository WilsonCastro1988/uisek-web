import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlGenerica;

  urlFirmesa;

  urlIns;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    this.urlIns = 'https://servicio-uisek-inscripcion.herokuapp.com/';
    this.urlGenerica = 'https://servicio-uisek-admin.herokuapp.com/';
  }

  /*********** INSCRIPCIONES *******/
  getAllMaterias(): Observable<any> {
    return this.http.get(this.urlIns + 'materias/listar');
  }


  getAllFacultades(): Observable<any> {
    return this.http.get(this.urlIns + 'facultad/listar');
  }

  saveInscripcion(data): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'matricula/crear', data);
  }


  /********  USUARIO *******/


  editUserPassword(password, idUser): Observable<any> {
    return this.http.put(this.urlGenerica + 'usuario/actualizaPassword/' + idUser, password);
  }


  signup2(newUser): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'usuario/crear', newUser);
  }

  savePerfilUsuario(data): Observable<any> {
    return this.http.post<any>(this.urlGenerica + 'perfil-usuario/crear', data);
  }

  login2(usuario, password, perfil): Observable<any> {
    return this.http.get(this.urlGenerica + 'usuario/login/' + usuario + "/" + password);
  }
  findByToken(): Observable<any> {
    return this.http.get(this.urlGenerica + 'usuario/ver/' + this.getToken());
  }

  getUserByToken() {
    return this.http.get<any>(this.urlGenerica + 'usuario/ver/' + this.getToken()).subscribe(res => { return res; });
  }


  findUsuariosByTipo(idPerfil): Observable<any> {
    return this.http.get(this.urlGenerica + 'usuario/tipoUsuarioByIdPerfil/' + idPerfil);
  }

  getPerfilById(): Observable<any> {
    return this.http.get(this.urlGenerica + 'usuario/tipoUsuarioByIdUser/' + this.getToken());
  }

  getPerfilByUser(nombreUsuario): Observable<any> {
    return this.http.get(this.urlGenerica + 'perfil/obtenerPerfilesUsuario/' + nombreUsuario);
  }

  getAllPerfiles(): Observable<any> {
    return this.http.get(this.urlGenerica + 'perfil/listar');
  }

  /******* FIN USUARIO *********/


  valor: boolean = false;

  getAdmin() {
    return localStorage.getItem('admin');

  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  obtenerUsuario(): string {
    return localStorage.getItem('token');
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    this.router.navigate(['/home']);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-login/' + 'listar');
  }

  getAllCompanies(): Observable<any> {
    return this.http.get(this.urlGenerica + 'servicio-login/' + 'listar');
  }



}
