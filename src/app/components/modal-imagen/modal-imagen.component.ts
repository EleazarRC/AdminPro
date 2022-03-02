import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit {

  public ocultarModal: boolean = false;
  public imagenSubir!: File; // ver input html
  public imgTemp!: any;

  constructor(  public modalImagenService: ModalImagenService,
                private fileUploadService: FileUploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen( event:any ){
    this.imagenSubir = event.target.files[0];


    if( !event.target.files[0] ) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( event.target.files[0] );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

  }

  subirImagen( ) {
    const  id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto( this.imagenSubir, tipo, id )
          .then( img => {
            Swal.fire('Guardado', 'Imagen actualizada', 'success');

            this.modalImagenService.nuevaImagen.emit(img);

            this.cerrarModal();
          }, (err) => {
            Swal.fire('Error', err.error.msg, 'error')
          })
  }

}
