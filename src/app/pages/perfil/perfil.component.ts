import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir!: File; // ver input html
  public imgTemp!: any;

  constructor(  private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private fileUploadService: FileUploadService ) {

                  this.usuario = usuarioService.usuario;

              }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre, Validators.required ],
      email: [ this.usuario.email, [ Validators.required, Validators.email ] ]
    })
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
        .subscribe( () => {
            const { nombre, email } = this.perfilForm.value;
            this.usuario.nombre = nombre;
            this.usuario.email = email;
          Swal.fire('Guardado', 'Los cambios fueron guardados', 'success')
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error')
        })
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

  subirImagen() {
    this.fileUploadService
      .actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid! )
          .then( img => {
            this.usuario.img = img;
            Swal.fire('Guardado', 'Imagen actualizada', 'success')

          }, (err) => {
            Swal.fire('Error', err.error.msg, 'error')
          })
  }

}
