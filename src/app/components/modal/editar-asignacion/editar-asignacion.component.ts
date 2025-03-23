import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FiredatabaseService } from 'src/app/services/firebase/firedatabase.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-editar-asignacion',
  templateUrl: './editar-asignacion.component.html',
  styleUrls: ['./editar-asignacion.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditarAsignacionComponent implements OnInit {

  @Input() asignacion: any;
  asignacionForm: FormGroup;
  trabajadores: any[] = [];
  equipos: any[] = [];
  usuarioActual: any = {};

  constructor(
    private fb: FormBuilder,
    private firebaseService: FiredatabaseService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private storageService: StorageService

  ) { }

  ngOnInit() {
    this.asignacionForm = this.fb.group({
      id: ['', Validators.required],
      fecha_asignacion: [new Date().toISOString().split('T')[0], Validators.required],
      turno: ['1RA', Validators.required],
      trabajador_id: ['', Validators.required],
      equipo_id: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      motivo: ['Entrega inicial', Validators.required],
      firmado: [false],
      usuario_asigna_id: [this.usuarioActual?.email],
      nombre_usuario_asigna: [this.usuarioActual?.usuario]
    });

    this.asignacionForm.patchValue(this.asignacion);
    this.obtenerTrabajadores();
    this.obtenerEquipos();
    this.obtenerUsuarioActual();
  }


  async presentToast(type: 'success' | 'warning' | 'error', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      cssClass: `toast-${type}`
    });
  
    await toast.present();
  }

  obtenerTrabajadores() {
    this.firebaseService.getTrabajadores().subscribe({
      next: (data) => {
        this.trabajadores = data;
      },
      error: (error) => {
        console.error('Error al obtener trabajadores:', error);
      }
    });
  }

  obtenerEquipos() {
    this.firebaseService.getEquipos().subscribe({
      next: (data) => {
        this.equipos = data;
      },
      error: (error) => {
        console.error('Error al obtener equipos:', error);
      }
    })
  }

  async obtenerUsuarioActual() {
    const usuario = await this.storageService.get('usuario');
    if (usuario) {
      this.usuarioActual = usuario;
      this.asignacionForm.patchValue({
        usuario_asigna_id: usuario.email,
        nombre_usuario_asigna: usuario.usuario
      });
    }
  }

  async guardarAsignacion() {
    console.log(this.asignacionForm.value)
    if (this.asignacionForm.valid) {
      try {
        this.firebaseService.updateAsignacion(this.asignacionForm.value).then(res => {
          this.presentToast('success', 'Asignación guardada correctamente');
          this.cerrarModal();
        })
      } catch (error) {
        console.error(error)
        this.presentToast('error', 'Error al guardar la asignaicón de equipo')
      }
    }else{
      this.presentToast('warning', 'Todos los campos son obligatorios')
    }
  }

  async cerrarModal() {
    await this.modalController.dismiss(null);
  }


  

}
