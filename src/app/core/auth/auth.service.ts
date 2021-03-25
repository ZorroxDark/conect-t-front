import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Injectable()
export class AuthService
{
    // Private
    private _authenticated: boolean;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this._authenticated = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('access_token', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('access_token');
    }


    /**
     * Setter & getter for access token
     */
     set refreshToken(refreshToken: string)
     {
         localStorage.setItem('refresh_token', refreshToken);
     }
 
     get refreshToken(): string
     {
         return localStorage.getItem('refresh_token');
     }

     /**
     * Setter & getter for access token
     */
      set usuarioLogin(usuarioLogin: string)
      {
          localStorage.setItem('usuario_login', usuarioLogin);
      }
  
      get usuarioLogin(): string
      {
          return localStorage.getItem('usuario_login');
      }

      /**
     * Setter & getter for access token
     */
       set usuarioId(usuarioId: string)
       {
           localStorage.setItem('usuario_id', usuarioId);
       }
   
       get usuarioId(): string
       {
           return localStorage.getItem('usuario_id');
       }

       /**
     * Setter & getter for access token
     */
        set usuarioCon(usuarioCon: string)
        {
            localStorage.setItem('usuario_con', usuarioCon);
        }
    
        get usuarioCon(): string
        {
            return localStorage.getItem('usuario_con');
        }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string, password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

      
            const urlEndpoint = 'http://localhost:8888/oauth/token';
        
            const credenciales = btoa('angularapp' + ':' + '12345');
        
            const httpHeaders = new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + credenciales
            });
        
            let params = new URLSearchParams();
            params.set('grant_type', 'password');
            params.set('username', credentials.email);
            params.set('password', credentials.password);
            console.log(params.toString());
            return this._httpClient.post<any>(urlEndpoint, params.toString(), { headers: httpHeaders }).pipe(
                switchMap((response: any) => {
    
                    // Store the access token in the local storage
                    this.accessToken = response.access_token;

                    // Store the access refresh token in the local storage
                    this.refreshToken = response.refresh_token;

                    // Store the access user login in the local storage
                    let payload = this.obtenerDatosToken(response.access_token);
                    this.usuarioLogin =  payload.user_name;
                    this.usuarioCon= payload.user_con;
                    this.usuarioId= payload.user_id;
    
                    // Set the authenticated flag to true
                    this._authenticated = true;
    
                    // Return a new observable with the response
                    return of(response);
                })
            );
           
          

      
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token

        const urlEndpoint = 'http://localhost:8888/oauth/token';
        
        const credenciales = btoa('angularapp' + ':' + '12345');
    
        const httpHeaders = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + credenciales
        });
    
        let params = new URLSearchParams();
        params.set('grant_type', 'refresh_token');
        params.set('refresh_token', localStorage.getItem('refresh_token'));
        console.log(params.toString());


      return this._httpClient.post<any>(urlEndpoint, params.toString(), { headers: httpHeaders }).pipe(
            catchError(() => {

                // Return false
                return of(false);
            }),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.access_token;
                
                // Store the access refresh token in the local storage
                this.refreshToken = response.refresh_token;

                // Store the access user login in the local storage
                let payload = this.obtenerDatosToken(response.access_token);
                this.usuarioLogin =  payload.user_name;
                this.usuarioCon= payload.user_con;
                this.usuarioId= payload.user_id;
    

                // Set the authenticated flag to true
                this._authenticated = true;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('usuario_login');
        localStorage.removeItem('usuario_id');
        localStorage.removeItem('usuario_con');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }


    obtenerDatosToken(accessToken: string): any {
      if (accessToken != null) {
        return JSON.parse(atob(accessToken.split(".")[1]));
      }
      return null;
    }


    /*
  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any> {
    const urlEndpoint = 'http://localhost:8080/oauth/token';

    const credenciales = btoa('angularapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    console.log(params.toString());
    return this.http.post<any>(urlEndpoint, params.toString(), { headers: httpHeaders });
  }

  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }*/
}
