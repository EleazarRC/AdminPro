import { Component, OnInit, OnDestroy } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { MedicoService } from '../../../services/medico.service';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private imgSubs: Subscription = new Subscription();

  constructor( private medicoService: MedicoService,
                private modalImagenService: ModalImagenService,
                private busquedasService: BusquedasService ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img => {
      this.cargarMedicos();
    } );
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
      });
  }

  abrirModal( medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);

  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.cargarMedicos();
    }

   return this.busquedasService.buscar( 'medicos', termino )
          .subscribe( resp => {

            this.medicos = resp as Medico[];
          });

  }
  borrarMedico( medico: Medico ) {

   return Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está apunto de borrar a ${ medico.nombre }` ,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, Borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico( medico._id! )
          .subscribe( resp =>
            {
              this.cargarMedicos();
              Swal.fire(
              '¡Borrado!',
              `El ${ medico.nombre } a sido borrado.`,
              'success'

              );
            });

          }
      })

  }
}
