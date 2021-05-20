import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { HeroeModel } from '../../models/heroe.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: HeroeModel[] = [];
  cargando: boolean = false;


  constructor( private heroesService: HeroesService ) { }

  ngOnInit(): void {

    this.cargando = true;

    this.heroesService.getHeroes()
    .subscribe( resp => {
      
      this.heroes = resp;
      this.cargando = false;

    });

  }

  borrarHeroe( heroe: HeroeModel, indice: number )
  {
    Swal.fire({
      title: 'Está seguro?',
      text: `Está seguro que desea borrar a ${ heroe.nombre }?`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    })
    .then( resp => 
      {
        if ( resp.value ) // si la respuesta es true con el confirmbutton se manda borrar, si no lo es con cancelbutton no se hace nada
        {
          this.heroes.splice( indice, 1 ); // borra el registro de los datos temporales de la página web y por ende visualmente
          this.heroesService.borrarHeroe( heroe.id ).subscribe(); // borra los datos de la bd
        }
      });


  }
}
