import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription = new Subscription();

  constructor(  private hospitalService: HospitalService,
                private modalImagenService: ModalImagenService,
                private busquedasService: BusquedasService ) { }

      ngOnDestroy(): void {
                  this.imgSubs.unsubscribe();
                }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img => {
      this.cargarHospitales();
    } );
  }

  cargarHospitales() {
    this.cargando = true;

    this.hospitalService.cargarHospitales()
          .subscribe( hospitales => {
            this.cargando = false;
            this.hospitales = hospitales;
            this.hospitalesTemp = hospitales;
          });
  }

  guardarCambios( hospital: Hospital ){
    this.hospitalService.actualizarHospital( hospital._id!, hospital.nombre)
            .subscribe( resp => {
              Swal.fire( 'Actualizado', hospital.nombre, 'success')
            });
  }

  eliminarHospital( hospital: Hospital ){
    this.hospitalService.borrarHospital( hospital._id!)
            .subscribe( resp => {
              this.cargarHospitales();
              Swal.fire( 'Borrado', hospital.nombre, 'success')
            });
  }

async abrirSweetAlert() {

    const { value = '' }  = await Swal.fire<string>({
      input: 'text',
      title: 'Crear Hospital',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true
    })

    if( value!.trim().length > 0 ) {
      this.hospitalService.crearHospital( value! )
          .subscribe( ( resp: any ) => {
              this.hospitales.push( resp.hospital )
          })
    }
}

abrirModal( hospital: Hospital ) {
    this.modalImagenService.abrirModal('hospitales', hospital._id!, hospital.img);
}

// No me gusta esta solución
buscar( termino: string ){


      if ( termino.length === 0 ) {
        return this.hospitales = this.hospitalesTemp;
      }

     return this.busquedasService.buscar( 'hospitales', termino )
            .subscribe( resp => {

              this.hospitales = resp as Hospital[];
            });

}


}
