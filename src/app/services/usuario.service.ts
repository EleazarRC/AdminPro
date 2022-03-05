import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';


import { RegisterForm } from '../interfaces/register-form.interfaces';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;

declare const gapi:any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario!: Usuario;

  constructor(  private http: HttpClient,
                private router: Router,
                private ngZone: NgZone
                )
                {
                  this.googleInit();
                }

  get token(): string {
      return localStorage.getItem('token') || '';
  }

  get uid(): string {
      return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role!;
  }

  guardarLocalStorage( token: string, menu: any ){

    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify( menu ) );
  }

  googleInit() {
      return new Promise<void>( resolve => {

        gapi.load('auth2', () =>{
          // Retrieve the singleton for the GoogleAuth library and set up the client.
          this.auth2 = gapi.auth2.init({
            client_id: '533854617778-tvmos89083bbmj84dl5hb0dps3nscbs3.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
          });

          resolve();
          //this.attachSignin(document.getElementById('my-signin2'));
        });
      })
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then( () => {

      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      })
    });

  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp:any) => {

        const {
          email,
          google,
          nombre,
          role,
          img = '',
          uid } = resp.usuario;

          this.usuario = new Usuario( nombre, email, '', img, google, role, uid )

         /*  localStorage.setItem('token', resp.token);
          localStorage.setItem('menu', resp.menu );

 */       this.guardarLocalStorage(resp.token, resp.menu);
          return true;
      }),
      catchError( error => of( false ))
    )
  }

  crearUsuario( fromData: RegisterForm ){

    return this.http.post( `${base_url}/usuarios`, fromData )
                  .pipe(
                    tap( (resp: any ) => {

                      this.guardarLocalStorage(resp.token, resp.men);

                    })
                  );
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string | undefined }){

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers )
  }

  login( fromData: LoginForm ){

    return this.http.post( `${base_url}/login`, fromData )
                  .pipe(
                    tap( (resp: any ) => {
                      this.guardarLocalStorage(resp.token, resp.men);
                    })
                  );

  }

  loginGoogle( token:any ){

    return this.http.post( `${base_url}/login/google`, { token } )
                  .pipe(
                    tap( (resp: any ) => {
                      this.guardarLocalStorage(resp.token, resp.men);
                    })
                  );

  }

  cargarUsuarios( desde: number = 0) {

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>( url, this.headers )
            .pipe(
              map( resp =>{
                const usuarios = resp.usuarios.map(
                  user => new Usuario( user.nombre, user.email, '', user.img,
                  user.google,user.role, user.uid )
                );
                return {
                  total: resp.total,
                  usuarios
                };
              })
            )
  }

  eliminarUsuario( usuario: Usuario ){

    const url = `${base_url}/usuarios/${ usuario.uid }`;
    return this.http.delete( url, this.headers );

  }

  guardarUsuario( usuario: Usuario ){

    /* data = {
      ...data,
      role: this.usuario.role
    } */

    return this.http.put(`${base_url}/usuarios/${ usuario.uid}`, usuario, this.headers )
  }
}


