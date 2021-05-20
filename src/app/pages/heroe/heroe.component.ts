import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { HeroeModel } from 'src/app/models/heroe.model';
import { HeroesService } from '../../services/heroes.service';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {

  heroe = new HeroeModel();

  constructor( private heroesService: HeroesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);

    if(id !== 'nuevo')
    {
      this.heroesService.getHeroe(id)
      .subscribe( (resp: HeroeModel) => {
        this.heroe = resp;
        this.heroe.id = id;
      });
    }
  }

  guardar(form: NgForm)
  {
    if (form.invalid)
    {
      console.log('Formulario no válido');
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    
    Swal.showLoading();

    let peticion: Observable<any>;


    if (this.heroe.id) // si el id del héroe existe se actualiza, en caso contrario se crea uno nuevo
    {
      peticion = this.heroesService.actualizarHeroe(this.heroe);
      // .subscribe( resp => {
      //     console.log(resp);
      // });
    }
    else
    {
      peticion = this.heroesService.crearHeroe(this.heroe);
      // .subscribe( resp => {
      //     console.log(resp);
      // });
    }

    peticion.subscribe( resp => {
      Swal.fire({
      title: this.heroe.nombre,
      text: 'Se actualizó correctamente',
      icon: 'success',
      allowOutsideClick: false
      });
    });

  }
}
