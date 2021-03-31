import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

export   class ConstanteService {

     public static urlService:string =  environment.urlService;

     //Catalogos
     public static endPointCatalogos        :string   = ConstanteService.urlService+"/catalogo";
     public static getNavegacion            :string   = ConstanteService.endPointCatalogos + '/getNavegacion/';
     public static getInfoUser              :string   = ConstanteService.endPointCatalogos + '/getInfoUser/';
     
     // Firma electronica
     //public static endPointFirma            :string   = "http://localhost:8080/transverales/";
     //public static firmaSelloURL            :string   = ConstanteService.endPointFirma       + 'getFirmaSello';

     
     //public static httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

     //Authentication Url
     public static authenticationUrl = ConstanteService.urlService+'/oauth/token';



}



