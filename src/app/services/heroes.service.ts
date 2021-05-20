import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { map,delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url = 'https://loginapp-2f09e.firebaseio.com';

  constructor( private http: HttpClient) { }

  crearHeroe( heroe: HeroeModel)
  {
    return this.http.post(`${this.url}/heroes.json`, heroe)
    .pipe(
      map( (resp: any) => {  // para poner el name sin marcar error se pone el tipo any al parámetro resp
        heroe.id = resp.name;
        return heroe;
      })
    );
  }

  actualizarHeroe( heroe: HeroeModel)
  {
    // con el operador ... se copian todos los atributos del objeto al nuevo objeto en caso de ser muchas
    const heroeTemp = {
      ...heroe
    };

    // con delete se quita la propiedad id del héroe para que no se duplique
    delete heroeTemp.id;

    return this.http.put(`${ this.url }/heroes/${ heroe.id }.json`, heroeTemp);
  }

borrarHeroe( id: string )
{
  return this.http.delete(`${this.url}/heroes/${ id }.json`);
}

getHeroe(id: string)
{
  return this.http.get(`${this.url}/heroes/${ id }.json`);
}


  getHeroes()
  {
    return this.http.get(`${this.url}/heroes.json`)
    .pipe(
      map( resp => {
        return this.crearArreglo(resp);
      }),
      delay(2000)
      // resp => this.crearArreglo(resp) dentro de map es otra opción
    );
  }

  private crearArreglo( heroesObj: object ){
    
    const heroes: HeroeModel[] = [];

    console.log(heroesObj);

    // en caso de que no haya registros en bd, el arreglo se retorna vacío
    if ( heroesObj === null )
    { 
      console.log('Arreglo vacío');
      return [];
    }

    // en caso de haber información se continúa con el flujo


    // se consideran los key del objeto heroesObj (que es un objeto de objetos) y por cada una de ellas
    // se asigna a un objeto heroe de tipo HeroeModel sus valores en la posición correspondiente
    // el id del objeto HeroeModel será cada key
    // al final se agrega el objeto heroe al arreglo de objetos antes definido llamado heroes
    Object.keys( heroesObj ).forEach( key => {

      const heroe: HeroeModel = heroesObj[key];
      
      heroe.id = key;

      heroes.push( heroe );
    });

    return heroes;

  }
}
